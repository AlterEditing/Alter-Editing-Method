const fs = require("fs");
const path = require("path");

const DEFAULT_SETTINGS = {
  settingsVersion: 3,
  language: "ru",
  theme: "dark",
  authRequired: true,
  authorized: false,
  telegramId: null,
  authToken: "",
  dismissedMandatoryVersion: "",
};

const SUPPORTED_LANGUAGES = new Set(["ru", "en", "tr"]);
const SUPPORTED_THEMES = new Set(["dark", "light"]);

class SettingsStore {
  constructor(electronApp) {
    this.filePath = path.join(electronApp.getPath("userData"), "settings.json");
    this.data = this.load();
  }

  getAll() {
    return { ...this.data };
  }

  update(patch = {}) {
    const next = { ...this.data, ...patch };
    this.data = normalizeSettings(next);
    this.save();
    return this.getAll();
  }

  load() {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.saveDefaults();
      }
      const raw = fs.readFileSync(this.filePath, "utf8");
      return normalizeSettings(JSON.parse(raw));
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf8");
  }

  saveDefaults() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf8");
  }
}

function normalizeSettings(raw = {}) {
  const language = SUPPORTED_LANGUAGES.has(String(raw.language || "").toLowerCase())
    ? String(raw.language).toLowerCase()
    : DEFAULT_SETTINGS.language;
  const theme = SUPPORTED_THEMES.has(String(raw.theme || "").toLowerCase())
    ? String(raw.theme).toLowerCase()
    : DEFAULT_SETTINGS.theme;
  const authRequired = true;
  const authToken = typeof raw.authToken === "string" ? raw.authToken : "";
  const telegramId = normalizeTelegramId(raw.telegramId);
  const authorized = Boolean(authToken && telegramId);
  const dismissedMandatoryVersion =
    typeof raw.dismissedMandatoryVersion === "string" ? raw.dismissedMandatoryVersion.trim() : "";

  return {
    settingsVersion: DEFAULT_SETTINGS.settingsVersion,
    language,
    theme,
    authRequired,
    authorized,
    telegramId,
    authToken,
    dismissedMandatoryVersion,
  };
}

function normalizeTelegramId(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber) || asNumber <= 0) {
    return null;
  }
  return String(Math.trunc(asNumber));
}

module.exports = {
  SettingsStore,
};
