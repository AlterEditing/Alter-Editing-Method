const fs = require("fs");
const https = require("https");
const path = require("path");
const { app, shell } = require("electron");
const { autoUpdater } = require("electron-updater");

const DEFAULT_GITHUB_OWNER = "AlterEditing";
const DEFAULT_GITHUB_REPO = "Alter-Editing-Method";
const DEV_UPDATE_CONFIG_FILE = "dev-app-update.yml";
const DEV_UPDATER_ENV_NAMES = ["ALTERE_ENABLE_DEV_UPDATER", "ALTERE_FORCE_DEV_UPDATES"];

const MANDATORY_PATTERNS = [
  /\[(mandatory|force)\]/i,
  /\bmandatory\s*[:=]\s*true\b/i,
  /\bforce\s*[:=]\s*true\b/i,
  /\b(critical|required)\s+update\b/i,
  /\bобязательн(ое|ый|ая)\s+обновлен/i,
];

const CLEAN_RELEASE_PATTERNS = [
  /\[(mandatory|force)\]/gi,
  /\bmandatory\s*[:=]\s*true\b/gi,
  /\bforce\s*[:=]\s*true\b/gi,
];

function createUpdateService({ settingsStore, onStateChange, onLog }) {
  const devUpdater = isDevUpdaterEnabled();
  let sessionDismissedMandatoryVersion = "";
  let downloadedFilePath = "";
  let githubOwner = DEFAULT_GITHUB_OWNER;
  let githubRepo = DEFAULT_GITHUB_REPO;
  let allowPrerelease = false;

  const state = {
    supported: app.isPackaged || devUpdater,
    checking: false,
    available: false,
    downloaded: false,
    downloading: false,
    downloadProgress: 0,
    transferredBytes: 0,
    sizeBytes: 0,
    version: "",
    mandatory: false,
    releaseNotes: "",
    error: "",
    mandatoryDismissed: false,
    checkedAt: 0,
    githubOwner,
    githubRepo,
    allowPrerelease,
  };

  if (state.supported) {
    configureUpdater();
    applyPreferences(settingsStore?.getAll?.() || {});
  }

  function configureUpdater() {
    if (devUpdater) {
      autoUpdater.forceDevUpdateConfig = true;
      onLog?.("info", "Dev updater mode enabled");
    }

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.allowDowngrade = false;
    autoUpdater.allowPrerelease = allowPrerelease;

    autoUpdater.on("checking-for-update", () => {
      updateState({ checking: true, error: "" });
      onLog?.("info", "Update check started");
    });

    autoUpdater.on("update-not-available", () => {
      downloadedFilePath = "";
      updateState({
        checking: false,
        available: false,
        downloaded: false,
        downloading: false,
        downloadProgress: 0,
        transferredBytes: 0,
        sizeBytes: 0,
        version: "",
        mandatory: false,
        releaseNotes: "",
        error: "",
        mandatoryDismissed: false,
        checkedAt: Date.now(),
      });
      onLog?.("info", "No updates available");
    });

    autoUpdater.on("update-available", async (info) => {
      const version = String(info?.version || "").trim();
      const releaseNotes = normalizeReleaseNotes(info?.releaseNotes);
      const apiNotes = releaseNotes || (await fetchReleaseBody(version, githubOwner, githubRepo));
      const mandatory = detectMandatoryUpdate(apiNotes);
      const estimatedSizeBytes = resolveUpdateSizeBytes(info);

      downloadedFilePath = "";
      updateState({
        checking: false,
        available: true,
        downloaded: false,
        downloading: false,
        downloadProgress: 0,
        transferredBytes: 0,
        // Do not show guessed size before real download starts.
        sizeBytes: 0,
        version,
        mandatory,
        releaseNotes: cleanReleaseNotes(apiNotes),
        error: "",
        mandatoryDismissed: Boolean(mandatory && sessionDismissedMandatoryVersion === version),
        checkedAt: Date.now(),
      });

      if (estimatedSizeBytes > 0) {
        onLog?.("info", `Update estimated package size: ${estimatedSizeBytes} bytes`);
      }
      onLog?.("info", `Update available: ${version}${mandatory ? " (mandatory)" : ""}`);
    });

    autoUpdater.on("download-progress", (progress) => {
      const percent = Number(progress?.percent || 0);
      const transferredBytes = toPositiveNumber(progress?.transferred);
      const totalBytes = toPositiveNumber(progress?.total);
      const previousTotalBytes = toPositiveNumber(state.sizeBytes);
      if (previousTotalBytes > 0 && totalBytes > Math.max(previousTotalBytes * 1.4, previousTotalBytes + 20 * 1024 * 1024)) {
        onLog?.("warning", "Update switched to full package download (differential package unavailable)");
      }
      updateState({
        checking: false,
        downloading: true,
        downloadProgress: clamp(percent, 0, 100),
        transferredBytes: transferredBytes || state.transferredBytes,
        sizeBytes: totalBytes || state.sizeBytes,
        error: "",
      });
    });

    autoUpdater.on("update-downloaded", (info) => {
      downloadedFilePath = resolveDownloadedFilePath(info) || downloadedFilePath;
      updateState({
        checking: false,
        downloading: false,
        downloaded: true,
        downloadProgress: 100,
        transferredBytes: state.sizeBytes || state.transferredBytes,
        error: "",
      });
      onLog?.("success", `Update ${state.version} downloaded`);
    });

    autoUpdater.on("error", (error) => {
      const message = normalizeError(error);
      updateState({
        checking: false,
        downloading: false,
        error: message,
      });
      onLog?.("error", "Update error", message);
    });
  }

  function updateState(patch) {
    Object.assign(state, patch);
    onStateChange?.(getState());
  }

  function applyPreferences(settings = {}) {
    const nextOwner = normalizeRepoPart(settings.updateRepoOwner) || DEFAULT_GITHUB_OWNER;
    const nextRepo = normalizeRepoPart(settings.updateRepoName) || DEFAULT_GITHUB_REPO;
    const nextAllowPrerelease = Boolean(settings.updateAllowPrerelease);

    githubOwner = nextOwner;
    githubRepo = nextRepo;
    allowPrerelease = nextAllowPrerelease;

    try {
      autoUpdater.allowPrerelease = allowPrerelease;
      autoUpdater.setFeedURL({
        provider: "github",
        owner: githubOwner,
        repo: githubRepo,
        releaseType: allowPrerelease ? "prerelease" : "release",
      });
    } catch (error) {
      onLog?.("warning", "Update feed reconfigure failed", normalizeError(error));
    }

    updateState({
      githubOwner,
      githubRepo,
      allowPrerelease,
    });
    onLog?.("info", `Update source: ${githubOwner}/${githubRepo} | prerelease=${allowPrerelease ? "on" : "off"}`);
    return getState();
  }

  function getState() {
    return { ...state };
  }

  async function checkForUpdates() {
    if (!state.supported) {
      return getState();
    }
    await autoUpdater.checkForUpdates();
    return getState();
  }

  async function downloadUpdate() {
    if (!state.supported || !state.available || state.downloading) {
      return getState();
    }
    if (state.downloaded) {
      return getState();
    }
    updateState({ downloading: true, error: "" });
    const downloadedFiles = await autoUpdater.downloadUpdate();
    if (Array.isArray(downloadedFiles) && downloadedFiles[0]) {
      downloadedFilePath = String(downloadedFiles[0]);
    }
    return getState();
  }

  function installUpdateNow() {
    if (!state.supported || !state.downloaded) {
      return false;
    }

    if (devUpdater && downloadedFilePath) {
      shell.openPath(downloadedFilePath).then((errorMessage) => {
        if (errorMessage) {
          onLog?.("error", "Failed to open downloaded installer", errorMessage);
        }
      });
      setTimeout(() => app.quit(), 500);
      return true;
    }

    setImmediate(() => autoUpdater.quitAndInstall(true, true));
    return true;
  }

  function dismissMandatory(version) {
    const nextVersion = String(version || "").trim();
    sessionDismissedMandatoryVersion = nextVersion;
    updateState({ mandatoryDismissed: Boolean(nextVersion && nextVersion === state.version) });
    return getState();
  }

  function clearMandatoryDismiss(version) {
    const targetVersion = String(version || "");
    if (sessionDismissedMandatoryVersion !== targetVersion) {
      return;
    }
    sessionDismissedMandatoryVersion = "";
    updateState({ mandatoryDismissed: false });
  }

  function isDownloading() {
    return Boolean(state.downloading);
  }

  return {
    getState,
    checkForUpdates,
    downloadUpdate,
    installUpdateNow,
    dismissMandatory,
    clearMandatoryDismiss,
    isDownloading,
    applyPreferences,
  };
}

