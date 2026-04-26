const { app, BrowserWindow, clipboard, dialog, ipcMain, shell } = require("electron");
const fs = require("fs");
const path = require("path");

const { SettingsStore } = require("./services/settings-store");
const {
  cancelActivePatch,
  createDefaultOutputPath,
  isAlreadyPatchedVideo,
  isPatchInProgress,
  isSupportedVideoPath,
  patchVideo,
  probeVideo,
} = require("./services/video-service");
const { createUpdateService } = require("./services/update-service");

let mainWindow = null;
let settingsStore = null;
let updateService = null;
let pendingDeepLinkUrl = null;
let windowReadyToShow = false;
let windowDidFinishLoad = false;
let allowCloseAfterRenderCancel = false;
let closeConfirmInProgress = false;
let closeConfirmResolver = null;
let closeConfirmTimer = null;

const APP_PROTOCOL = "alterediting";

function assetPath(...segments) {
  return path.join(app.getAppPath(), "assets", ...segments);
}

function resolveWindowIconPath() {
  if (process.platform === "win32") {
    return assetPath("logo.ico");
  }
  return assetPath("logo-dark.svg");
}

function createWindow() {
  windowReadyToShow = false;
  windowDidFinishLoad = false;
  allowCloseAfterRenderCancel = false;
  closeConfirmInProgress = false;
  resolveCloseConfirmation(false);

  mainWindow = new BrowserWindow({
    width: 500,
    height: 720,
    minWidth: 340,
    minHeight: 500,
    backgroundColor: "#101418",
    frame: false,
    show: false,
    resizable: true,
    title: "Alter Editing Method",
    icon: resolveWindowIconPath(),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, "..", "preload", "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  mainWindow.once("ready-to-show", () => {
    windowReadyToShow = true;
    if (process.env.ALTERE_SMOKE_TEST === "1") {
      setTimeout(() => app.quit(), 300);
      return;
    }

    showWindowWhenReady();
  });
  mainWindow.webContents.once("did-finish-load", () => {
    windowDidFinishLoad = true;
    showWindowWhenReady();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    windowReadyToShow = false;
    windowDidFinishLoad = false;
    allowCloseAfterRenderCancel = false;
    closeConfirmInProgress = false;
    resolveCloseConfirmation(false);
  });

  mainWindow.on("close", (event) => {
    if (allowCloseAfterRenderCancel) {
      return;
    }

    const patchInProgress = isPatchInProgress();
    const updateDownloading = Boolean(updateService?.isDownloading?.());
    if (!patchInProgress && !updateDownloading) {
      return;
    }

    event.preventDefault();
    if (closeConfirmInProgress) {
      return;
    }
    closeConfirmInProgress = true;
    requestCloseConfirmation({
      reason: getCloseConfirmationReason({ patchInProgress, updateDownloading }),
      patchInProgress,
      updateDownloading,
    })
      .then((shouldClose) => {
        closeConfirmInProgress = false;
        if (!shouldClose || !mainWindow || mainWindow.isDestroyed()) {
          return;
        }
        if (patchInProgress) {
          cancelActivePatch();
        }
        allowCloseAfterRenderCancel = true;
        mainWindow.close();
      })
      .catch(() => {
        closeConfirmInProgress = false;
      });
  });
}

function resolveCloseConfirmation(shouldClose) {
  if (!closeConfirmResolver) {
    return;
  }
  const resolver = closeConfirmResolver;
  closeConfirmResolver = null;
  if (closeConfirmTimer) {
    clearTimeout(closeConfirmTimer);
    closeConfirmTimer = null;
  }
  resolver(Boolean(shouldClose));
}

function requestCloseConfirmation(payload = {}) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    closeConfirmResolver = resolve;
    closeConfirmTimer = setTimeout(() => resolveCloseConfirmation(false), 45000);
    mainWindow.webContents.send("app:request-close-confirmation", payload);
  });
}

function getCloseConfirmationReason({ patchInProgress, updateDownloading }) {
  if (patchInProgress && updateDownloading) {
    return "patch-and-update-download";
  }
  if (updateDownloading) {
    return "update-download";
  }
  return "patch";
}

function showWindowWhenReady() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  if (!windowReadyToShow || !windowDidFinishLoad) {
    return;
  }
  if (!mainWindow.isVisible()) {
    mainWindow.show();
    flushPendingDeepLink();
  }
}


function registerProtocolClient() {
  if (process.defaultApp && process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
    return;
  }

  app.setAsDefaultProtocolClient(APP_PROTOCOL);
}

function handleDeepLink(url) {
  const target = String(url || "");
  if (!target) {
    return;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("auth:deep-link", target);
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    return;
  }

  pendingDeepLinkUrl = target;
}

