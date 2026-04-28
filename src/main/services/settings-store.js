const fs = require("fs");
const path = require("path");

const DEFAULT_SETTINGS = {
  settingsVersion: 4,
  language: "en",
  theme: "dark",
  authRequired: true,
  authorized: false,
  telegramId: null,
  authToken: "",
  authApiBase: "http://132.243.30.159:3000",
  authApiFallbacks: [],
  telegramChannelUrl: "https://t.me/alterediting",
  telegramBotUrl: "",
  authConfigUpdatedAt: 0,
  updateRepoOwner: "AlterEditing",
  updateRepoName: "Alter-Editing-Method",
  updateAllowPrerelease: false,
  dismissedMandatoryVersion: "",
};

const SUPPORTED_LANGUAGES = new Set(["ru", "en", "tr"]);
const SUPPORTED_THEMES = new Set(["dark", "light"]);

class SettingsStore {
  constructor(electronApp) {
    this.defaultSettings = createDefaultSettings(electronApp);
    this.filePath = path.join(electronApp.getPath("userData"), "settings.json");
    this.data = this.load();
  }

  getAll() {
    return { ...this.data };
  }

  update(patch = {}) {
    const next = { ...this.data, ...patch };
    this.data = normalizeSettings(next, this.defaultSettings);
    this.save();
    return this.getAll();
  }

  load() {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.saveDefaults();
      }
      const raw = fs.readFileSync(this.filePath, "utf8");
      return normalizeSettings(JSON.parse(raw), this.defaultSettings);
    } catch {
      return { ...this.defaultSettings };
    }
  }

  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf8");
  }

  saveDefaults() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.defaultSettings, null, 2), "utf8");
  }
}

function createDefaultSettings(electronApp) {
  const locale = typeof electronApp?.getLocale === "function" ? electronApp.getLocale() : "";
  const version = typeof electronApp?.getVersion === "function" ? electronApp.getVersion() : "";
  const releaseChannel = String(process.env.ALTERE_RELEASE_CHANNEL || "")
    .trim()
    .toLowerCase();
  const defaultAllowPrerelease =
    releaseChannel === "beta" ||
    releaseChannel === "alpha" ||
    /\b(beta|alpha)\b/i.test(String(version || ""));
  return {
    ...DEFAULT_SETTINGS,
    language: normalizeLanguageCode(locale) || DEFAULT_SETTINGS.language,
    updateAllowPrerelease: defaultAllowPrerelease,
  };
}

function normalizeLanguageCode(locale) {
  const code = String(locale || "").toLowerCase();
  if (code.startsWith("ru")) return "ru";
  if (code.startsWith("tr")) return "tr";
  if (code.startsWith("en")) return "en";
  return "";
}

function normalizeSettings(raw = {}, defaults = DEFAULT_SETTINGS) {
  const language = SUPPORTED_LANGUAGES.has(String(raw.language || "").toLowerCase())
    ? String(raw.language).toLowerCase()
    : defaults.language;
  const theme = SUPPORTED_THEMES.has(String(raw.theme || "").toLowerCase())
    ? String(raw.theme).toLowerCase()
    : defaults.theme;
  const authRequired = true;
  const authToken = typeof raw.authToken === "string" ? raw.authToken : "";
  const telegramId = normalizeTelegramId(raw.telegramId);
  const authorized = Boolean(authToken && telegramId);
  const dismissedMandatoryVersion =
    typeof raw.dismissedMandatoryVersion === "string" ? raw.dismissedMandatoryVersion.trim() : "";
  const authApiBase = normalizeHttpUrl(raw.authApiBase, { allowHttp: true, allowHttps: true }) || defaults.authApiBase;
  const authApiFallbacks = normalizeFallbackUrls(raw.authApiFallbacks);
  const telegramChannelUrl =
    normalizeHttpUrl(raw.telegramChannelUrl, { allowHttp: false, allowHttps: true }) || defaults.telegramChannelUrl;
  const telegramBotUrl = normalizeHttpUrl(raw.telegramBotUrl, { allowHttp: false, allowHttps: true });
  const authConfigUpdatedAt = Number.isFinite(Number(raw.authConfigUpdatedAt))
    ? Math.max(0, Math.trunc(Number(raw.authConfigUpdatedAt)))
    : 0;
  const updateRepoOwner = normalizeRepoPart(raw.updateRepoOwner) || defaults.updateRepoOwner;
  const updateRepoName = normalizeRepoPart(raw.updateRepoName) || defaults.updateRepoName;
  const updateAllowPrerelease =
    typeof raw.updateAllowPrerelease === "boolean"
      ? raw.updateAllowPrerelease
      : Boolean(defaults.updateAllowPrerelease);

  return {
    settingsVersion: defaults.settingsVersion,
    language,
    theme,
    authRequired,
    authorized,
    telegramId,
    authToken,
    authApiBase,
    authApiFallbacks,
    telegramChannelUrl,
    telegramBotUrl,
    authConfigUpdatedAt,
    updateRepoOwner,
    updateRepoName,
    updateAllowPrerelease,
    dismissedMandatoryVersion,
  };
}

function normalizeRepoPart(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return /^[-A-Za-z0-9_.]+$/.test(raw) ? raw : "";
}

function normalizeFallbackUrls(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .map((entry) => normalizeHttpUrl(entry, { allowHttp: true, allowHttps: true }))
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

function normalizeHttpUrl(value, { allowHttp = true, allowHttps = true } = {}) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" && !allowHttp) {
      return "";
    }
    if (parsed.protocol === "https:" && !allowHttps) {
      return "";
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
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