function isDevUpdaterEnabled() {
  if (app.isPackaged) {
    return false;
  }

  if (DEV_UPDATER_ENV_NAMES.some((name) => String(process.env[name] || "") === "1")) {
    return true;
  }

  try {
    return fs.existsSync(path.join(app.getAppPath(), DEV_UPDATE_CONFIG_FILE));
  } catch {
    return false;
  }
}

function detectMandatoryUpdate(text) {
  const value = String(text || "");
  return MANDATORY_PATTERNS.some((pattern) => pattern.test(value));
}

function cleanReleaseNotes(value) {
  let text = normalizeReleaseNotes(value);
  for (const pattern of CLEAN_RELEASE_PATTERNS) {
    text = text.replace(pattern, "");
  }

  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function normalizeReleaseNotes(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item.note === "string") {
          return item.note;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
}

function resolveUpdateSizeBytes(info) {
  const candidates = [];
  const addCandidate = (fileLike) => {
    if (!fileLike || typeof fileLike !== "object") {
      return;
    }

    const fileName = String(fileLike.url || fileLike.path || fileLike.name || "").toLowerCase();
    if (fileName.endsWith(".blockmap") || fileName.endsWith(".yml") || fileName.endsWith(".yaml")) {
      return;
    }

    const size = toPositiveNumber(fileLike.size || fileLike.sizeBytes || fileLike.fileSize);
    if (size > 0) {
      candidates.push(size);
    }
  };

  if (Array.isArray(info?.files)) {
    info.files.forEach(addCandidate);
  }
  addCandidate(info);

  if (!candidates.length) {
    return 0;
  }

  return Math.max(...candidates);
}

function resolveDownloadedFilePath(info) {
  if (!info || typeof info !== "object") {
    return "";
  }

  return String(info.downloadedFile || info.file || info.path || "").trim();
}

async function fetchReleaseBody(version, owner = DEFAULT_GITHUB_OWNER, repo = DEFAULT_GITHUB_REPO) {
  const targetVersion = String(version || "").trim();
  if (!targetVersion) {
    return "";
  }

  const attempts = [`v${targetVersion}`, targetVersion];
  for (const tag of attempts) {
    const body = await fetchReleaseBodyByTag(tag, owner, repo);
    if (body) {
      return body;
    }
  }

  return "";
}

function fetchReleaseBodyByTag(tag, owner = DEFAULT_GITHUB_OWNER, repo = DEFAULT_GITHUB_REPO) {
  return new Promise((resolve) => {
    const safeOwner = normalizeRepoPart(owner) || DEFAULT_GITHUB_OWNER;
    const safeRepo = normalizeRepoPart(repo) || DEFAULT_GITHUB_REPO;
    const url = `https://api.github.com/repos/${safeOwner}/${safeRepo}/releases/tags/${encodeURIComponent(tag)}`;
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "AlterEditingMethod-Updater",
          Accept: "application/vnd.github+json",
        },
      },
      (response) => {
        let raw = "";

        response.on("data", (chunk) => {
          raw += String(chunk);
          if (raw.length > 2_000_000) {
            raw = raw.slice(0, 2_000_000);
          }
        });

        response.on("end", () => {
          if (response.statusCode !== 200) {
            resolve("");
            return;
          }

          try {
            const parsed = JSON.parse(raw);
            resolve(String(parsed?.body || "").trim());
          } catch {
            resolve("");
          }
        });
      }
    );

    request.on("error", () => resolve(""));
    request.setTimeout(6000, () => {
      request.destroy();
      resolve("");
    });
  });
}

function normalizeRepoPart(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return /^[-A-Za-z0-9_.]+$/.test(raw) ? raw : "";
}

function normalizeError(error) {
  return String(error?.message || error || "Unknown update error")
    .replace(/^Error:\s*/i, "")
    .trim();
}

function toPositiveNumber(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function clamp(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.max(min, Math.min(max, numeric));
}

module.exports = {
  createUpdateService,
  detectMandatoryUpdate,
  cleanReleaseNotes,
  resolveUpdateSizeBytes,
};
