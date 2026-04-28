const { contextBridge, ipcRenderer, webUtils } = require("electron");

function subscribe(channel, callback) {
  const handler = (_event, ...args) => callback(...args);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld("alterE", {
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    close: () => ipcRenderer.invoke("window:close"),
  },
  settings: {
    get: () => ipcRenderer.invoke("settings:get"),
    update: (patch) => ipcRenderer.invoke("settings:update", patch),
    onChanged: (callback) => subscribe("settings:changed", callback),
  },
  dialog: {
    selectVideo: () => ipcRenderer.invoke("dialog:select-video"),
    saveOutput: (payload) => ipcRenderer.invoke("dialog:save-output", payload),
  },
  video: {
    getPathForFile: (file) => webUtils.getPathForFile(file),
    isSupported: (filePath) => ipcRenderer.invoke("video:is-supported", filePath),
    isAlreadyPatched: (filePath) => ipcRenderer.invoke("video:is-already-patched", filePath),
    probe: (filePath) => ipcRenderer.invoke("video:probe", filePath),
    patch: (payload) => ipcRenderer.invoke("video:patch", payload),
    cancel: () => ipcRenderer.invoke("video:cancel"),
    onProgress: (callback) => subscribe("video:progress", callback),
  },
  shell: {
    openExternal: (url) => ipcRenderer.invoke("shell:open-external", url),
    showItem: (filePath) => ipcRenderer.invoke("shell:show-item", filePath),
    openSupportBot: () => ipcRenderer.invoke("support:open-bot"),
  },
  clipboard: {
    writeText: (text) => ipcRenderer.invoke("clipboard:write-text", text),
  },
  logs: {
    export: (text) => ipcRenderer.invoke("logs:export", text),
  },
  app: {
    getRuntimeConfig: () => ipcRenderer.invoke("app:get-runtime-config"),
    respondCloseConfirmation: (shouldClose) => ipcRenderer.invoke("app:close-confirmation-result", shouldClose),
    onRequestCloseConfirmation: (callback) => subscribe("app:request-close-confirmation", callback),
  },
  update: {
    getState: () => ipcRenderer.invoke("update:get-state"),
    check: () => ipcRenderer.invoke("update:check"),
    download: () => ipcRenderer.invoke("update:download"),
    install: () => ipcRenderer.invoke("update:install"),
    dismissMandatory: (version) => ipcRenderer.invoke("update:dismiss-mandatory", version),
    onState: (callback) => subscribe("update:state", callback),
    onLog: (callback) => subscribe("update:log", callback),
  },
  auth: {
    onDeepLink: (callback) => subscribe("auth:deep-link", callback),
  },
});