function flushPendingDeepLink() {
  if (!pendingDeepLinkUrl || !mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const url = pendingDeepLinkUrl;
  pendingDeepLinkUrl = null;
  mainWindow.webContents.send("auth:deep-link", url);
}

function registerWindowIpc() {
  ipcMain.handle("app:get-runtime-config", () => {
    const fallbackBase = "https://auth.alterediting.com";
    const configuredBase = String(process.env.ALTERE_AUTH_API_BASE || "").trim();
    return {
      authApiBase: configuredBase || fallbackBase,
    };
  });

  ipcMain.handle("window:minimize", () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  ipcMain.handle("window:close", () => {
    BrowserWindow.getFocusedWindow()?.close();
  });

  ipcMain.handle("app:close-confirmation-result", (_event, shouldClose) => {
    resolveCloseConfirmation(Boolean(shouldClose));
    return true;
  });

}

function registerSettingsIpc() {
  ipcMain.handle("settings:get", () => settingsStore.getAll());

  ipcMain.handle("settings:update", (_event, patch) => {
    const next = settingsStore.update(patch);
    mainWindow?.webContents.send("settings:changed", next);
    return next;
  });
}

function registerDialogIpc() {
  ipcMain.handle("dialog:select-video", async () => {
    if (!mainWindow) {
      return null;
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select video",
      properties: ["openFile"],
      filters: [{ name: "Supported video", extensions: ["mp4", "mov"] }],
    });

    if (result.canceled || !result.filePaths.length) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle("dialog:save-output", async (_event, payload = {}) => {
    if (!mainWindow) {
      return null;
    }

    const inputPath = String(payload.inputPath || "");
    const mode = String(payload.mode || "balanced");
    const defaultPath = createDefaultOutputPath(inputPath, mode);
    const isSource = mode === "source";

    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Save patched video",
      defaultPath,
      filters: [
        isSource
          ? { name: "Supported video", extensions: ["mp4", "mov"] }
          : { name: "HEVC MP4", extensions: ["mp4"] },
      ],
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    return result.filePath;
  });
}

function registerVideoIpc() {
  ipcMain.handle("video:probe", async (_event, filePath) => {
    return probeVideo(String(filePath || ""));
  });

  ipcMain.handle("video:patch", async (event, payload = {}) => {
    const sender = event.sender;
    return patchVideo({
      inputPath: String(payload.inputPath || ""),
      outputPath: String(payload.outputPath || ""),
      mode: String(payload.mode || "balanced"),
      outputBitrateKbps: Number(payload.outputBitrateKbps || 0),
      sourceVideoBitrateKbps: Number(payload.sourceVideoBitrateKbps || 0),
      durationSeconds: Number(payload.durationSeconds || 0),
      onProgress: (progress) => sender.send("video:progress", progress),
    });
  });

  ipcMain.handle("video:cancel", () => cancelActivePatch());

  ipcMain.handle("video:is-supported", (_event, filePath) => {
    return isSupportedVideoPath(String(filePath || ""));
  });

  ipcMain.handle("video:is-already-patched", async (_event, filePath) => {
    const target = String(filePath || "");
    if (!isSupportedVideoPath(target)) {
      return false;
    }
    return isAlreadyPatchedVideo(target);
  });
}

function registerShellIpc() {
  ipcMain.handle("shell:open-external", (_event, url) => {
    const target = String(url || "");
    if (!/^https?:\/\//i.test(target)) {
      return false;
    }
    shell.openExternal(target);
    return true;
  });

  ipcMain.handle("shell:show-item", (_event, filePath) => {
    const target = String(filePath || "");
    if (!target) {
      return false;
    }
    shell.showItemInFolder(target);
    return true;
  });
}

function registerUtilityIpc() {
  ipcMain.handle("clipboard:write-text", (_event, text) => {
    clipboard.writeText(String(text || ""));
    return true;
  });

  ipcMain.handle("logs:export", async (_event, text) => {
    if (!mainWindow) {
      return null;
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Export logs",
      defaultPath: `altere-${stamp}.log`,
      filters: [{ name: "Log file", extensions: ["log", "txt"] }],
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await fs.promises.writeFile(result.filePath, String(text || ""), "utf8");
    return result.filePath;
  });
}

function registerUpdateIpc() {
  ipcMain.handle("update:get-state", () => updateService?.getState() || { supported: false });
  ipcMain.handle("update:check", async () => updateService?.checkForUpdates());
  ipcMain.handle("update:download", async () => updateService?.downloadUpdate());
  ipcMain.handle("update:install", () => updateService?.installUpdateNow() || false);
  ipcMain.handle("update:dismiss-mandatory", (_event, version) => {
    return updateService?.dismissMandatory(String(version || ""));
  });
}

function sendUpdateState(state) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  mainWindow.webContents.send("update:state", state);
}

function pushLogNotification(level, title, message = "") {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  mainWindow.webContents.send("update:log", {
    level: String(level || "info"),
    title: String(title || ""),
    message: String(message || ""),
  });
}

registerProtocolClient();

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const link = argv.find((arg) => String(arg).startsWith(`${APP_PROTOCOL}://`));
    if (link) {
      handleDeepLink(link);
    }
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
  });
}

app.whenReady().then(() => {
  settingsStore = new SettingsStore(app);
  updateService = createUpdateService({
    settingsStore,
    onStateChange: sendUpdateState,
    onLog: pushLogNotification,
  });

  registerWindowIpc();
  registerSettingsIpc();
  registerDialogIpc();
  registerVideoIpc();
  registerShellIpc();
  registerUtilityIpc();
  registerUpdateIpc();
  createWindow();
  setTimeout(() => {
    updateService?.checkForUpdates().catch((error) => {
      pushLogNotification("error", "Update check failed", String(error?.message || error || ""));
    });
  }, 1800);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
