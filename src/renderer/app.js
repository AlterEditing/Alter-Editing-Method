const icons = {
  upload:
    '<svg viewBox="0 0 24 24"><path d="M12 16V4"/><path d="m6 10 6-6 6 6"/><path d="M5 20h14"/></svg>',
  terminal:
    '<svg viewBox="0 0 24 24"><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>',
  bell:
    '<svg viewBox="0 0 24 24"><path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/></svg>',
  settings:
    '<svg viewBox="0 0 24 24"><path d="M9.67 2h4.66l.6 2.03a7.8 7.8 0 0 1 1.66.96l2.08-.5L21 8.52l-1.48 1.54a7.3 7.3 0 0 1 0 1.88L21 13.48l-2.33 4.03-2.08-.5a7.8 7.8 0 0 1-1.66.96l-.6 2.03H9.67l-.6-2.03a7.8 7.8 0 0 1-1.66-.96l-2.08.5L3 13.48l1.48-1.54a7.3 7.3 0 0 1 0-1.88L3 8.52l2.33-4.03 2.08.5a7.8 7.8 0 0 1 1.66-.96z"/><circle cx="12" cy="11" r="3"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M12 3a6.8 6.8 0 0 0 9 9 9 9 0 1 1-9-9"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  languages:
    '<svg viewBox="0 0 24 24"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
  download:
    '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 20h16"/></svg>',
  help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/></svg>',
  renderSettings:
    '<svg viewBox="0 0 24 24"><path d="M9.67 2h4.66l.6 2.03a7.8 7.8 0 0 1 1.66.96l2.08-.5L21 8.52l-1.48 1.54a7.3 7.3 0 0 1 0 1.88L21 13.48l-2.33 4.03-2.08-.5a7.8 7.8 0 0 1-1.66.96l-.6 2.03H9.67l-.6-2.03a7.8 7.8 0 0 1-1.66-.96l-2.08.5L3 13.48l1.48-1.54a7.3 7.3 0 0 1 0-1.88L3 8.52l2.33-4.03 2.08.5a7.8 7.8 0 0 1 1.66-.96z"/><circle cx="12" cy="11" r="3"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  github:
    '<svg viewBox="0 0 24 24"><path d="M12 2.7a9.3 9.3 0 0 0-2.94 18.12c.46.09.62-.2.62-.44v-1.55c-2.54.56-3.07-1.07-3.07-1.07-.42-1.05-1.02-1.33-1.02-1.33-.84-.57.06-.56.06-.56.93.06 1.42.94 1.42.94.82 1.42 2.17 1 2.7.77.08-.6.32-1 .58-1.22-2.03-.23-4.16-1.01-4.16-4.5 0-.99.35-1.79.94-2.42-.1-.22-.41-1.14.09-2.36 0 0 .76-.24 2.49.92a8.7 8.7 0 0 1 4.54 0c1.73-1.16 2.49-.92 2.49-.92.5 1.22.19 2.14.09 2.36.59.63.94 1.43.94 2.42 0 3.5-2.13 4.27-4.17 4.5.33.28.61.83.61 1.67v2.6c0 .24.16.53.63.44A9.3 9.3 0 0 0 12 2.7"/></svg>',
};

const translations = {
  en: {
    outputSize: "Output size",
    selectVideo: "Select video",
    changeVideo: "Select another video",
    patch: "PATCH",
    cancel: "CANCEL",
    low: "Low",
    balanced: "Balanced",
    source: "Source",
    settings: "Settings",
    notifications: "Notifications",
    logs: "Logs",
    emptyNotifications: "No notifications yet.",
    emptyLogs: "Logs will appear after actions in the app.",
    themeDark: "Dark theme",
    themeLight: "Light theme",
    language: "Language",
    authorize: "Authorization",
    authTitle: "ALTER EDITING METHOD",
    authText: "Confirm your subscription in Telegram to sign in.",
    authChecking: "Checking authorization...",
    authWaiting: "Confirm the subscription in Telegram, then return here.",
    authFailed: "Authorization failed. Try again.",
    authServerUnavailable: "Authorization server is unavailable. Please try again later.",
    offlineAccessExpired: "Offline access time has expired. Please authorize again when the server is available.",
    authSuccess: "Authorization complete",
    subscriptionRequired: "Subscription required",
    retry: "RETRY",
    copied: "Copied",
    exported: "Logs exported",
    copyLogs: "Copy",
    exportLogs: "Export",
    selectError: "Select an MP4 or MOV video.",
    alreadyPatched: "This video is already patched.",
    unsupported: "Only MP4 and MOV videos are supported.",
    sourceMissing: "Source video was not found.",
    probing: "Reading video metadata...",
    loaded: "Video loaded",
    started: "Patch started",
    completed: "Patch completed",
    saved: "File saved:",
    failed: "Patch failed",
    cancelled: "Patch cancelled",
    busy: "Processing is already running.",
    noVideo: "Select a video first.",
    saveCancelled: "Output selection cancelled.",
    updates: "Update",
    updateAvailable: "Update available",
    updateMandatoryTitle: "Mandatory update available",
    updateMandatoryText: "A newer version is required to continue using all features.",
    updateDownload: "Download update",
    updateDownloadAndInstall: "Download and install",
    updateInstall: "Install",
    updateLater: "Later",
    updateDontShow: "Don't show again",
    updateSize: "Size",
    updateSizeUnknown: "unknown",
    updateVersion: "Version",
    updateDescriptionFallback: "No short update description is available.",
    updateReadyTitle: "Update is ready",
    updateReadyText: "The update has been downloaded and is ready to install.",
    updateDownloading: "Downloading update",
    closeConfirmTitle: "Attention",
    closeConfirmText: "Do you really want to interrupt video processing?",
    closeConfirmUpdateText: "If you exit now, the update download will stop.",
    closeConfirmPatchAndUpdateText: "If you exit now, video processing will stop and the update download will be interrupted.",
    closeConfirmClose: "Close",
    closeConfirmStay: "Stay",
    logoutDone: "You have signed out.",
    howToUse: "How to use",
    tutorialTitle: "How to use",
    tutorialStep1Title: "1. Select video",
    tutorialStep1Text: "Drag and drop a video, or click the frame to select a file.",
    tutorialStep2Title: "2. Set bitrate",
    tutorialStep2Text: "Choose bitrate or keep source quality.",
    tutorialStep3Title: "3. Patch video",
    tutorialStep3Text: "Press PATCH and wait until processing is complete.",
    tutorialStep4Title: "4. Upload to TikTok",
    tutorialStep4Text: "Upload the processed video to TikTok.",
    tutorialDone: "Got it",
    renderSettings: "Render settings",
    renderCodec: "Codec",
    renderContainer: "Container",
    renderAudioMode: "Audio mode",
    renderAudioBitrate: "Audio bitrate",
    resetToSource: "Reset to source",
    sourceValue: "Source",
    codecH264: "H.264",
    codecH265: "H.265",
    containerMp4: "MP4",
    containerMov: "MOV",
    audioAac: "AAC",
    renderSettingsCustomHint: "Custom render settings are enabled",
    renderSettingsDone: "Done",
    support: "Support",
    supportInvoked: "Support request sent",
    supportOpen: "Open support bot",
    supportFailed: "Failed to send support request",
    riskWarningTitle: "Warning",
    riskWarningText: "Risk detected: {issues}. Continue anyway?",
    riskIssueBitrate: "bitrate is above 70 Mbps",
    riskIssueResolution: "resolution is above 1920x1080",
    riskIssueBoth: "bitrate is above 70 Mbps and resolution is above 1920x1080",
    continueAnyway: "Continue",
    cancelAction: "Cancel",
    mb: "MB",
    kbps: "kbps",
    fps: "fps",
    updateRepoPrompt: "GitHub repo (owner/repo)",
    updateRepoInvalid: "Invalid repo format. Use owner/repo.",
    updatePrefsSaved: "Update source preferences saved.",
    updateBetaToggle: "Beta",
    updatePrefsOpenRepo: "Open repo",
    updatePrefsSave: "Save",
    updatePrefsClose: "Close",
  },
  ru: {
    outputSize: "Выходной размер",
    selectVideo: "Выбрать видео",
    changeVideo: "Выбрать другое видео",
    patch: "PATCH",
    cancel: "ОТМЕНА",
    low: "Низкий",
    balanced: "Баланс",
    source: "Исходник",
    settings: "Настройки",
    notifications: "Уведомления",
    logs: "Логи",
    emptyNotifications: "Пока нет уведомлений.",
    emptyLogs: "Логи появятся после действий в приложении.",
    themeDark: "Темная тема",
    themeLight: "Светлая тема",
    language: "Язык",
    authorize: "Авторизация",
    authTitle: "ALTER EDITING METHOD",
    authText: "Подтвердите подписку в Telegram чтобы войти.",
    authChecking: "Проверяем авторизацию...",
    authWaiting: "Подтвердите подписку в Telegram и вернитесь сюда.",
    authFailed: "Ошибка авторизации. Попробуйте снова.",
    authServerUnavailable: "Сервер авторизации недоступен. Пожалуйста, попробуйте позже.",
    offlineAccessExpired: "Время офлайн-доступа истекло. Выполните авторизацию снова, когда сервер станет доступен.",
    authSuccess: "Авторизация выполнена",
    subscriptionRequired: "Нужна подписка",
    retry: "ПОВТОРИТЬ",
    copied: "Скопировано",
    exported: "Логи экспортированы",
    copyLogs: "Копировать",
    exportLogs: "Экспорт",
    selectError: "Выберите MP4 или MOV видео.",
    alreadyPatched: "Это видео уже запатчено.",
    unsupported: "Поддерживаются только MP4 и MOV видео.",
    sourceMissing: "Исходное видео не найдено.",
    probing: "Читаем метаданные видео...",
    loaded: "Видео загружено",
    started: "Патч запущен",
    completed: "Патч завершен",
    saved: "Файл сохранен:",
    failed: "Ошибка патча",
    cancelled: "Патч отменен",
    busy: "Обработка уже идет.",
    noVideo: "Сначала выберите видео.",
    saveCancelled: "Сохранение отменено.",
    updates: "Обновление",
    updateAvailable: "Доступно обновление",
    updateMandatoryTitle: "Доступно обязательное обновление",
    updateMandatoryText: "Для продолжения работы нужна более новая версия.",
    updateDownload: "Скачать обновление",
    updateDownloadAndInstall: "Скачать и установить",
    updateInstall: "Установить",
    updateLater: "Позже",
    updateDontShow: "Больше не показывать",
    updateSize: "Размер",
    updateSizeUnknown: "неизвестно",
    updateVersion: "Версия",
    updateDescriptionFallback: "Краткое описание обновления недоступно.",
    updateReadyTitle: "Обновление готово",
    updateReadyText: "Обновление скачано и готово к установке.",
    updateDownloading: "Скачивание обновления",
    closeConfirmTitle: "Внимание",
    closeConfirmText: "Вы действительно хотите прервать обработку видео?",
    closeConfirmUpdateText: "Если выйти сейчас, загрузка обновления прекратится.",
    closeConfirmPatchAndUpdateText: "Если выйти сейчас, обработка видео остановится, а загрузка обновления прекратится.",
    closeConfirmClose: "Закрыть",
    closeConfirmStay: "Остаться",
    mb: "МБ",
    kbps: "кбит/с",
    fps: "fps",
    renderSettings: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0440\u0435\u043d\u0434\u0435\u0440\u0430",
    renderCodec: "\u041a\u043e\u0434\u0435\u043a",
    renderContainer: "\u041a\u043e\u043d\u0442\u0435\u0439\u043d\u0435\u0440",
    renderAudioMode: "\u0420\u0435\u0436\u0438\u043c \u0430\u0443\u0434\u0438\u043e",
    renderAudioBitrate: "\u0410\u0443\u0434\u0438\u043e \u0431\u0438\u0442\u0440\u0435\u0439\u0442",
    resetToSource: "\u0421\u0431\u0440\u043e\u0441 \u043a \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u043c",
    sourceValue: "\u0418\u0441\u0445\u043e\u0434\u043d\u043e\u0435",
    codecH264: "H.264",
    codecH265: "H.265",
    containerMp4: "MP4",
    containerMov: "MOV",
    audioAac: "AAC",
    audioSource: "\u0418\u0441\u0445\u043e\u0434\u043d\u043e\u0435 (\u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b)",
    renderSettingsCustomHint: "\u0412\u043a\u043b\u044e\u0447\u0435\u043d\u044b \u043d\u0435\u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0440\u0435\u043d\u0434\u0435\u0440\u0430",
    renderSettingsDone: "\u0413\u043e\u0442\u043e\u0432\u043e",
    support: "\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430",
    supportInvoked: "\u0417\u0430\u043f\u0440\u043e\u0441 \u0432 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d",
    supportOpen: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0431\u043e\u0442 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438",
    supportFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441 \u0432 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443",
    riskWarningTitle: "\u0412\u043d\u0438\u043c\u0430\u043d\u0438\u0435",
    riskWarningText: "\u041e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d \u0440\u0438\u0441\u043a: {issues}. \u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c?",
    riskIssueBitrate: "\u0431\u0438\u0442\u0440\u0435\u0439\u0442 \u0432\u044b\u0448\u0435 70 Mbps",
    riskIssueResolution: "\u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0432\u044b\u0448\u0435 1920x1080",
    riskIssueBoth: "\u0431\u0438\u0442\u0440\u0435\u0439\u0442 \u0432\u044b\u0448\u0435 70 Mbps \u0438 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0432\u044b\u0448\u0435 1920x1080",
  },
  tr: {
    outputSize: "Cikis boyutu",
    selectVideo: "Video sec",
    changeVideo: "Baska video sec",
    patch: "PATCH",
    cancel: "CANCEL",
    low: "Low",
    balanced: "Balanced",
    source: "Source",
    settings: "Ayarlar",
    notifications: "Bildirimler",
    logs: "Loglar",
    emptyNotifications: "Henuz bildirim yok.",
    emptyLogs: "Loglar uygulama islemlerinden sonra gorunur.",
    themeDark: "Koyu tema",
    themeLight: "Acik tema",
    language: "Dil",
    authorize: "Yetkilendirme",
    authTitle: "ALTER EDITING METHOD",
    authText: "Giris yapmak icin Telegram aboneligini onaylayin.",
    authChecking: "Yetki kontrol ediliyor...",
    authWaiting: "Telegram aboneligini onaylayin ve buraya donun.",
    authFailed: "Yetkilendirme basarisiz. Tekrar deneyin.",
    authServerUnavailable: "Yetkilendirme sunucusu kullanilamiyor. Lutfen daha sonra tekrar deneyin.",
    offlineAccessExpired: "Cevrimdisi erisim suresi doldu. Sunucu ulasilabilir oldugunda yeniden yetkilendirin.",
    authSuccess: "Authorization complete",
    subscriptionRequired: "Subscription required",
    retry: "RETRY",
    copied: "Copied",
    exported: "Logs exported",
    copyLogs: "Copy",
    exportLogs: "Export",
    selectError: "MP4 veya MOV video secin.",
    alreadyPatched: "This video is already patched.",
    unsupported: "Yalnizca MP4 ve MOV videolar desteklenir.",
    sourceMissing: "Kaynak video bulunamadi.",
    probing: "Video metadatasi okunuyor...",
    loaded: "Video yuklendi",
    started: "Patch basladi",
    completed: "Patch tamamlandi",
    saved: "Dosya kaydedildi:",
    failed: "Patch basarisiz",
    cancelled: "Patch iptal edildi",
    busy: "Islem zaten calisiyor.",
    noVideo: "Once bir video secin.",
    saveCancelled: "Cikis secimi iptal edildi.",
    updates: "Guncelleme",
    updateAvailable: "Guncelleme mevcut",
    updateMandatoryTitle: "Zorunlu guncelleme mevcut",
    updateMandatoryText: "Devam etmek icin daha yeni bir surum gerekli.",
    updateDownload: "Guncellemeyi indir",
    updateDownloadAndInstall: "Indir ve kur",
    updateInstall: "Kur",
    updateLater: "Daha sonra",
    updateDontShow: "Tekrar gosterme",
    updateSize: "Boyut",
    updateSizeUnknown: "bilinmiyor",
    updateVersion: "Surum",
    updateDescriptionFallback: "Kisa guncelleme aciklamasi yok.",
    updateReadyTitle: "Guncelleme hazir",
    updateReadyText: "Guncelleme indirildi ve kuruluma hazir.",
    updateDownloading: "Guncelleme indiriliyor",
    closeConfirmTitle: "Dikkat",
    closeConfirmText: "Video islemesini durdurmak istediginize emin misiniz?",
    closeConfirmUpdateText: "Simdi cikarsaniz guncelleme indirmesi durur.",
    closeConfirmPatchAndUpdateText: "Simdi cikarsaniz video islemesi durur ve guncelleme indirmesi kesilir.",
    closeConfirmClose: "Kapat",
    closeConfirmStay: "Kal",
    mb: "MB",
    kbps: "kbps",
    fps: "fps",
    renderSettings: "Render ayarlari",
    renderCodec: "Codec",
    renderContainer: "Container",
    renderAudioMode: "Ses modu",
    renderAudioBitrate: "Ses bitrate",
    resetToSource: "Kaynaga sifirla",
    sourceValue: "Kaynak",
    codecH264: "H.264",
    codecH265: "H.265",
    containerMp4: "MP4",
    containerMov: "MOV",
    audioAac: "AAC",
    audioSource: "Kaynak (orijinal)",
    renderSettingsCustomHint: "Ozel render ayarlari etkin",
    renderSettingsDone: "Tamam",
    support: "Destek",
    supportInvoked: "Destek talebi gonderildi",
    supportOpen: "Destek botunu ac",
    supportFailed: "Destek talebi gonderilemedi",
    riskWarningTitle: "Uyari",
    riskWarningText: "Risk algilandi: {issues}. Yine de devam edilsin mi?",
    riskIssueBitrate: "bitrate 70 Mbps ustunde",
    riskIssueResolution: "cozunurluk 1920x1080 ustunde",
    riskIssueBoth: "bitrate 70 Mbps ve cozunurluk 1920x1080 ustunde",
  },
};

const guideTranslations = {
  en: {
    howToUse: "How to use",
    tutorialTitle: "How to use",
    tutorialStep1Title: "1. Select video",
    tutorialStep1Text: "Drag and drop a video, or click the frame to select a file.",
    tutorialStep2Title: "2. Set bitrate",
    tutorialStep2Text: "Choose bitrate or keep source quality.",
    tutorialStep3Title: "3. Patch video",
    tutorialStep3Text: "Press PATCH and wait until processing is complete.",
    tutorialStep4Title: "4. Upload to TikTok",
    tutorialStep4Text: "Upload the processed video to TikTok.",
    tutorialDone: "Got it",
  },
  ru: {
    howToUse: "\u041a\u0430\u043a \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c",
    tutorialTitle: "\u041a\u0430\u043a \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c",
    tutorialStep1Title: "1. \u0412\u044b\u0431\u043e\u0440 \u0432\u0438\u0434\u0435\u043e",
    tutorialStep1Text:
      "\u041f\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u043e \u0432 \u043e\u043a\u043d\u043e \u0438\u043b\u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u0440\u0430\u043c\u043a\u0443 \u0434\u043b\u044f \u0432\u044b\u0431\u043e\u0440\u0430 \u0444\u0430\u0439\u043b\u0430.",
    tutorialStep2Title: "2. \u0411\u0438\u0442\u0440\u0435\u0439\u0442",
    tutorialStep2Text:
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0438\u0442\u0440\u0435\u0439\u0442 \u0438\u043b\u0438 \u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0438\u0441\u0445\u043e\u0434\u043d\u043e\u0435 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e.",
    tutorialStep3Title: "3. \u041f\u0430\u0442\u0447",
    tutorialStep3Text:
      "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 PATCH \u0438 \u0434\u043e\u0436\u0434\u0438\u0442\u0435\u0441\u044c \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u044f \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438.",
    tutorialStep4Title: "4. \u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0432 TikTok",
    tutorialStep4Text:
      "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043d\u043e\u0435 \u0432\u0438\u0434\u0435\u043e \u0432 TikTok.",
    tutorialDone: "\u041f\u043e\u043d\u044f\u0442\u043d\u043e",
  },
  tr: {
    howToUse: "Nasil kullanilir",
    tutorialTitle: "Nasil kullanilir",
    tutorialStep1Title: "1. Video sec",
    tutorialStep1Text: "Videoyu surukleyip birakin veya cerceveye tiklayip dosya secin.",
    tutorialStep2Title: "2. Bitrate ayarla",
    tutorialStep2Text: "Bitrate secin veya kaynak kalitesini koruyun.",
    tutorialStep3Title: "3. Patch uygula",
    tutorialStep3Text: "PATCH tusuna basin ve islem tamamlanana kadar bekleyin.",
    tutorialStep4Title: "4. TikTok'a yukle",
    tutorialStep4Text: "Islenen videoyu TikTok'a yukleyin.",
    tutorialDone: "Tamam",
  },
};

const languageOrder = ["ru", "en", "tr"];
const DEFAULT_AUTH_API_BASE = "http://132.243.30.159:3000";
const DEFAULT_TELEGRAM_CHANNEL_URL = "https://t.me/alterediting";
const DEFAULT_SUPPORT_BOT_URL = "https://t.me/alterediting_support_bot";
let authApiBase = DEFAULT_AUTH_API_BASE;
let authApiFallbacks = [];
let telegramChannelUrl = DEFAULT_TELEGRAM_CHANNEL_URL;
let currentBotUrl = "";
let runtimeAppVersion = "";
const AUTH_POLL_INTERVAL_MS = 2000;
const AUTH_POLL_TIMEOUT_MS = 10 * 60 * 1000;
const AUTH_SUBSCRIPTION_RETRY_MS = 30 * 1000;
const AUTH_FETCH_TIMEOUT_MS = 7000;
const AUTH_SERVER_CONFIG_PATH = "/client-config";
const AUTH_OFFLINE_BOT_NONCE_TTL_MS = 20 * 60 * 1000;
const AUTH_OFFLINE_MAX_MS = 24 * 60 * 60 * 1000;
const RENDER_DEFAULTS = Object.freeze({
  codec: "source",
  container: "source",
  audioMode: "source",
  audioBitrateKbps: 192,
});

const state = {
  settings: {
    settingsVersion: 5,
    language: "en",
    theme: "dark",
    authRequired: true,
    authorized: false,
    telegramId: null,
    authToken: "",
    authApiBase: DEFAULT_AUTH_API_BASE,
    authApiFallbacks: [],
    telegramChannelUrl: DEFAULT_TELEGRAM_CHANNEL_URL,
    telegramBotUrl: "",
    authConfigUpdatedAt: 0,
    offlineAuthStartedAt: 0,
    renderCodec: RENDER_DEFAULTS.codec,
    renderContainer: RENDER_DEFAULTS.container,
    renderAudioMode: RENDER_DEFAULTS.audioMode,
    renderAudioBitrateKbps: RENDER_DEFAULTS.audioBitrateKbps,
    updateRepoOwner: "AlterEditing",
    updateRepoName: "Alter-Editing-Method",
    updateAllowPrerelease: false,
  },
  auth: {
    checking: false,
    pending: false,
    error: "",
    sessionId: "",
    startedAt: 0,
    pollTimer: null,
    subscriptionCheckedThisSession: false,
    subscriptionCheckInFlight: false,
    subscriptionRetryTimer: null,
    offlineGuest: false,
    degradedReason: "",
    guestCheckInFlight: false,
    guestRetryTimer: null,
    offlineBotNonce: "",
    offlineBotExpiresAt: 0,
  },
  video: null,
  mode: "balanced",
  outputBitrateKbps: 10000,
  progress: 0,
  working: false,
  probing: false,
  loadRequestId: 0,
  openPanel: "",
  notifications: [],
  logs: [],
  unreadNotifications: 0,
  closeConfirmVisible: false,
  closeConfirmReason: "patch",
  update: {
    supported: false,
    checking: false,
    available: false,
    downloaded: false,
    downloading: false,
    downloadProgress: 0,
    transferredBytes: 0,
    sizeBytes: 0,
    version: "",
    mandatory: false,
    mandatoryDismissed: false,
    releaseNotes: "",
    error: "",
  },
  updateDialog: {
    visible: false,
    installAfterDownload: false,
  },
  versionMenuVisible: false,
  tutorialVisible: false,
  riskConfirmVisible: false,
  renderSettingsVisible: false,
};

let authConfigPersistInFlight = false;
let authConfigPersistPending = false;
let riskConfirmResolver = null;

const elements = {
  body: document.body,
  bootScreen: document.getElementById("bootScreen"),
  bootLogo: document.getElementById("bootLogo"),
  appShell: document.querySelector(".app-shell"),
  particles: document.getElementById("particles"),
  brandLogo: document.getElementById("brandLogo"),
  appVersionLabel: document.getElementById("appVersionLabel"),
  dropZone: document.getElementById("dropZone"),
  uploadIcon: document.getElementById("uploadIcon"),
  videoPreview: document.getElementById("videoPreview"),
  fileTitle: document.getElementById("fileTitle"),
  fileMeta: document.getElementById("fileMeta"),
  fileStream: document.getElementById("fileStream"),
  howToUseButton: document.getElementById("howToUseButton"),
  howToUseLabel: document.getElementById("howToUseLabel"),
  selectPill: document.getElementById("selectPill"),
  dropProgress: document.getElementById("dropProgress"),
  outputSizeLabel: document.getElementById("outputSizeLabel"),
  outputSizeValue: document.getElementById("outputSizeValue"),
  renderSettingsButton: document.getElementById("renderSettingsButton"),
  renderSettingsOverlay: document.getElementById("renderSettingsOverlay"),
  renderSettingsTitle: document.getElementById("renderSettingsTitle"),
  renderCodecLabel: document.getElementById("renderCodecLabel"),
  renderCodecSelect: document.getElementById("renderCodecSelect"),
  renderContainerLabel: document.getElementById("renderContainerLabel"),
  renderContainerSelect: document.getElementById("renderContainerSelect"),
  renderAudioModeLabel: document.getElementById("renderAudioModeLabel"),
  renderAudioModeSelect: document.getElementById("renderAudioModeSelect"),
  renderAudioBitrateLabel: document.getElementById("renderAudioBitrateLabel"),
  renderAudioBitrateSelect: document.getElementById("renderAudioBitrateSelect"),
  renderSettingsResetButton: document.getElementById("renderSettingsResetButton"),
  renderSettingsDoneButton: document.getElementById("renderSettingsDoneButton"),
  bitrateSlider: document.getElementById("bitrateSlider"),
  bitrateInput: document.getElementById("bitrateInput"),
  bitrateUnit: document.getElementById("bitrateUnit"),
  patchButton: document.getElementById("patchButton"),
  patchButtonLabel: document.getElementById("patchButtonLabel"),
  patchProgress: document.getElementById("patchProgress"),
  logsButton: document.getElementById("logsButton"),
  notificationsButton: document.getElementById("notificationsButton"),
  updateButton: document.getElementById("updateButton"),
  settingsButton: document.getElementById("settingsButton"),
  notificationBadge: document.getElementById("notificationBadge"),
  minimizeButton: document.getElementById("minimizeButton"),
  closeButton: document.getElementById("closeButton"),
  settingsPanel: document.getElementById("settingsPanel"),
  notificationsPanel: document.getElementById("notificationsPanel"),
  logsPanel: document.getElementById("logsPanel"),
  settingsTitle: document.getElementById("settingsTitle"),
  settingsUpdateWrap: document.getElementById("settingsUpdateWrap"),
  settingsVersionArea: document.getElementById("settingsVersionArea"),
  settingsVersionMenu: document.getElementById("settingsVersionMenu"),
  updateBetaToggle: document.getElementById("updateBetaToggle"),
  updateBetaToggleLabel: document.getElementById("updateBetaToggleLabel"),
  openRepoButton: document.getElementById("openRepoButton"),
  logoutButton: document.getElementById("logoutButton"),
  notificationsTitle: document.getElementById("notificationsTitle"),
  logsTitle: document.getElementById("logsTitle"),
  languageButton: document.getElementById("languageButton"),
  themeButton: document.getElementById("themeButton"),
  supportButton: document.getElementById("supportButton"),
  notificationsList: document.getElementById("notificationsList"),
  logsList: document.getElementById("logsList"),
  copyLogsButton: document.getElementById("copyLogsButton"),
  exportLogsButton: document.getElementById("exportLogsButton"),
  telegramLink: document.getElementById("telegramLink"),
  authOverlay: document.getElementById("authOverlay"),
  authLogo: document.getElementById("authLogo"),
  authTitle: document.getElementById("authTitle"),
  authText: document.getElementById("authText"),
  authButton: document.getElementById("authButton"),
  mandatoryUpdateOverlay: document.getElementById("mandatoryUpdateOverlay"),
  mandatoryUpdateTitle: document.getElementById("mandatoryUpdateTitle"),
  mandatoryUpdateText: document.getElementById("mandatoryUpdateText"),
  mandatoryUpdateDownloadButton: document.getElementById("mandatoryUpdateDownloadButton"),
  mandatoryUpdateLaterButton: document.getElementById("mandatoryUpdateLaterButton"),
  mandatoryUpdateCloseButton: document.getElementById("mandatoryUpdateCloseButton"),
  updateDetailsOverlay: document.getElementById("updateDetailsOverlay"),
  updateDetailsTitle: document.getElementById("updateDetailsTitle"),
  updateDetailsVersion: document.getElementById("updateDetailsVersion"),
  updateDetailsNotes: document.getElementById("updateDetailsNotes"),
  updateDetailsSize: document.getElementById("updateDetailsSize"),
  updateDetailsProgressBlock: document.getElementById("updateDetailsProgressBlock"),
  updateDetailsProgressText: document.getElementById("updateDetailsProgressText"),
  updateDetailsProgressValue: document.getElementById("updateDetailsProgressValue"),
  updateDetailsProgressBar: document.getElementById("updateDetailsProgressBar"),
  updateDetailsDownloadButton: document.getElementById("updateDetailsDownloadButton"),
  updateDetailsLaterButton: document.getElementById("updateDetailsLaterButton"),
  updateDetailsCloseButton: document.getElementById("updateDetailsCloseButton"),
  closeConfirmOverlay: document.getElementById("closeConfirmOverlay"),
  closeConfirmTitle: document.getElementById("closeConfirmTitle"),
  closeConfirmText: document.getElementById("closeConfirmText"),
  closeConfirmStayButton: document.getElementById("closeConfirmStayButton"),
  closeConfirmLeaveButton: document.getElementById("closeConfirmLeaveButton"),
  riskConfirmOverlay: document.getElementById("riskConfirmOverlay"),
  riskConfirmTitle: document.getElementById("riskConfirmTitle"),
  riskConfirmText: document.getElementById("riskConfirmText"),
  riskConfirmCancelButton: document.getElementById("riskConfirmCancelButton"),
  riskConfirmContinueButton: document.getElementById("riskConfirmContinueButton"),
  tutorialOverlay: document.getElementById("tutorialOverlay"),
  tutorialCloseButton: document.getElementById("tutorialCloseButton"),
  tutorialTitle: document.getElementById("tutorialTitle"),
  tutorialStep1Title: document.getElementById("tutorialStep1Title"),
  tutorialStep1Text: document.getElementById("tutorialStep1Text"),
  tutorialStep2Title: document.getElementById("tutorialStep2Title"),
  tutorialStep2Text: document.getElementById("tutorialStep2Text"),
  tutorialStep3Title: document.getElementById("tutorialStep3Title"),
  tutorialStep3Text: document.getElementById("tutorialStep3Text"),
  tutorialStep4Title: document.getElementById("tutorialStep4Title"),
  tutorialStep4Text: document.getElementById("tutorialStep4Text"),
  tutorialDoneButton: document.getElementById("tutorialDoneButton"),
  tutorialVideos: Array.from(document.querySelectorAll(".tutorial-video")),
  toastHost: document.getElementById("toastHost"),
};

const logoCache = new Map();
const logoRenderState = new WeakMap();
let lastUpdateNoticeKey = "";
let lastUpdateReadyNoticeKey = "";
const BOOT_MIN_VISIBLE_MS = 640;
const BOOT_HIDE_DURATION_MS = 620;
const PAGE_LOADED_PROMISE =
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

function t(key) {
  const lang = translations[state.settings.language] ? state.settings.language : "en";
  return translations[lang][key] || translations.en[key] || key;
}

function tEn(key) {
  return translations.en[key] || key;
}

function tGuide(key) {
  const lang = guideTranslations[state.settings.language] ? state.settings.language : "en";
  return guideTranslations[lang][key] || guideTranslations.en[key] || key;
}

function setIcon(element, iconName) {
  if (!element) {
    return;
  }
  element.innerHTML = icons[iconName] || "";
}

function setActionButton(element, iconName, label) {
  element.innerHTML = `${icons[iconName] || ""}<span>${escapeHtml(label)}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initIcons() {
  setIcon(elements.logsButton, "terminal");
  setIcon(elements.notificationsButton, "bell");
  elements.notificationsButton.appendChild(elements.notificationBadge);
  setIcon(elements.settingsButton, "settings");
  setIcon(elements.renderSettingsButton, "renderSettings");
  setIcon(elements.logoutButton, "logout");
  setIcon(elements.minimizeButton, "minus");
  setIcon(elements.closeButton, "close");
  elements.uploadIcon.innerHTML = icons.upload;
  const tutorialIcon = elements.howToUseButton?.querySelector(".tutorial-trigger-icon");
  if (tutorialIcon) {
    tutorialIcon.innerHTML = icons.help;
  }
  setIcon(elements.openRepoButton, "github");
  setIcon(elements.supportButton, "send");
  renderTelegramLink();
}

function applyRuntimeConfig(runtimeConfig = {}) {
  const runtimeAuthBase = normalizeHttpUrl(runtimeConfig?.authApiBase, {
    allowHttp: true,
    allowHttps: true,
  });
  if (runtimeAuthBase) {
    authApiBase = runtimeAuthBase;
  }

  const runtimeFallbacks = Array.isArray(runtimeConfig?.authApiFallbacks)
    ? runtimeConfig.authApiFallbacks
    : [];
  authApiFallbacks = runtimeFallbacks
    .map((item) => normalizeHttpUrl(item, { allowHttp: true, allowHttps: true }))
    .filter(Boolean);

  const runtimeChannel = normalizeHttpUrl(runtimeConfig?.telegramChannelUrl, {
    allowHttp: false,
    allowHttps: true,
  });
  if (runtimeChannel) {
    telegramChannelUrl = runtimeChannel;
  }
  runtimeAppVersion = String(runtimeConfig?.appVersion || "").trim();
  renderTelegramLink();
  schedulePersistAuthConfigCache();
}

function applyCachedAuthConfigFromSettings(settings = {}) {
  const cachedAuthBase = normalizeHttpUrl(settings?.authApiBase, {
    allowHttp: true,
    allowHttps: true,
  });
  if (cachedAuthBase) {
    authApiBase = cachedAuthBase;
  }

  const cachedFallbacks = Array.isArray(settings?.authApiFallbacks) ? settings.authApiFallbacks : [];
  authApiFallbacks = cachedFallbacks
    .map((item) => normalizeHttpUrl(item, { allowHttp: true, allowHttps: true }))
    .filter(Boolean);

  const cachedChannel = normalizeHttpUrl(settings?.telegramChannelUrl, {
    allowHttp: false,
    allowHttps: true,
  });
  if (cachedChannel) {
    telegramChannelUrl = cachedChannel;
  }

  const cachedBot = normalizeHttpUrl(settings?.telegramBotUrl, {
    allowHttp: false,
    allowHttps: true,
  });
  if (cachedBot) {
    currentBotUrl = cachedBot;
  }

  renderTelegramLink();
}

function applyAuthServerMeta(meta = {}) {
  const nextAuthBase = normalizeHttpUrl(meta?.authApiBase, {
    allowHttp: true,
    allowHttps: true,
  });
  if (nextAuthBase) {
    authApiBase = nextAuthBase;
  }

  const nextChannel = normalizeHttpUrl(meta?.channelUrl, {
    allowHttp: false,
    allowHttps: true,
  });
  if (nextChannel) {
    telegramChannelUrl = nextChannel;
    renderTelegramLink();
  }

  const nextBotUrl = normalizeHttpUrl(meta?.botUrl, {
    allowHttp: false,
    allowHttps: true,
  });
  if (nextBotUrl) {
    currentBotUrl = nextBotUrl;
  }

  if (Array.isArray(meta?.authApiFallbacks)) {
    const normalizedFallbacks = meta.authApiFallbacks
      .map((item) => normalizeHttpUrl(item, { allowHttp: true, allowHttps: true }))
      .filter(Boolean);
    if (normalizedFallbacks.length) {
      authApiFallbacks = Array.from(new Set(normalizedFallbacks));
    }
  }

  schedulePersistAuthConfigCache();
}

async function refreshAuthServerConfig() {
  try {
    const data = await authFetch(AUTH_SERVER_CONFIG_PATH, { method: "GET" }, { fallbackOnHttpErrors: false });
    applyAuthServerMeta(data || {});
  } catch {
    // Keep runtime defaults when optional config endpoint is unavailable.
  }
}

function renderTelegramLink() {
  const displayValue = String(telegramChannelUrl || DEFAULT_TELEGRAM_CHANNEL_URL).replace(/^https?:\/\//i, "");
  elements.telegramLink.innerHTML = `${icons.send}<span>${escapeHtml(displayValue)}</span>`;
}

function createAuthConfigPatch() {
  return {
    authApiBase: authApiBase || DEFAULT_AUTH_API_BASE,
    authApiFallbacks: Array.from(new Set(authApiFallbacks)).filter(Boolean),
    telegramChannelUrl: telegramChannelUrl || DEFAULT_TELEGRAM_CHANNEL_URL,
    telegramBotUrl: currentBotUrl || "",
    authConfigUpdatedAt: Date.now(),
  };
}

function needsAuthConfigPersist(patch) {
  const current = state.settings || {};
  if (String(current.authApiBase || "") !== String(patch.authApiBase || "")) {
    return true;
  }
  if (String(current.telegramChannelUrl || "") !== String(patch.telegramChannelUrl || "")) {
    return true;
  }
  if (String(current.telegramBotUrl || "") !== String(patch.telegramBotUrl || "")) {
    return true;
  }

  const currentFallbacks = Array.isArray(current.authApiFallbacks) ? current.authApiFallbacks : [];
  if (JSON.stringify(currentFallbacks) !== JSON.stringify(patch.authApiFallbacks)) {
    return true;
  }

  return false;
}

function schedulePersistAuthConfigCache() {
  if (authConfigPersistInFlight) {
    authConfigPersistPending = true;
    return;
  }
  void persistAuthConfigCache();
}

async function persistAuthConfigCache() {
  if (!window.alterE?.settings?.update || !state.settings) {
    return;
  }

  const patch = createAuthConfigPatch();
  if (!needsAuthConfigPersist(patch)) {
    return;
  }

  authConfigPersistInFlight = true;
  try {
    state.settings = await window.alterE.settings.update(patch);
  } catch {
    // Cache persistence is best-effort and should not block auth flow.
  } finally {
    authConfigPersistInFlight = false;
    if (authConfigPersistPending) {
      authConfigPersistPending = false;
      void persistAuthConfigCache();
    }
  }
}

async function init() {
  initIcons();
  bindEvents();

  try {
    state.settings = await window.alterE.settings.get();
  } catch {
    state.settings = {
      settingsVersion: 5,
      language: "en",
      theme: "dark",
      authRequired: true,
      authorized: false,
      telegramId: null,
      authToken: "",
      authApiBase: DEFAULT_AUTH_API_BASE,
      authApiFallbacks: [],
      telegramChannelUrl: DEFAULT_TELEGRAM_CHANNEL_URL,
      telegramBotUrl: "",
      authConfigUpdatedAt: 0,
      offlineAuthStartedAt: 0,
      renderCodec: RENDER_DEFAULTS.codec,
      renderContainer: RENDER_DEFAULTS.container,
      renderAudioMode: RENDER_DEFAULTS.audioMode,
      renderAudioBitrateKbps: RENDER_DEFAULTS.audioBitrateKbps,
      updateRepoOwner: "AlterEditing",
      updateRepoName: "Alter-Editing-Method",
      updateAllowPrerelease: false,
    };
  }
  applyCachedAuthConfigFromSettings(state.settings);

  try {
    const runtimeConfig = await window.alterE.app.getRuntimeConfig();
    applyRuntimeConfig(runtimeConfig);
  } catch {
    authApiBase = DEFAULT_AUTH_API_BASE;
  }
  await refreshAuthServerConfig();

  window.alterE.video.onProgress((progress) => {
    state.progress = clamp(Number(progress || 0), 0, 100);
    render();
  });
  window.alterE.settings.onChanged((settings) => {
    state.settings = settings;
    applyCachedAuthConfigFromSettings(settings);
    render();
  });
  window.alterE.update?.onState?.((next) => {
    syncUpdateState(next);
  });
  window.alterE.update?.onLog?.((entry) => {
    if (!entry || !entry.title) {
      return;
    }
    log(entry.level || "info", String(entry.title || ""), String(entry.message || ""));
  });

  try {
    syncUpdateState(await window.alterE.update.getState());
  } catch {
    state.update.supported = false;
  }

  const bootStartedAt = performance.now();
  render();
  await startParticles();
  const elapsed = performance.now() - bootStartedAt;
  if (elapsed < BOOT_MIN_VISIBLE_MS) {
    await wait(BOOT_MIN_VISIBLE_MS - elapsed);
  }
  await waitForUiReady();
  finishBootSequence();
  verifyStoredAuthorization();
  window.addEventListener("online", () => {
    scheduleSubscriptionCheck("network", 300);
    scheduleGuestAuthorizationCheck(300);
  });
  window.addEventListener("focus", () => {
    scheduleSubscriptionCheck("focus", 300);
    scheduleGuestAuthorizationCheck(300);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      scheduleSubscriptionCheck("network", 300);
      scheduleGuestAuthorizationCheck(300);
    }
  });
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, Number(delayMs || 0)));
  });
}

function waitFrames(frameCount = 1) {
  const total = Math.max(1, Math.floor(Number(frameCount || 1)));
  return new Promise((resolve) => {
    let left = total;
    const step = () => {
      left -= 1;
      if (left <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

async function waitForUiReady() {
  await PAGE_LOADED_PROMISE;
  if (document.fonts?.ready) {
    try {
      await Promise.race([document.fonts.ready, wait(1000)]);
    } catch {
      // Ignore font API errors and continue.
    }
  }
  try {
    await Promise.all([loadLogoImage("../../assets/logo-light.svg"), loadLogoImage("../../assets/logo-dark.svg")]);
  } catch {
    // Logo fallback is handled by canvas renderer.
  }
  renderThemeAssets();
  await waitFrames(3);
}

function finishBootSequence() {
  elements.body.classList.add("is-ui-ready");
  const bootScreen = elements.bootScreen;
  if (!bootScreen || bootScreen.hidden || bootScreen.dataset.done === "1") {
    elements.body.classList.remove("is-booting");
    return;
  }
  bootScreen.dataset.done = "1";
  elements.body.classList.remove("is-booting");
  requestAnimationFrame(() => {
    bootScreen.classList.add("is-hiding");
  });
  setTimeout(() => {
    bootScreen.hidden = true;
  }, BOOT_HIDE_DURATION_MS);
}

function bindEvents() {
  elements.minimizeButton.addEventListener("click", () => window.alterE.window.minimize());
  elements.closeButton.addEventListener("click", () => window.alterE.window.close());

  elements.settingsButton.addEventListener("click", () => togglePanel("settings"));
  elements.notificationsButton.addEventListener("click", () => togglePanel("notifications"));
  elements.logsButton.addEventListener("click", () => togglePanel("logs"));
  elements.updateButton.addEventListener("click", handleUpdateAction);
  document.addEventListener("pointerdown", closePanelOnOutsidePointer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.versionMenuVisible) {
        event.preventDefault();
        closeVersionPreferencesMenu();
        return;
      }
      if (state.renderSettingsVisible) {
        event.preventDefault();
        toggleRenderSettingsPanel(false);
        return;
      }
      if (state.tutorialVisible) {
        event.preventDefault();
        closeTutorial();
        return;
      }
      if (state.riskConfirmVisible) {
        event.preventDefault();
        resolveRiskConfirm(false);
        return;
      }
      if (state.closeConfirmVisible) {
        event.preventDefault();
        respondCloseConfirmation(false);
        return;
      }
      if (state.updateDialog.visible) {
        event.preventDefault();
        closeUpdateDialog();
        return;
      }
      if (!elements.mandatoryUpdateOverlay.hidden) {
        event.preventDefault();
        dismissMandatoryUpdateNotice();
        return;
      }
      togglePanel("");
    }
  });

  elements.dropZone.addEventListener("click", selectVideo);
  elements.dropZone.addEventListener("dragenter", handleDragEnter);
  elements.dropZone.addEventListener("dragover", handleDragOver);
  elements.dropZone.addEventListener("dragleave", handleDragLeave);
  elements.dropZone.addEventListener("drop", handleDrop);
  elements.dropZone.addEventListener("mousemove", updateDropGlow);
  elements.dropZone.addEventListener("mouseleave", resetDropTilt);
  elements.howToUseButton.addEventListener("click", openTutorial);
  elements.renderSettingsButton?.addEventListener("click", () => toggleRenderSettingsPanel());
  elements.renderCodecSelect?.addEventListener("change", () => {
    void updateRenderSettings({ renderCodec: elements.renderCodecSelect.value });
  });
  elements.renderContainerSelect?.addEventListener("change", () => {
    void updateRenderSettings({ renderContainer: elements.renderContainerSelect.value });
  });
  elements.renderAudioBitrateSelect?.addEventListener("change", () => {
    const value = String(elements.renderAudioBitrateSelect.value || "source");
    if (value === "source") {
      void updateRenderSettings({ renderAudioMode: "source" });
      return;
    }
    void updateRenderSettings({ renderAudioMode: "aac", renderAudioBitrateKbps: Number(value) });
  });
  elements.renderSettingsResetButton?.addEventListener("click", () => {
    void resetRenderSettings();
  });
  elements.renderSettingsDoneButton?.addEventListener("click", () => toggleRenderSettingsPanel(false));

  elements.bitrateSlider.addEventListener("input", () => setOutputBitrate(Number(elements.bitrateSlider.value)));
  elements.bitrateInput.addEventListener("change", () => {
    const mbps = Number(String(elements.bitrateInput.value || "").replace(",", "."));
    setOutputBitrate(mbps * 1000);
  });

  document.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  elements.patchButton.addEventListener("click", startOrCancelPatch);
  elements.languageButton.addEventListener("click", cycleLanguage);
  elements.themeButton.addEventListener("click", toggleTheme);
  elements.supportButton.addEventListener("click", () => {
    void openSupport();
  });
  elements.logoutButton.addEventListener("click", logoutFromAccount);
  elements.authButton.addEventListener("click", startTelegramAuthorization);
  window.alterE.auth?.onDeepLink?.(handleAuthDeepLink);
  elements.telegramLink.addEventListener("click", () => window.alterE.shell.openExternal(telegramChannelUrl));
  elements.copyLogsButton.addEventListener("click", copyLogs);
  elements.exportLogsButton.addEventListener("click", exportLogs);
  elements.mandatoryUpdateDownloadButton.addEventListener("click", handleUpdateAction);
  elements.mandatoryUpdateLaterButton.addEventListener("click", () => dismissMandatoryUpdateNotice());
  elements.mandatoryUpdateCloseButton.addEventListener("click", () => dismissMandatoryUpdateNotice());
  elements.updateDetailsDownloadButton.addEventListener("click", startUpdateDownloadOrInstall);
  elements.updateDetailsLaterButton.addEventListener("click", closeUpdateDialog);
  elements.updateDetailsCloseButton.addEventListener("click", closeUpdateDialog);
  elements.closeConfirmStayButton.addEventListener("click", () => respondCloseConfirmation(false));
  elements.closeConfirmLeaveButton.addEventListener("click", () => respondCloseConfirmation(true));
  elements.riskConfirmCancelButton.addEventListener("click", () => resolveRiskConfirm(false));
  elements.riskConfirmContinueButton.addEventListener("click", () => resolveRiskConfirm(true));
  elements.riskConfirmOverlay.addEventListener("pointerdown", (event) => {
    if (event.target === elements.riskConfirmOverlay) {
      resolveRiskConfirm(false);
    }
  });
  elements.renderSettingsOverlay?.addEventListener("pointerdown", (event) => {
    if (event.target === elements.renderSettingsOverlay) {
      toggleRenderSettingsPanel(false);
    }
  });
  elements.tutorialCloseButton.addEventListener("click", closeTutorial);
  elements.tutorialDoneButton.addEventListener("click", closeTutorial);
  elements.settingsVersionArea?.addEventListener("contextmenu", openVersionPreferencesMenu);
  elements.appVersionLabel?.addEventListener("contextmenu", openVersionPreferencesMenu);
  elements.settingsVersionArea?.addEventListener("click", openVersionPreferencesMenu);
  elements.appVersionLabel?.addEventListener("click", openVersionPreferencesMenu);
  elements.openRepoButton?.addEventListener("click", openVersionRepo);
  elements.updateBetaToggle?.addEventListener("change", () => {
    void persistVersionPreferences({ showErrorToast: false, checkUpdates: true });
  });
  elements.tutorialOverlay.addEventListener("pointerdown", (event) => {
    if (event.target === elements.tutorialOverlay) {
      closeTutorial();
    }
  });
  bindTutorialStepHoverPlayback();
  window.alterE.app?.onRequestCloseConfirmation?.((payload = {}) => {
    state.closeConfirmReason = String(payload?.reason || "patch");
    state.closeConfirmVisible = true;
    renderCloseConfirm();
  });
}

async function selectVideo() {
  if (state.working) {
    return;
  }

  const filePath = await window.alterE.dialog.selectVideo();
  if (filePath) {
    await loadVideo(filePath);
  }
}

async function loadVideo(filePath) {
  if (!filePath || state.working) {
    return;
  }

  const previousVideo = state.video;
  const previousMode = state.mode;
  const previousBitrateKbps = state.outputBitrateKbps;
  const restorePreviousVideo = () => {
    state.video = previousVideo;
    state.mode = previousMode;
    state.outputBitrateKbps = previousBitrateKbps;
  };

  const supported = await window.alterE.video.isSupported(filePath);
  if (!supported) {
    notify("error", t("selectError"));
    log("warning", "Input rejected", filePath);
    return;
  }

  if (await window.alterE.video.isAlreadyPatched(filePath)) {
    restorePreviousVideo();
    state.probing = false;
    notify("error", t("alreadyPatched"), filePath);
    log("warning", "Input rejected", `already patched | ${filePath}`);
    render();
    return;
  }

  const requestId = ++state.loadRequestId;
  const isCurrentLoad = () => requestId === state.loadRequestId && state.video?.path === filePath;

  state.probing = true;
  state.video = {
    path: filePath,
    name: filePath.split(/[\\/]/).pop(),
  };
  log("system", tEn("probing"), filePath);
  render();

  try {
    const video = await window.alterE.video.probe(filePath);
    if (!isCurrentLoad()) {
      return;
    }
    state.video = video;
    setMode(video.videoBitrateKbps > 0 ? "source" : "balanced", false);
    log("info", tEn("loaded"), `${video.name} | ${video.width}x${video.height} | ${video.videoBitrateKbps} ${tEn("kbps")}`);
  } catch (error) {
    if (!isCurrentLoad()) {
      return;
    }
    restorePreviousVideo();
    const message = readableError(error);
    const alreadyPatched = /already patched/i.test(message);
    notify("error", alreadyPatched ? t("alreadyPatched") : t("failed"), alreadyPatched ? filePath : message);
    log("error", "Probe failed", readableError(error));
  } finally {
    if (requestId === state.loadRequestId) {
      state.probing = false;
      render();
    }
  }
}

function setMode(mode, shouldRender = true) {
  const nextMode = ["low", "balanced", "source", "custom"].includes(mode) ? mode : "balanced";
  state.mode = nextMode;
  if (nextMode !== "custom") {
    state.outputBitrateKbps = calculatePresetBitrate(nextMode);
  }
  if (shouldRender) {
    render();
  }
}

function setOutputBitrate(value) {
  const max = getBitrateMax();
  const raw = Number(value || 0);
  state.outputBitrateKbps = clamp(Math.round(raw >= max - 1 ? max : raw), 200, max);
  state.mode = getRangePresetForBitrate(state.outputBitrateKbps) || "custom";
  render();
}

function openTutorial() {
  state.tutorialVisible = true;
  renderTutorial();
}

function closeTutorial() {
  state.tutorialVisible = false;
  renderTutorial();
  stopTutorialVideos();
}

function bindTutorialStepHoverPlayback() {
  document.querySelectorAll(".tutorial-step").forEach((step) => {
    const video = step.querySelector(".tutorial-video");
    if (!video) {
      return;
    }

    step.addEventListener("pointerenter", () => {
      if (!state.tutorialVisible) {
        return;
      }
      try {
        video.currentTime = 0;
      } catch {
        // Ignore if currentTime cannot be changed yet.
      }
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    });

    step.addEventListener("pointerleave", () => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // Ignore if currentTime cannot be changed yet.
      }
    });
  });
}

function stopTutorialVideos() {
  for (const video of elements.tutorialVideos) {
    if (!video) {
      continue;
    }
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // Ignore if currentTime cannot be changed yet.
    }
  }
}

function toggleRenderSettingsPanel(forceVisible = null) {
  const next = forceVisible === null ? !state.renderSettingsVisible : Boolean(forceVisible);
  state.renderSettingsVisible = next;
  if (elements.renderSettingsOverlay) {
    elements.renderSettingsOverlay.hidden = !next;
  }
}

async function updateRenderSettings(patch = {}) {
  state.settings = await window.alterE.settings.update({
    renderCodec: normalizeRenderCodec(patch.renderCodec ?? state.settings.renderCodec),
    renderContainer: normalizeRenderContainer(patch.renderContainer ?? state.settings.renderContainer),
    renderAudioMode: normalizeRenderAudioMode(patch.renderAudioMode ?? state.settings.renderAudioMode),
    renderAudioBitrateKbps: clamp(
      Math.round(Number(patch.renderAudioBitrateKbps ?? state.settings.renderAudioBitrateKbps)),
      32,
      512
    ),
  });
  render();
}

async function resetRenderSettings() {
  await updateRenderSettings({
    renderCodec: RENDER_DEFAULTS.codec,
    renderContainer: RENDER_DEFAULTS.container,
    renderAudioMode: RENDER_DEFAULTS.audioMode,
    renderAudioBitrateKbps: RENDER_DEFAULTS.audioBitrateKbps,
  });
}

function createSupportLogText() {
  const safe = (value) => (value === null || value === undefined ? "" : String(value));
  const lines = [];
  const video = state.video || {};
  const settings = state.settings || {};
  const update = state.update || {};
  const auth = state.auth || {};
  const app = state.app || {};
  const env = {
    locale:
      navigator.languages && navigator.languages.length
        ? navigator.languages.join(", ")
        : navigator.language || "unknown",
    online: navigator.onLine ? "true" : "false",
    userAgent: navigator.userAgent || "unknown",
    platform: navigator.platform || "unknown",
    hwConcurrency: navigator.hardwareConcurrency || "unknown",
    screen: typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : "unknown",
    tz:
      Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown"
        : "unknown",
  };

  lines.push("# ALTERE SUPPORT LOG");
  lines.push(`generatedAt: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("[app]");
  lines.push(`version: ${safe(runtimeAppVersion || "unknown")}`);
  lines.push(`language: ${safe(settings.language || "en")}`);
  lines.push(`theme: ${safe(settings.theme || "dark")}`);
  lines.push(`mode: ${safe(state.mode || "balanced")}`);
  lines.push(`authorized: ${settings.authorized ? "true" : "false"}`);
  lines.push(`telegramId: ${safe(settings.telegramId || "")}`);
  lines.push(`authPending: ${auth.pending ? "true" : "false"}`);
  lines.push(`authChecking: ${auth.checking ? "true" : "false"}`);
  lines.push(`authServerUnavailable: ${auth.serverUnavailable ? "true" : "false"}`);
  lines.push(`offlineGuest: ${auth.offlineGuest ? "true" : "false"}`);
  lines.push(`offlineAuthStartedAt: ${safe(settings.offlineAuthStartedAt || 0)}`);
  lines.push(`buildRepo: ${safe(settings.updateRepoOwner || "")}/${safe(settings.updateRepoName || "")}`);
  lines.push(`allowPrerelease: ${settings.updateAllowPrerelease ? "true" : "false"}`);
  lines.push(`windowTitle: ${safe(document && document.title)}`);
  lines.push("");
  lines.push("[environment]");
  Object.entries(env).forEach(([k, v]) => lines.push(`${k}: ${safe(v)}`));
  lines.push("");
  lines.push("[video]");
  lines.push(`selectedPath: ${safe(app.filePath || "")}`);
  lines.push(`container: ${safe(video.container || video.format || "")}`);
  lines.push(`durationSeconds: ${safe(video.durationSeconds || 0)}`);
  lines.push(`sizeBytes: ${safe(video.sizeBytes || 0)}`);
  lines.push(`width: ${safe(video.width || 0)}`);
  lines.push(`height: ${safe(video.height || 0)}`);
  lines.push(`fps: ${safe(video.fps || 0)}`);
  lines.push(`videoCodec: ${safe(video.codec || video.videoCodec || "")}`);
  lines.push(`videoBitrateKbps: ${safe(video.videoBitrateKbps || video.bitrateKbps || 0)}`);
  lines.push(`hasAudio: ${video.hasAudio ? "true" : "false"}`);
  lines.push(`audioCodec: ${safe(video.audioCodec || "")}`);
  lines.push(`audioBitrateKbps: ${safe(video.audioBitrateKbps || 0)}`);
  lines.push(`audioSampleRate: ${safe(video.audioSampleRate || 0)}`);
  lines.push(`audioChannels: ${safe(video.audioChannels || 0)}`);
  lines.push("");
  lines.push("[render]");
  lines.push(`outputBitrateKbps: ${safe(state.outputBitrateKbps || 0)}`);
  lines.push(`renderCodec: ${safe(normalizeRenderCodec(settings.renderCodec))}`);
  lines.push(`renderContainer: ${safe(normalizeRenderContainer(settings.renderContainer))}`);
  lines.push(`renderAudioMode: ${safe(normalizeRenderAudioMode(settings.renderAudioMode))}`);
  lines.push(`renderAudioBitrateKbps: ${safe(getRenderAudioBitrateKbps())}`);
  lines.push(`isCustomRenderSettings: ${isCustomRenderSettingsEnabled() ? "true" : "false"}`);
  lines.push(`effectiveOutputEstimate: ${safe(getEstimatedOutputSize())}`);
  lines.push("");
  lines.push("[update]");
  lines.push(`supported: ${update.supported ? "true" : "false"}`);
  lines.push(`available: ${update.available ? "true" : "false"}`);
  lines.push(`mandatory: ${update.mandatory ? "true" : "false"}`);
  lines.push(`version: ${safe(update.version || "")}`);
  lines.push(`downloading: ${update.downloading ? "true" : "false"}`);
  lines.push(`downloaded: ${update.downloaded ? "true" : "false"}`);
  lines.push(`downloadProgress: ${safe(update.downloadProgress || 0)}`);
  lines.push(`sizeBytes: ${safe(update.sizeBytes || 0)}`);
  lines.push(`transferredBytes: ${safe(update.transferredBytes || 0)}`);
  lines.push("");
  lines.push("[recentLogs]");
  const rows = state.logs.slice(0, 500).map((item) => formatLogLine(item));
  lines.push(...rows);
  return lines.join("\n");
}

async function openSupport() {
  try {
    await window.alterE.shell.openExternal(DEFAULT_SUPPORT_BOT_URL);
  } catch (error) {
    log("warning", "Support open failed", readableError(error));
  }
}

function buildRiskWarningText(issues) {
  const hasBitrate = issues.includes("bitrate");
  const hasResolution = issues.includes("resolution");
  let issueText = "";
  if (hasBitrate && hasResolution) {
    issueText = t("riskIssueBoth");
  } else if (hasBitrate) {
    issueText = t("riskIssueBitrate");
  } else if (hasResolution) {
    issueText = t("riskIssueResolution");
  }
  return t("riskWarningText").replace("{issues}", issueText || t("riskIssueBitrate"));
}

function requestRiskConfirm(issues = []) {
  if (state.riskConfirmVisible) {
    return Promise.resolve(false);
  }
  elements.riskConfirmText.textContent = buildRiskWarningText(issues);
  state.riskConfirmVisible = true;
  renderRiskConfirm();
  return new Promise((resolve) => {
    riskConfirmResolver = resolve;
  });
}

function resolveRiskConfirm(accepted) {
  if (!state.riskConfirmVisible) {
    return;
  }
  state.riskConfirmVisible = false;
  renderRiskConfirm();
  const resolve = riskConfirmResolver;
  riskConfirmResolver = null;
  if (resolve) {
    resolve(Boolean(accepted));
  }
}

async function startOrCancelPatch() {
  if (state.working) {
    await window.alterE.video.cancel();
    return;
  }

  if (!state.video?.path) {
    notify("warning", t("noVideo"));
    return;
  }

  if (!hasAppAccess()) {
    notify("warning", t("authText"));
    render();
    return;
  }

  const riskIssues = getRiskIssues(state.video);
  if (riskIssues.length) {
    const accepted = await requestRiskConfirm(riskIssues);
    if (!accepted) {
      return;
    }
  }

  const outputPath = await window.alterE.dialog.saveOutput({
    inputPath: state.video.path,
    mode: state.mode === "source" ? "source" : "custom",
    renderContainer: normalizeRenderContainer(state.settings.renderContainer),
  });

  if (!outputPath) {
    log("info", tEn("saveCancelled"));
    return;
  }

  state.working = true;
  state.progress = 0;
  log("system", tEn("started"), `${state.mode} | ${state.video.name}`);
  render();

  try {
    const result = await window.alterE.video.patch({
      inputPath: state.video.path,
      outputPath,
      mode: state.mode === "source" ? "source" : "custom",
      outputBitrateKbps: state.outputBitrateKbps,
      sourceVideoBitrateKbps: state.video.videoBitrateKbps,
      sourceVideoCodec: String(state.video.codec || ""),
      renderCodec: normalizeRenderCodec(state.settings.renderCodec),
      renderContainer: normalizeRenderContainer(state.settings.renderContainer),
      renderAudioMode: normalizeRenderAudioMode(state.settings.renderAudioMode),
      renderAudioBitrateKbps: getRenderAudioBitrateKbps(),
      durationSeconds: state.video.durationSeconds,
    });
    state.progress = 100;
    log("success", tEn("completed"), result.outputPath);
    notify("success", t("saved"), result.outputPath);
    window.alterE.shell.showItem(result.outputPath);
  } catch (error) {
    const message = readableError(error);
    const cancelled = /cancelled|canceled|patch_cancelled|sigterm|signal/i.test(message);
    log(cancelled ? "warning" : "error", cancelled ? tEn("cancelled") : tEn("failed"), compactError(message));
    if (!cancelled) {
      log(
        "error",
        "Render diagnostics",
        [
          formatDiagnosticsBlock("video", getVideoDiagnostics()),
          formatDiagnosticsBlock("render", getRenderDiagnostics()),
          formatDiagnosticsBlock("error", getErrorDiagnostics(error)),
        ].join(" || ")
      );
    }
    notify(cancelled ? "warning" : "error", cancelled ? t("cancelled") : t("failed"));
  } finally {
    state.working = false;
    state.progress = 0;
    render();
  }
}

async function cycleLanguage() {
  const index = languageOrder.indexOf(state.settings.language);
  const language = languageOrder[(index + 1) % languageOrder.length];
  state.settings = await window.alterE.settings.update({ language });
  log("system", "Language changed", language.toUpperCase());
  render();
}

async function toggleTheme() {
  const theme = state.settings.theme === "dark" ? "light" : "dark";
  state.settings = await window.alterE.settings.update({ theme });
  log("system", "Theme changed", theme);
  render();
}

async function logoutFromAccount() {
  if (!state.settings.authorized && !state.auth.offlineGuest) {
    return;
  }

  await clearAuthorization(false);
  state.auth.error = "";
  notify("success", t("logoutDone"));
  render();
}

async function verifyStoredAuthorization() {
  if (!state.settings.authRequired) {
    state.auth.checking = false;
    render();
    return;
  }

  const token = String(state.settings.authToken || "");
  const storedTelegramId = normalizeTelegramId(state.settings.telegramId);
  if (!token || !storedTelegramId) {
    await handleMissingAuthorization();
    return;
  }

  // Offline-first behavior: a previously authorized user can use the app immediately.
  // The subscription is checked in the background once per app session when the server is reachable.
  state.settings = await window.alterE.settings.update({
    authorized: true,
    telegramId: storedTelegramId,
    authToken: token,
  });
  state.auth.checking = false;
  state.auth.error = "";
  render();
  scheduleSubscriptionCheck("startup");
}

function getOfflineAuthStartedAt() {
  const value = Number(state.settings.offlineAuthStartedAt || 0);
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
}

async function clearOfflineAuthStartedAt() {
  if (!getOfflineAuthStartedAt()) {
    return;
  }
  state.settings = await window.alterE.settings.update({ offlineAuthStartedAt: 0 });
}

async function ensureOfflineAuthStartedAt() {
  const startedAt = getOfflineAuthStartedAt();
  if (startedAt > 0) {
    return startedAt;
  }
  const now = Date.now();
  state.settings = await window.alterE.settings.update({ offlineAuthStartedAt: now });
  return now;
}

async function handleMissingAuthorization() {
  await clearAuthorization(false);
  state.auth.checking = true;
  state.auth.error = "";
  render();

  try {
    await authFetch("/health");
    state.auth.offlineGuest = false;
    state.auth.degradedReason = "";
    state.auth.error = "";
  } catch (error) {
    state.auth.offlineGuest = false;
    state.auth.degradedReason = "server_unavailable";
    state.auth.error = "";
    log("warning", "Authorization blocked", "Auth server unavailable; sign-in is required for new users");
  } finally {
    state.auth.checking = false;
    render();
  }
}

function scheduleGuestAuthorizationCheck(delay = AUTH_SUBSCRIPTION_RETRY_MS) {
  if (!state.auth.offlineGuest || state.auth.guestCheckInFlight) {
    return;
  }

  if (state.settings.authorized && state.settings.telegramId && state.settings.authToken) {
    state.auth.offlineGuest = false;
    return;
  }

  if (state.auth.guestRetryTimer) {
    clearTimeout(state.auth.guestRetryTimer);
  }

  state.auth.guestRetryTimer = setTimeout(() => {
    state.auth.guestRetryTimer = null;
    checkGuestAuthorizationServer();
  }, Math.max(0, Number(delay) || 0));
}

async function checkGuestAuthorizationServer() {
  if (!state.auth.offlineGuest || state.auth.guestCheckInFlight) {
    return;
  }

  state.auth.guestCheckInFlight = true;
  try {
    await authFetch("/health");
    state.auth.offlineGuest = false;
    state.auth.degradedReason = "";
    state.auth.error = "";
    log("system", "Auth server available", "Login is required");
  } catch (error) {
    state.auth.degradedReason = "server_unavailable";
    scheduleGuestAuthorizationCheck(AUTH_SUBSCRIPTION_RETRY_MS);
  } finally {
    state.auth.guestCheckInFlight = false;
    render();
  }
}

function scheduleSubscriptionCheck(reason = "auto", delay = 0) {
  if (!state.settings.authRequired) {
    return;
  }
  if (state.auth.subscriptionCheckedThisSession || state.auth.subscriptionCheckInFlight) {
    return;
  }
  if (!state.settings.authorized || !state.settings.telegramId || !state.settings.authToken) {
    return;
  }

  if (state.auth.subscriptionRetryTimer) {
    clearTimeout(state.auth.subscriptionRetryTimer);
  }

  state.auth.subscriptionRetryTimer = setTimeout(() => {
    state.auth.subscriptionRetryTimer = null;
    checkStoredSubscriptionOnce(reason);
  }, delay);
}

async function checkStoredSubscriptionOnce(reason = "auto") {
  if (state.auth.subscriptionCheckedThisSession || state.auth.subscriptionCheckInFlight) {
    return;
  }

  const token = String(state.settings.authToken || "");
  const storedTelegramId = normalizeTelegramId(state.settings.telegramId);
  if (!token || !storedTelegramId) {
    await clearAuthorization(false);
    render();
    return;
  }

  state.auth.subscriptionCheckInFlight = true;
  let retryLater = false;

  try {
    const data = await authFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const serverTelegramId = normalizeTelegramId(data.telegramId);
    if (!data.ok || !data.subscribed || serverTelegramId !== storedTelegramId) {
      state.auth.subscriptionCheckedThisSession = true;
      state.auth.error = t("subscriptionRequired");
      await clearAuthorization(true);
      toast("warning", t("subscriptionRequired"));
      return;
    }

    state.auth.subscriptionCheckedThisSession = true;
    state.auth.error = "";
    await clearOfflineAuthStartedAt();
    state.settings = await window.alterE.settings.update({
      authorized: true,
      telegramId: serverTelegramId,
      authToken: token,
    });
    log("system", "Subscription checked", `telegram_id=${serverTelegramId} | ${reason}`);
  } catch (error) {
    if (isAuthorizationRejection(error)) {
      state.auth.subscriptionCheckedThisSession = true;
      state.auth.error = error.status === 403 ? t("subscriptionRequired") : t("authFailed");
      await clearAuthorization(true);
      toast("warning", t("subscriptionRequired"), readableError(error));
    } else {
      const startedAt = await ensureOfflineAuthStartedAt();
      const elapsed = Date.now() - startedAt;
      if (elapsed >= AUTH_OFFLINE_MAX_MS) {
        state.auth.subscriptionCheckedThisSession = true;
        state.auth.error = t("offlineAccessExpired");
        await clearAuthorization(true);
        toast("warning", t("authFailed"), t("offlineAccessExpired"));
      } else {
        retryLater = true;
        state.auth.error = readableError(error);
        log("warning", "Subscription check postponed", "Auth server unavailable; local session remains active");
      }
    }
  } finally {
    state.auth.subscriptionCheckInFlight = false;
    render();
    if (retryLater) {
      scheduleSubscriptionCheck(reason, AUTH_SUBSCRIPTION_RETRY_MS);
    }
  }
}

function createClientNonce(byteLength = 12) {
  const targetLength = Math.max(8, Number(byteLength) || 12);
  const buffer = new Uint8Array(targetLength);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(buffer);
  } else {
    for (let index = 0; index < buffer.length; index += 1) {
      buffer[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(buffer, (value) => value.toString(16).padStart(2, "0")).join("");
}

function buildBotStartUrl(baseUrl, startPayload) {
  const normalizedBase = normalizeHttpUrl(baseUrl, { allowHttp: false, allowHttps: true });
  if (!normalizedBase || !startPayload) {
    return "";
  }
  try {
    const target = new URL(normalizedBase);
    target.searchParams.set("start", String(startPayload));
    return target.toString();
  } catch {
    return "";
  }
}

function isPendingOfflineBotNonce(nonce) {
  const expectedNonce = String(state.auth.offlineBotNonce || "");
  if (!expectedNonce) {
    return false;
  }
  if (String(nonce || "") !== expectedNonce) {
    return false;
  }
  return Date.now() <= Number(state.auth.offlineBotExpiresAt || 0);
}

function activateTemporaryBotAuthorization() {
  stopAuthPolling();
  state.auth.pending = false;
  state.auth.checking = false;
  state.auth.error = "";
  state.auth.sessionId = "";
  state.auth.startedAt = 0;
  state.auth.offlineGuest = true;
  state.auth.degradedReason = "bot_offline_verified";
  state.auth.offlineBotNonce = "";
  state.auth.offlineBotExpiresAt = 0;
  notify("success", t("authSuccess"));
  render();
}

async function startTelegramAuthorization() {
  if (state.auth.pending || state.auth.checking) {
    return;
  }

  stopAuthPolling();
  state.auth.pending = true;
  state.auth.error = "";
  state.auth.sessionId = "";
  state.auth.startedAt = Date.now();
  render();

  try {
    const data = await authFetch("/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: normalizeLanguageCode(state.settings.language),
      }),
    });
    applyAuthServerMeta(data || {});
    state.auth.sessionId = String(data.sessionId || "");
    const botUrl = normalizeHttpUrl(data?.botUrl || currentBotUrl, {
      allowHttp: false,
      allowHttps: true,
    });
    if (!state.auth.sessionId || !botUrl) {
      throw new Error("Invalid auth response");
    }

    log("system", "Telegram authorization started", state.auth.sessionId);
    await window.alterE.shell.openExternal(botUrl);
    startAuthPolling(state.auth.sessionId);
  } catch (error) {
    state.auth.pending = false;
    const serverUnavailable = isAuthServerUnavailableError(error);
    state.auth.error = serverUnavailable ? "" : readableError(error) || t("authFailed");
    log(
      serverUnavailable ? "warning" : "error",
      "Telegram authorization failed",
      serverUnavailable ? `Auth server unavailable | ${readableError(error)}` : state.auth.error
    );
    if (serverUnavailable) {
      const fallbackBotUrl = normalizeHttpUrl(currentBotUrl, { allowHttp: false, allowHttps: true });
      if (fallbackBotUrl) {
        try {
          const offlineNonce = createClientNonce(12);
          const startPayload = `offauth_${offlineNonce}`;
          const offlineBotUrl = buildBotStartUrl(fallbackBotUrl, startPayload);
          state.auth.offlineBotNonce = offlineNonce;
          state.auth.offlineBotExpiresAt = Date.now() + AUTH_OFFLINE_BOT_NONCE_TTL_MS;
          await window.alterE.shell.openExternal(offlineBotUrl || fallbackBotUrl);
        } catch {
          // Keep auth overlay error text only when fallback bot link cannot be opened.
        }
      }
    } else {
      toast("error", t("authFailed"), state.auth.error);
    }
    log(
      "error",
      "Auth request diagnostics",
      [
        formatDiagnosticsBlock("auth", getAuthDiagnostics()),
        formatDiagnosticsBlock("error", getErrorDiagnostics(error)),
      ].join(" || ")
    );
    render();
  }
}

function handleAuthDeepLink(rawUrl) {
  let sessionId = "";
  let offline = false;
  let offlineNonce = "";
  try {
    const url = new URL(String(rawUrl || ""));
    sessionId = url.searchParams.get("session") || "";
    offline = url.searchParams.get("offline") === "1";
    offlineNonce = url.searchParams.get("nonce") || "";
    const deepLinkServer = normalizeHttpUrl(url.searchParams.get("server"), {
      allowHttp: true,
      allowHttps: true,
    });
    if (deepLinkServer) {
      authApiBase = deepLinkServer;
      schedulePersistAuthConfigCache();
    }

    const deepLinkChannel = normalizeHttpUrl(url.searchParams.get("channel"), {
      allowHttp: false,
      allowHttps: true,
    });
    if (deepLinkChannel) {
      telegramChannelUrl = deepLinkChannel;
      renderTelegramLink();
      schedulePersistAuthConfigCache();
    }
  } catch {
    return;
  }

  if (offline) {
    if (isPendingOfflineBotNonce(offlineNonce)) {
      activateTemporaryBotAuthorization();
    } else {
      log("warning", "Offline bot authorization", "Ignored stale or unknown deep-link nonce");
    }
    return;
  }

  if (!sessionId) {
    return;
  }

  state.auth.offlineBotNonce = "";
  state.auth.offlineBotExpiresAt = 0;
  state.auth.pending = true;
  state.auth.error = "";
  state.auth.sessionId = sessionId;
  state.auth.startedAt = Date.now();
  startAuthPolling(sessionId);
  render();
}

function startAuthPolling(sessionId) {
  stopAuthPolling();
  const poll = async () => {
    if (!state.auth.pending || state.auth.sessionId !== sessionId) {
      stopAuthPolling();
      return;
    }

    if (Date.now() - state.auth.startedAt > AUTH_POLL_TIMEOUT_MS) {
      stopAuthPolling();
      state.auth.pending = false;
      state.auth.error = "Login session expired";
      toast("warning", t("authFailed"), state.auth.error);
      render();
      return;
    }

    try {
      const data = await authFetch(`/auth/session/${encodeURIComponent(sessionId)}`);
      if (data.status === "approved") {
        await exchangeAuthorization(sessionId);
      }
    } catch (error) {
      const serverUnavailable = isAuthServerUnavailableError(error);
      state.auth.error = serverUnavailable ? "" : readableError(error) || t("authFailed");
      if (serverUnavailable) {
        log("warning", "Authorization polling", `Auth server unavailable | ${readableError(error)}`);
        log(
          "warning",
          "Auth polling diagnostics",
          [
            formatDiagnosticsBlock("auth", getAuthDiagnostics()),
            formatDiagnosticsBlock("error", getErrorDiagnostics(error)),
          ].join(" || ")
        );
      }
      render();
    }
  };

  poll();
  state.auth.pollTimer = setInterval(poll, AUTH_POLL_INTERVAL_MS);
}

function stopAuthPolling() {
  if (state.auth.pollTimer) {
    clearInterval(state.auth.pollTimer);
    state.auth.pollTimer = null;
  }
}

function stopSubscriptionRetry() {
  if (state.auth.subscriptionRetryTimer) {
    clearTimeout(state.auth.subscriptionRetryTimer);
    state.auth.subscriptionRetryTimer = null;
  }
}

async function exchangeAuthorization(sessionId) {
  stopAuthPolling();
  try {
    const data = await authFetch("/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const telegramId = normalizeTelegramId(data.telegramId);
    if (!data.ok || !data.token || !telegramId) {
      throw new Error("Invalid token response");
    }

    state.settings = await window.alterE.settings.update({
      authorized: true,
      telegramId,
      authToken: String(data.token),
      offlineAuthStartedAt: 0,
    });
    state.auth.pending = false;
    state.auth.checking = false;
    state.auth.subscriptionCheckedThisSession = true;
    state.auth.offlineGuest = false;
    state.auth.offlineBotNonce = "";
    state.auth.offlineBotExpiresAt = 0;
    state.auth.error = "";
    state.auth.sessionId = "";
    log("success", "Session authorized", `telegram_id=${telegramId}`);
    notify("success", t("authSuccess"), `ID: ${telegramId}`);
  } catch (error) {
    await clearAuthorization(true);
    state.auth.pending = false;
    const serverUnavailable = isAuthServerUnavailableError(error);
    state.auth.error = serverUnavailable ? "" : readableError(error) || t("authFailed");
    if (serverUnavailable) {
      log("warning", "Authorization exchange", `Auth server unavailable | ${readableError(error)}`);
    } else {
      toast("error", t("authFailed"), state.auth.error);
    }
    log(
      "error",
      "Auth exchange diagnostics",
      [
        formatDiagnosticsBlock("auth", getAuthDiagnostics()),
        formatDiagnosticsBlock("error", getErrorDiagnostics(error)),
      ].join(" || ")
    );
  } finally {
    render();
  }
}

async function clearAuthorization(showLog) {
  stopAuthPolling();
  stopSubscriptionRetry();
  if (state.auth.guestRetryTimer) {
    clearTimeout(state.auth.guestRetryTimer);
    state.auth.guestRetryTimer = null;
  }
  state.auth.pending = false;
  state.auth.sessionId = "";
  state.auth.subscriptionCheckedThisSession = false;
  state.auth.subscriptionCheckInFlight = false;
  state.auth.guestCheckInFlight = false;
  state.auth.offlineGuest = false;
  state.auth.degradedReason = "";
  state.auth.offlineBotNonce = "";
  state.auth.offlineBotExpiresAt = 0;
  state.settings = await window.alterE.settings.update({
    authorized: false,
    telegramId: null,
    authToken: "",
    offlineAuthStartedAt: 0,
  });
  if (showLog) {
    log("warning", "Session revoked", "Subscription is missing or token is invalid");
  }
}

function isAuthorizationRejection(error) {
  return [401, 403].includes(Number(error?.status || 0));
}

function buildAuthServerCandidates() {
  const sourceBase = authApiBase;
  const sourceFallbacks = authApiFallbacks;
  const normalized = [sourceBase, ...sourceFallbacks]
    .map((item) => normalizeHttpUrl(item, { allowHttp: true, allowHttps: true }))
    .filter(Boolean);

  return Array.from(new Set(normalized));
}

function isNetworkFailureError(error) {
  if (!error) {
    return false;
  }

  if (error.name === "AbortError") {
    return true;
  }

  if (Number(error.status || 0) > 0) {
    return false;
  }

  const message = String(error.message || error || "").toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed")
  );
}

function isAuthServerUnavailableError(error) {
  const status = Number(error?.status || 0);
  if (status >= 500) {
    return true;
  }
  if (status === 0 && isNetworkFailureError(error)) {
    return true;
  }

  const message = String(error?.message || error || "").toLowerCase();
  return (
    message.includes("auth server timeout") ||
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed")
  );
}

async function authFetch(endpoint, options = {}, runtimeOptions = {}) {
  const candidates = buildAuthServerCandidates();
  const fallbackOnHttpErrors = runtimeOptions.fallbackOnHttpErrors === true;
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const data = await authFetchAgainstBase(candidate, endpoint, options);
      if (authApiBase !== candidate) {
        log("system", "Auth server switched", candidate);
      }
      authApiBase = candidate;
      schedulePersistAuthConfigCache();
      return data;
    } catch (error) {
      lastError = error;
      const status = Number(error?.status || 0);
      if (status > 0 && !fallbackOnHttpErrors) {
        throw error;
      }
      if (status === 0 && !isNetworkFailureError(error)) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Auth server unavailable");
}

async function authFetchAgainstBase(baseUrl, endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTH_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      cache: "no-store",
      ...options,
      signal: options.signal || controller.signal,
    });
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    if (!response.ok) {
      const error = new Error(data?.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.baseUrl = baseUrl;
      throw error;
    }
    return data || {};
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("Auth server timeout");
      timeoutError.baseUrl = baseUrl;
      throw timeoutError;
    }
    error.baseUrl = baseUrl;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
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

function normalizeLanguageCode(value) {
  const code = String(value || "").toLowerCase();
  if (code === "ru" || code === "tr" || code === "en") {
    return code;
  }
  return "en";
}

function normalizeTelegramId(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }
  return String(Math.trunc(parsed));
}

function togglePanel(panelName) {
  state.openPanel = state.openPanel === panelName ? "" : panelName;
  if (state.openPanel !== "settings") {
    state.versionMenuVisible = false;
  }
  if (state.openPanel === "notifications") {
    state.unreadNotifications = 0;
  }
  renderPanels();
}

function closePanelOnOutsidePointer(event) {
  if (state.renderSettingsVisible) {
    const clickedToggle = elements.renderSettingsButton?.contains(event.target);
    const clickedPanel = elements.renderSettingsOverlay?.contains(event.target);
    if (!clickedToggle && !clickedPanel) {
      toggleRenderSettingsPanel(false);
    }
  }

  if (!state.openPanel) {
    return;
  }

  const activePanel = getPanelElement(state.openPanel);
  const panelButtons = [elements.settingsButton, elements.notificationsButton, elements.logsButton].filter(
    Boolean
  );
  if (activePanel?.contains(event.target) || panelButtons.some((button) => button.contains(event.target))) {
    if (state.versionMenuVisible) {
      const inVersionArea = elements.settingsVersionArea?.contains(event.target);
      const inVersionMenu = elements.settingsVersionMenu?.contains(event.target);
      if (!inVersionArea && !inVersionMenu) {
        void persistVersionPreferences({ showErrorToast: false, checkUpdates: true });
        closeVersionPreferencesMenu();
      }
    }
    return;
  }

  state.openPanel = "";
  renderPanels();
}

function handleDragEnter(event) {
  event.preventDefault();
  if (!state.working) {
    elements.dropZone.classList.add("is-dragging");
  }
}

function handleDragOver(event) {
  event.preventDefault();
  updateDropGlow(event);
}

function handleDragLeave(event) {
  if (!elements.dropZone.contains(event.relatedTarget)) {
    elements.dropZone.classList.remove("is-dragging");
    resetDropTilt();
  }
}

async function handleDrop(event) {
  event.preventDefault();
  elements.dropZone.classList.remove("is-dragging");
  resetDropTilt();

  const file = event.dataTransfer.files?.[0];
  if (!file) {
    return;
  }

  const filePath = window.alterE.video.getPathForFile(file);
  await loadVideo(filePath);
}

function updateDropGlow(event) {
  const rect = elements.dropZone.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
  const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
  elements.dropZone.style.setProperty("--x", `${x}%`);
  elements.dropZone.style.setProperty("--y", `${y}%`);
  const tiltX = ((50 - y) / 50) * 2.6;
  const tiltY = ((x - 50) / 50) * 2.6;
  elements.dropZone.style.setProperty("--rx", `${tiltX.toFixed(2)}deg`);
  elements.dropZone.style.setProperty("--ry", `${tiltY.toFixed(2)}deg`);
}

function resetDropTilt() {
  elements.dropZone.style.setProperty("--rx", "0deg");
  elements.dropZone.style.setProperty("--ry", "0deg");
}

function syncUpdateState(next = {}) {
  const previousUpdate = { ...state.update };
  state.update = {
    ...state.update,
    ...next,
  };

  const noticeKey = `${state.update.version}:${state.update.available}`;
  if (state.update.available && !state.update.downloaded && state.update.version && lastUpdateNoticeKey !== noticeKey) {
    lastUpdateNoticeKey = noticeKey;
    const title = state.update.mandatory ? t("updateMandatoryTitle") : t("updateAvailable");
    notify(state.update.mandatory ? "warning" : "info", title, formatUpdateNoticeMessage());
  }

  const justDownloaded = Boolean(state.update.downloaded && !previousUpdate.downloaded);
  if (justDownloaded) {
    if (state.updateDialog.visible && state.updateDialog.installAfterDownload) {
      state.updateDialog.installAfterDownload = false;
      setTimeout(() => installDownloadedUpdate(), 250);
    } else {
      notifyUpdateReady();
    }
  }

  if (previousUpdate.downloading && !state.update.downloading && state.update.error) {
    state.updateDialog.installAfterDownload = false;
  }

  render();
}

function handleUpdateAction() {
  openUpdateDialog();
}

async function openUpdateDialog() {
  if (!state.update.supported || !state.update.available) {
    return;
  }

  state.openPanel = "";
  state.updateDialog.visible = true;
  if (state.update.mandatory && !state.update.mandatoryDismissed) {
    await dismissMandatoryUpdateNotice(false);
  }
  render();
}

function closeUpdateDialog() {
  state.updateDialog.visible = false;
  if (state.update.downloading) {
    state.updateDialog.installAfterDownload = false;
  }
  render();
}

async function startUpdateDownloadOrInstall() {
  if (!state.update.supported || !state.update.available) {
    return;
  }

  if (state.update.downloaded) {
    await installDownloadedUpdate();
    return;
  }

  if (state.update.downloading) {
    return;
  }

  state.updateDialog.installAfterDownload = true;
  renderUpdateDialog();
  try {
    await window.alterE.update.download();
  } catch (error) {
    state.updateDialog.installAfterDownload = false;
    notify("error", t("failed"), readableError(error));
    renderUpdateDialog();
  }
}

async function installDownloadedUpdate() {
  try {
    await window.alterE.update.install();
  } catch (error) {
    notify("error", t("failed"), readableError(error));
  }
}

async function dismissMandatoryUpdateNotice(shouldRender = true) {
  const version = String(state.update.version || "");
  if (!version) {
    state.update.mandatoryDismissed = true;
    if (shouldRender) {
      render();
    }
    return;
  }
  try {
    const next = await window.alterE.update.dismissMandatory(version);
    state.update = {
      ...state.update,
      ...(next || {}),
      mandatoryDismissed: true,
    };
    if (shouldRender) {
      render();
    }
  } catch (error) {
    notify("error", t("failed"), readableError(error));
  }
}

function notifyUpdateReady() {
  const key = `${state.update.version}:ready`;
  if (lastUpdateReadyNoticeKey === key) {
    return;
  }
  lastUpdateReadyNoticeKey = key;
  notify("success", t("updateReadyTitle"), t("updateReadyText"), {
    type: "installUpdate",
    label: t("updateInstall"),
  });
}

function formatUpdateNoticeMessage() {
  return [state.update.version, formatUpdateSize()].filter((part) => part && part !== "-").join(" | ");
}

function getUpdateDescription() {
  const notes = compactUpdateNotes(state.update.releaseNotes);
  return notes || t("updateDescriptionFallback");
}

function compactUpdateNotes(value, maxLength = 320) {
  const lines = String(value || "")
    .replace(/\[(mandatory|force)\]/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^\s{0,3}(#{1,6}|[-*+])\s*/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const text = lines.slice(0, 4).join("\n");
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function formatUpdateSize() {
  const size = formatSize(state.update.sizeBytes || 0);
  return size === "-" ? "" : size;
}

function formatUpdateProgressSize() {
  const transferred = formatSize(state.update.transferredBytes || 0);
  const total = formatSize(state.update.sizeBytes || 0);
  if (transferred === "-" && total === "-") {
    return "";
  }
  if (total === "-") {
    return transferred;
  }
  if (transferred === "-") {
    return total;
  }
  return `${transferred} / ${total}`;
}

function formatUpdateInfoLine() {
  const parts = [];
  if (state.update.version) {
    parts.push(`${t("updateVersion")}: ${state.update.version}`);
  }
  const size = formatUpdateSize();
  if (size) {
    parts.push(`${t("updateSize")}: ${size}`);
  }
  return parts.join(" | ");
}

async function respondCloseConfirmation(shouldClose) {
  state.closeConfirmVisible = false;
  renderCloseConfirm();
  try {
    await window.alterE.app?.respondCloseConfirmation?.(Boolean(shouldClose));
  } catch {
    // Ignore response errors; main process has its own timeout fallback.
  }
}

function render() {
  elements.body.dataset.theme = state.settings.theme;
  document.documentElement.lang = state.settings.language || "en";
  renderThemeAssets();
  renderText();
  renderVideo();
  renderBitrateControls();
  renderPatchState();
  renderPanels();
  renderAuth();
  renderUpdate();
  renderCloseConfirm();
  renderRiskConfirm();
  renderTutorial();
}

async function openVersionPreferencesMenu(event) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  if (event && typeof event.stopPropagation === "function") {
    event.stopPropagation();
  }
  if (state.openPanel !== "settings") {
    return;
  }
  if (state.versionMenuVisible) {
    const saved = await persistVersionPreferences({ showErrorToast: true, checkUpdates: true });
    if (saved) {
      closeVersionPreferencesMenu();
    }
    return;
  }
  if (elements.updateBetaToggle) {
    elements.updateBetaToggle.checked = Boolean(state.settings.updateAllowPrerelease);
  }
  state.versionMenuVisible = true;
  renderVersionPreferencesMenu();
}

function closeVersionPreferencesMenu() {
  if (!state.versionMenuVisible) {
    return;
  }
  state.versionMenuVisible = false;
  renderVersionPreferencesMenu();
}

function renderVersionPreferencesMenu() {
  if (!elements.settingsVersionMenu) {
    return;
  }
  const visible = Boolean(state.versionMenuVisible && state.openPanel === "settings");
  elements.settingsVersionMenu.hidden = !visible;
}

async function persistVersionPreferences({ showErrorToast = false, checkUpdates = true } = {}) {
  const updateAllowPrerelease = Boolean(elements.updateBetaToggle?.checked);
  if (updateAllowPrerelease === Boolean(state.settings.updateAllowPrerelease)) {
    return true;
  }
  state.settings = await window.alterE.settings.update({
    updateAllowPrerelease,
  });
  if (showErrorToast) {
    toast("success", t("updates"), t("updatePrefsSaved"));
  }
  if (checkUpdates) {
    try {
      await window.alterE.update.check();
    } catch {
      // ignore immediate check errors
    }
  }
  return true;
}

function openVersionRepo() {
  const owner = String(state.settings.updateRepoOwner || "AlterEditing").trim() || "AlterEditing";
  const repo = String(state.settings.updateRepoName || "Alter-Editing-Method").trim() || "Alter-Editing-Method";
  window.alterE.shell.openExternal(`https://github.com/${owner}/${repo}`);
}

function renderText() {
  elements.outputSizeLabel.textContent = t("outputSize");
  elements.howToUseLabel.textContent = tGuide("howToUse");
  elements.selectPill.textContent = state.video ? t("changeVideo") : t("selectVideo");
  elements.patchButtonLabel.textContent = state.working ? t("cancel") : t("patch");
  document.querySelector('[data-mode="low"]').textContent = t("low");
  document.querySelector('[data-mode="balanced"]').textContent = t("balanced");
  document.querySelector('[data-mode="source"]').textContent = t("source");
  elements.settingsTitle.textContent = t("settings");
  elements.notificationsTitle.textContent = t("notifications");
  elements.logsTitle.textContent = t("logs");
  elements.copyLogsButton.textContent = t("copyLogs");
  elements.exportLogsButton.textContent = t("exportLogs");
  elements.authTitle.textContent = t("authTitle");
  elements.authText.textContent = t("authText");
  elements.authButton.textContent = t("authorize");
  elements.mandatoryUpdateTitle.textContent = t("updateMandatoryTitle");
  elements.mandatoryUpdateDownloadButton.textContent = t("updateDownload");
  elements.mandatoryUpdateLaterButton.textContent = t("updateLater");
  elements.updateDetailsTitle.textContent = t("updateAvailable");
  elements.updateDetailsDownloadButton.textContent = t("updateDownloadAndInstall");
  elements.updateDetailsLaterButton.textContent = t("updateLater");
  elements.closeConfirmTitle.textContent = t("closeConfirmTitle");
  elements.closeConfirmText.textContent = t("closeConfirmText");
  elements.closeConfirmLeaveButton.textContent = t("closeConfirmClose");
  elements.closeConfirmStayButton.textContent = t("closeConfirmStay");
  elements.riskConfirmTitle.textContent = t("riskWarningTitle");
  if (!state.riskConfirmVisible) {
    elements.riskConfirmText.textContent = buildRiskWarningText(["bitrate", "resolution"]);
  }
  elements.riskConfirmCancelButton.textContent = t("cancelAction");
  elements.riskConfirmContinueButton.textContent = t("continueAnyway");
  elements.tutorialTitle.textContent = tGuide("tutorialTitle");
  elements.tutorialStep1Title.textContent = tGuide("tutorialStep1Title");
  elements.tutorialStep1Text.textContent = tGuide("tutorialStep1Text");
  elements.tutorialStep2Title.textContent = tGuide("tutorialStep2Title");
  elements.tutorialStep2Text.textContent = tGuide("tutorialStep2Text");
  elements.tutorialStep3Title.textContent = tGuide("tutorialStep3Title");
  elements.tutorialStep3Text.textContent = tGuide("tutorialStep3Text");
  elements.tutorialStep4Title.textContent = tGuide("tutorialStep4Title");
  elements.tutorialStep4Text.textContent = tGuide("tutorialStep4Text");
  elements.tutorialDoneButton.textContent = tGuide("tutorialDone");
  if (elements.renderCodecLabel) elements.renderCodecLabel.textContent = t("renderCodec");
  if (elements.renderContainerLabel) elements.renderContainerLabel.textContent = t("renderContainer");
  if (elements.renderSettingsTitle) elements.renderSettingsTitle.textContent = t("renderSettings");
  if (elements.renderAudioBitrateLabel) elements.renderAudioBitrateLabel.textContent = t("renderAudioBitrate");
  if (elements.renderSettingsResetButton) elements.renderSettingsResetButton.textContent = t("resetToSource");
  if (elements.renderSettingsDoneButton) elements.renderSettingsDoneButton.textContent = t("renderSettingsDone");
  if (elements.appVersionLabel) {
    elements.appVersionLabel.textContent = runtimeAppVersion ? `v${runtimeAppVersion}` : "v-";
  }
  if (elements.updateBetaToggleLabel) {
    elements.updateBetaToggleLabel.textContent = t("updateBetaToggle");
  }
  if (elements.openRepoButton) {
    elements.openRepoButton.title = t("updatePrefsOpenRepo");
    elements.openRepoButton.setAttribute("aria-label", t("updatePrefsOpenRepo"));
  }

  elements.logsButton.title = t("logs");
  elements.notificationsButton.title = t("notifications");
  elements.updateButton.title = t("updates");
  elements.settingsButton.title = t("settings");
  elements.renderSettingsButton.title = t("renderSettings");
  elements.logsButton.setAttribute("aria-label", t("logs"));
  elements.notificationsButton.setAttribute("aria-label", t("notifications"));
  elements.updateButton.setAttribute("aria-label", t("updates"));
  elements.settingsButton.setAttribute("aria-label", t("settings"));
  elements.renderSettingsButton.setAttribute("aria-label", t("renderSettings"));
  elements.howToUseButton.setAttribute("aria-label", tGuide("howToUse"));
  elements.logoutButton.title =
    state.settings.language === "ru"
      ? "Выйти из аккаунта."
      : state.settings.language === "tr"
        ? "Hesaptan cikis yap."
        : "Log out of account.";
  elements.logoutButton.setAttribute("aria-label", elements.logoutButton.title);
  elements.dropZone.setAttribute("aria-label", state.video ? t("changeVideo") : t("selectVideo"));
  elements.patchButton.title = state.working ? t("cancel") : t("patch");

  setActionButton(elements.languageButton, "languages", `${t("language")}: ${state.settings.language.toUpperCase()}`);
  setActionButton(elements.themeButton, state.settings.theme === "dark" ? "moon" : "sun", state.settings.theme === "dark" ? t("themeDark") : t("themeLight"));
  setActionButton(elements.supportButton, "send", t("support"));
  setActionButton(elements.updateButton, "download", t("updates"));

  if (elements.renderCodecSelect) {
    elements.renderCodecSelect.value = normalizeRenderCodec(state.settings.renderCodec);
  }
  if (elements.renderContainerSelect) {
    elements.renderContainerSelect.value = normalizeRenderContainer(state.settings.renderContainer);
  }
  if (elements.renderAudioBitrateSelect) {
    const mode = normalizeRenderAudioMode(state.settings.renderAudioMode);
    elements.renderAudioBitrateSelect.value = mode === "source" ? "source" : String(getRenderAudioBitrateKbps());
  }
  if (elements.renderSettingsOverlay) {
    elements.renderSettingsOverlay.hidden = !state.renderSettingsVisible;
  }
  if (elements.renderSettingsButton) {
    const hasCustom = isCustomRenderSettingsEnabled();
    elements.renderSettingsButton.classList.toggle("is-custom", hasCustom);
    elements.renderSettingsButton.title = hasCustom ? t("renderSettingsCustomHint") : t("renderSettings");
  }
}

function renderCloseConfirm() {
  elements.closeConfirmOverlay.hidden = !state.closeConfirmVisible;
  elements.closeConfirmTitle.textContent = t("closeConfirmTitle");
  if (state.closeConfirmReason === "update-download") {
    elements.closeConfirmText.textContent = t("closeConfirmUpdateText");
  } else if (state.closeConfirmReason === "patch-and-update-download") {
    elements.closeConfirmText.textContent = t("closeConfirmPatchAndUpdateText");
  } else {
    elements.closeConfirmText.textContent = t("closeConfirmText");
  }
  elements.closeConfirmLeaveButton.textContent = t("closeConfirmClose");
  elements.closeConfirmStayButton.textContent = t("closeConfirmStay");
}

function renderRiskConfirm() {
  elements.riskConfirmOverlay.hidden = !state.riskConfirmVisible;
}

function renderTutorial() {
  elements.tutorialOverlay.hidden = !state.tutorialVisible;
  if (!state.tutorialVisible) {
    stopTutorialVideos();
  }
}

function renderVideo() {
  const video = state.video;
  elements.dropZone.classList.toggle("has-video", Boolean(video?.path));
  elements.dropZone.classList.toggle("is-working", state.working);

  if (!video?.path) {
    elements.fileTitle.textContent = "";
    elements.fileMeta.textContent = "";
    elements.fileStream.textContent = "";
    elements.videoPreview.pause();
    elements.videoPreview.hidden = true;
    elements.videoPreview.removeAttribute("src");
    elements.videoPreview.load();
    elements.outputSizeValue.textContent = "-";
    return;
  }

  elements.fileTitle.textContent = video.name || "";
  elements.fileMeta.textContent = [formatDuration(video.durationSeconds), formatSize(video.sizeBytes)]
    .filter((part) => part && part !== "-")
    .join(" | ");
  elements.fileStream.textContent = [
    video.width && video.height ? `${video.width}x${video.height}` : "",
    video.fps ? `${formatNumber(video.fps, 2)} ${t("fps")}` : "",
    video.videoBitrateKbps ? `${video.videoBitrateKbps} ${t("kbps")}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const previewSrc = pathToFileUrl(video.path);
  if (elements.videoPreview.getAttribute("src") !== previewSrc) {
    elements.videoPreview.src = previewSrc;
    elements.videoPreview.load();
  }
  elements.videoPreview.hidden = false;

  elements.outputSizeValue.textContent = estimateOutputSize();
}

function renderBitrateControls() {
  const max = getBitrateMax();
  const value = clamp(state.outputBitrateKbps || calculatePresetBitrate(state.mode), 200, max);
  const sourceMode = state.mode === "source";
  const locked = !hasAppAccess();
  const min = Number(elements.bitrateSlider.min || 200);
  state.outputBitrateKbps = value;

  elements.bitrateSlider.max = String(max);
  elements.bitrateSlider.value = String(value);
  elements.bitrateSlider.disabled = !state.video || state.working || state.probing || locked;
  elements.bitrateSlider.style.setProperty("--slider-fill", `${((value - min) / Math.max(1, max - min)) * 100}%`);
  elements.bitrateInput.max = String(max / 1000);
  if (document.activeElement !== elements.bitrateInput) {
    elements.bitrateInput.value = (value / 1000).toFixed(3).replace(/\.?0+$/, "");
  }
  elements.bitrateInput.disabled = !state.video || state.working || state.probing || locked;
  elements.bitrateUnit.textContent = "mb/s";

  const activePreset = sourceMode ? "source" : getRangePresetForBitrate(value);
  document.querySelectorAll(".preset-button").forEach((button) => {
    const mode = button.dataset.mode;
    button.classList.toggle("is-active", mode === activePreset);
    button.disabled =
      !state.video ||
      state.working ||
      state.probing ||
      locked ||
      (mode === "source" && !state.video.videoBitrateKbps);
  });
}

function renderPatchState() {
  elements.patchButton.disabled = state.probing;
  elements.patchButton.classList.toggle("is-working", state.working);
  const progress = `${state.progress}%`;
  elements.patchProgress.style.setProperty("--progress", progress);
  elements.dropProgress.style.setProperty("--progress", progress);
}

function renderPanels() {
  const panels = {
    settings: elements.settingsPanel,
    notifications: elements.notificationsPanel,
    logs: elements.logsPanel,
  };

  for (const [name, panel] of Object.entries(panels)) {
    const open = state.openPanel === name;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.toggle("is-open", open));
    if (!open) {
      setTimeout(() => {
        if (state.openPanel !== name) {
          panel.hidden = true;
        }
      }, 160);
    }
  }

  elements.settingsButton.classList.toggle("is-open", state.openPanel === "settings");
  elements.notificationsButton.classList.toggle("is-open", state.openPanel === "notifications");
  elements.logsButton.classList.toggle("is-open", state.openPanel === "logs");

  elements.notificationBadge.hidden = state.unreadNotifications <= 0;
  elements.notificationBadge.textContent = String(Math.min(99, state.unreadNotifications));

  renderActivityList(elements.notificationsList, state.notifications, t("emptyNotifications"));
  renderLogConsole();
  renderVersionPreferencesMenu();
}

function renderAuth() {
  const locked = !hasAppAccess();
  elements.body.classList.toggle("is-locked", locked);
  elements.authOverlay.hidden = !locked;
  elements.authButton.disabled = state.auth.checking || state.auth.pending;

  if (!locked) {
    return;
  }

  elements.authLogo.hidden = false;
  elements.authTitle.textContent = t("authTitle");
  if (state.auth.checking) {
    elements.authText.textContent = t("authChecking");
    elements.authButton.textContent = t("authorize");
    return;
  }
  if (state.auth.pending) {
    elements.authText.textContent = t("authWaiting");
    elements.authButton.textContent = t("authorize");
    return;
  }
  elements.authText.textContent = state.auth.error || t("authText");
  elements.authButton.textContent = t("authorize");
}

function renderUpdate() {
  const update = state.update;
  const hasUpdate = Boolean(update.supported && update.available);
  const progress = clamp(Math.round(Number(update.downloadProgress || 0)), 0, 100);
  if (elements.settingsUpdateWrap) {
    elements.settingsUpdateWrap.hidden = !hasUpdate;
  }
  elements.updateButton.hidden = !hasUpdate;
  elements.updateButton.style.setProperty("--update-progress", `${progress}%`);
  elements.settingsButton.classList.toggle("has-update", hasUpdate);
  if (hasUpdate) {
    const settingsState = update.downloaded ? "downloaded" : update.downloading ? "downloading" : "available";
    elements.settingsButton.dataset.updateState = settingsState;
    elements.settingsButton.dataset.updateLevel = update.mandatory ? "mandatory" : "optional";
  } else {
    delete elements.settingsButton.dataset.updateState;
    delete elements.settingsButton.dataset.updateLevel;
  }

  if (hasUpdate) {
    const suffix = update.version ? ` ${update.version}` : "";
    const actionText = update.downloaded
      ? t("updateInstall")
      : update.downloading
        ? `${t("updateDownloading")} ${progress}%`
        : update.mandatory
          ? t("updateDownloadAndInstall")
          : t("updateDownload");
    setActionButton(elements.updateButton, "download", update.version ? `${actionText} (${update.version})` : actionText);
    if (update.downloaded) {
      elements.updateButton.title = `${t("updateInstall")}${suffix}`;
    } else if (update.downloading) {
      elements.updateButton.title = `${t("updateDownloading")} ${progress}%`;
    } else if (update.mandatory) {
      elements.updateButton.title = `${t("updateMandatoryTitle")}${suffix}`;
    } else {
      elements.updateButton.title = `${t("updateAvailable")}${suffix}`;
    }
  }

  elements.updateButton.dataset.state = update.downloaded ? "downloaded" : update.downloading ? "downloading" : "idle";
  elements.updateButton.dataset.level = update.mandatory ? "mandatory" : "optional";

  const showMandatoryOverlay = Boolean(
    hasUpdate &&
      update.mandatory &&
      !update.downloaded &&
      !update.downloading &&
      !update.mandatoryDismissed &&
      !state.updateDialog.visible
  );
  elements.mandatoryUpdateOverlay.hidden = !showMandatoryOverlay;
  if (showMandatoryOverlay) {
    elements.mandatoryUpdateTitle.textContent = t("updateMandatoryTitle");
    elements.mandatoryUpdateText.textContent = [getUpdateDescription(), formatUpdateInfoLine()].filter(Boolean).join("\n");
    elements.mandatoryUpdateDownloadButton.textContent = t("updateDownload");
    elements.mandatoryUpdateLaterButton.textContent = t("updateLater");
  }

  renderUpdateDialog();
}

function renderUpdateDialog() {
  const update = state.update;
  const hasUpdate = Boolean(update.supported && update.available);
  const visible = Boolean(state.updateDialog.visible && hasUpdate);
  elements.updateDetailsOverlay.hidden = !visible;
  if (!visible) {
    return;
  }

  const progress = clamp(Math.round(Number(update.downloadProgress || 0)), 0, 100);
  const downloading = Boolean(update.downloading && !update.downloaded);
  const downloaded = Boolean(update.downloaded);
  elements.updateDetailsTitle.textContent = update.mandatory ? t("updateMandatoryTitle") : t("updateAvailable");
  elements.updateDetailsVersion.textContent = update.version ? `${t("updateVersion")}: ${update.version}` : "";
  elements.updateDetailsNotes.textContent = getUpdateDescription();
  const sizeText = downloading ? formatUpdateProgressSize() : formatUpdateSize();
  elements.updateDetailsSize.textContent = sizeText ? `${t("updateSize")}: ${sizeText}` : "";
  elements.updateDetailsProgressBlock.hidden = !downloading;
  elements.updateDetailsProgressText.textContent = t("updateDownloading");
  elements.updateDetailsProgressValue.textContent = `${progress}%`;
  elements.updateDetailsProgressBar.style.setProperty("--progress", `${progress}%`);
  elements.updateDetailsDownloadButton.disabled = downloading;
  elements.updateDetailsDownloadButton.textContent = downloaded
    ? t("updateInstall")
    : downloading
      ? t("updateDownloading")
      : t("updateDownloadAndInstall");
  elements.updateDetailsLaterButton.textContent = t("updateLater");
}

function hasAppAccess() {
  return Boolean(state.auth.offlineGuest || (state.settings.authorized && state.settings.telegramId && state.settings.authToken));
}

function renderThemeAssets() {
  renderLogoCanvas(elements.brandLogo, 28);
  renderLogoCanvas(elements.authLogo, 54);
  renderLogoCanvas(elements.bootLogo, 66);
}

function renderLogoCanvas(canvas, cssSize) {
  if (!canvas) {
    return;
  }

  const theme = state.settings.theme === "light" ? "light" : "dark";
  const cacheKey = `${theme}:${cssSize}:${window.devicePixelRatio || 1}`;
  if (logoRenderState.get(canvas) === cacheKey) {
    return;
  }
  logoRenderState.set(canvas, cacheKey);

  const source = theme === "dark" ? "../../assets/logo-light.svg" : "../../assets/logo-dark.svg";
  const targetColor = theme === "dark" ? [248, 250, 252] : [16, 20, 24];
  loadLogoImage(source).then((image) => {
    if (logoRenderState.get(canvas) !== cacheKey) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const size = Math.round(cssSize * ratio);
    const work = document.createElement("canvas");
    work.width = size * 3;
    work.height = size * 3;
    const workContext = work.getContext("2d", { willReadFrequently: true });
    workContext.drawImage(image, 0, 0, work.width, work.height);

    const imageData = workContext.getImageData(0, 0, work.width, work.height);
    const pixels = imageData.data;
    const background = sampleCornerColor(pixels, work.width, work.height);

    for (let index = 0; index < pixels.length; index += 4) {
      const distance = colorDistance(pixels[index], pixels[index + 1], pixels[index + 2], background);
      const alpha = clamp((distance - 24) * 5.2, 0, 255);
      pixels[index] = targetColor[0];
      pixels[index + 1] = targetColor[1];
      pixels[index + 2] = targetColor[2];
      pixels[index + 3] = alpha;
    }

    workContext.putImageData(imageData, 0, 0);

    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, size, size);
    context.drawImage(work, 0, 0, size, size);
  });
}

function loadLogoImage(source) {
  if (logoCache.has(source)) {
    return logoCache.get(source);
  }

  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
  logoCache.set(source, promise);
  return promise;
}

function sampleCornerColor(pixels, width, height) {
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  const sum = [0, 0, 0];
  for (const [x, y] of points) {
    const index = (y * width + x) * 4;
    sum[0] += pixels[index];
    sum[1] += pixels[index + 1];
    sum[2] += pixels[index + 2];
  }
  return sum.map((value) => value / points.length);
}

function colorDistance(red, green, blue, background) {
  return Math.hypot(red - background[0], green - background[1], blue - background[2]);
}

function renderActivityList(host, items, emptyText) {
  host.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "activity-empty";
    empty.textContent = emptyText;
    host.appendChild(empty);
    return;
  }

  for (const item of items.slice(0, 80)) {
    const row = document.createElement("div");
    row.className = "activity-item";
    row.dataset.level = item.level || "info";

    const title = document.createElement("strong");
    title.textContent = item.title || "";
    const message = document.createElement("span");
    message.className = "activity-message";
    appendMessageWithPaths(message, item.message || "");
    const time = document.createElement("small");
    time.textContent = item.time || "";

    row.append(title, message);
    if (item.action) {
      row.appendChild(createNotificationActionButton(item.action, "activity-action-button"));
    }
    row.appendChild(time);
    host.appendChild(row);
  }
}

function renderLogConsole() {
  elements.logsList.replaceChildren();
  elements.copyLogsButton.disabled = state.logs.length === 0;
  elements.exportLogsButton.disabled = state.logs.length === 0;

  if (!state.logs.length) {
    const empty = document.createElement("div");
    empty.className = "log-empty";
    empty.textContent = t("emptyLogs");
    elements.logsList.appendChild(empty);
    return;
  }

  for (const item of state.logs.slice(0, 200)) {
    const line = document.createElement("div");
    line.className = "log-line";
    line.dataset.level = item.level || "info";
    line.textContent = formatLogLine(item);
    elements.logsList.appendChild(line);
  }
}

function getPanelElement(name) {
  if (name === "settings") {
    return elements.settingsPanel;
  }
  if (name === "notifications") {
    return elements.notificationsPanel;
  }
  if (name === "logs") {
    return elements.logsPanel;
  }
  if (!hasUpdate) {
    setActionButton(elements.updateButton, "download", t("updates"));
  }
  return null;
}

function calculatePresetBitrate(mode) {
  const source = Number(state.video?.videoBitrateKbps || 0);
  if (mode === "source") {
    return source || state.outputBitrateKbps || 10000;
  }
  if (source <= 0) {
    return mode === "low" ? 4000 : 10000;
  }
  return clamp(Math.round(source / (mode === "low" ? 4 : 2)), 200, getBitrateMax());
}

function normalizeRenderCodec(value) {
  const codec = String(value || "").toLowerCase();
  if (codec === "h264" || codec === "h265" || codec === "source") {
    return codec;
  }
  return RENDER_DEFAULTS.codec;
}

function normalizeRenderContainer(value) {
  const container = String(value || "").toLowerCase();
  if (container === "mp4" || container === "mov" || container === "source") {
    return container;
  }
  return RENDER_DEFAULTS.container;
}

function normalizeRenderAudioMode(value) {
  const mode = String(value || "").toLowerCase();
  if (mode === "aac" || mode === "source") {
    return mode;
  }
  return RENDER_DEFAULTS.audioMode;
}

function getRenderAudioBitrateKbps() {
  const raw = Number(state.settings.renderAudioBitrateKbps || RENDER_DEFAULTS.audioBitrateKbps);
  return clamp(Math.round(raw), 32, 512);
}

function isCustomRenderSettingsEnabled() {
  return (
    normalizeRenderCodec(state.settings.renderCodec) !== RENDER_DEFAULTS.codec ||
    normalizeRenderContainer(state.settings.renderContainer) !== RENDER_DEFAULTS.container ||
    normalizeRenderAudioMode(state.settings.renderAudioMode) !== RENDER_DEFAULTS.audioMode ||
    getRenderAudioBitrateKbps() !== RENDER_DEFAULTS.audioBitrateKbps
  );
}

function getEffectiveVideoBitrateKbps() {
  if (state.mode === "source") {
    return Number(state.video?.videoBitrateKbps || 0);
  }
  return Number(state.outputBitrateKbps || 0);
}

function isSourceFastPathSelected() {
  return (
    state.mode === "source" &&
    normalizeRenderCodec(state.settings.renderCodec) === "source" &&
    normalizeRenderContainer(state.settings.renderContainer) === "source" &&
    normalizeRenderAudioMode(state.settings.renderAudioMode) === "source"
  );
}

function getRiskIssues(video) {
  if (!video) {
    return [];
  }
  const issues = [];
  if (getEffectiveVideoBitrateKbps() > 70000) {
    issues.push("bitrate");
  }
  const width = Number(video.width || 0);
  const height = Number(video.height || 0);
  if (width * height > 1920 * 1080) {
    issues.push("resolution");
  }
  return issues;
}

function getRangePresetForBitrate(kbps) {
  if (!state.video) {
    return "";
  }

  const source = Number(state.video.videoBitrateKbps || 0);
  const max = getBitrateMax();
  const value = Math.round(Number(kbps || 0));
  if (source > 0 && value >= Math.round(max)) {
    return "source";
  }

  const balanced = calculatePresetBitrate("balanced");
  return value < balanced ? "low" : "balanced";
}

function getBitrateMax() {
  const source = Number(state.video?.videoBitrateKbps || 0);
  return clamp(source || 1000000, 200, 1000000);
}

function estimateOutputSize() {
  const video = state.video;
  if (!video) {
    return "-";
  }

  if (isSourceFastPathSelected()) {
    return formatSize(video.sizeBytes);
  }

  if (!video.durationSeconds || !state.outputBitrateKbps) {
    return "-";
  }

  const audioMode = normalizeRenderAudioMode(state.settings.renderAudioMode);
  const audioKbps = video.hasAudio ? (audioMode === "source" ? Number(video.audioBitrateKbps || 0) : getRenderAudioBitrateKbps()) : 0;
  const totalKbps = Math.max(0, getEffectiveVideoBitrateKbps()) + Math.max(0, audioKbps);
  const bytes = (totalKbps * 1000 * video.durationSeconds) / 8;
  return formatSize(bytes);
}

function notify(level, title, message = "", action = null) {
  const item = makeActivityItem(level, title, message, action);
  state.notifications.unshift(item);
  state.notifications = state.notifications.slice(0, 80);
  if (state.openPanel !== "notifications") {
    state.unreadNotifications = Math.min(99, state.unreadNotifications + 1);
  }
  showToast(item);
  renderPanels();
}

function toast(level, title, message = "") {
  showToast(makeActivityItem(level, title, message));
}

function log(level, title, message = "") {
  state.logs.unshift(makeActivityItem(level, title, message));
  state.logs = state.logs.slice(0, 120);
  renderPanels();
}

function makeActivityItem(level, title, message, action = null) {
  return {
    level,
    title,
    message,
    action,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

function showToast(item) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.dataset.level = item.level || "info";

  const title = document.createElement("strong");
  title.textContent = item.title || "";
  const message = document.createElement("span");
  message.className = "toast-message";
  appendMessageWithPaths(message, item.message || "");
  toast.append(title, message);
  if (item.action) {
    toast.appendChild(createNotificationActionButton(item.action, "toast-action-button"));
  }
  elements.toastHost.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("is-hiding");
    setTimeout(() => toast.remove(), 560);
  }, item.action ? 6200 : 3600);
}

function createNotificationActionButton(action, className) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.textContent = String(action?.label || "");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleNotificationAction(action?.type);
  });
  return button;
}

function handleNotificationAction(type) {
  if (type === "installUpdate") {
    installDownloadedUpdate();
  }
  if (type === "openUpdateDialog") {
    openUpdateDialog();
  }
}

function appendMessageWithPaths(host, text) {
  const value = String(text || "");
  const pathRegex = /[A-Za-z]:\\[^\r\n<>|?*"]+/g;
  let cursor = 0;
  let match = pathRegex.exec(value);

  if (!match) {
    host.textContent = value;
    return;
  }

  while (match) {
    if (match.index > cursor) {
      host.appendChild(document.createTextNode(value.slice(cursor, match.index)));
    }

    const rawPath = match[0].trim();
    const button = document.createElement("button");
    button.className = "path-link";
    button.type = "button";
    button.textContent = rawPath;
    button.title = rawPath;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      window.alterE.shell.showItem(rawPath);
    });
    host.appendChild(button);

    cursor = match.index + match[0].length;
    match = pathRegex.exec(value);
  }

  if (cursor < value.length) {
    host.appendChild(document.createTextNode(value.slice(cursor)));
  }
}

function formatLogLine(item) {
  const level = String(item.level || "info").toUpperCase().padEnd(7, " ");
  const message = item.message ? ` ${item.message}` : "";
  return `[${item.time}] [${level}] ${item.title}${message}`;
}

function logsToText() {
  return state.logs
    .slice()
    .reverse()
    .map(formatLogLine)
    .join("\n");
}

async function copyLogs() {
  const text = logsToText();
  if (!text) {
    return;
  }
  await window.alterE.clipboard.writeText(text);
  toast("success", t("copied"), `${state.logs.length} lines`);
}

async function exportLogs() {
  const text = logsToText();
  if (!text) {
    return;
  }
  const outputPath = await window.alterE.logs.export(`${text}\n`);
  if (outputPath) {
    toast("success", t("exported"), outputPath);
  }
}

function readableError(error) {
  return String(error?.message || error || "").replace(/^Error:\s*/i, "").trim();
}

function compactError(text, maxLength = 180) {
  const firstLine = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || "";
  if (firstLine.length <= maxLength) {
    return firstLine;
  }
  return `${firstLine.slice(0, maxLength - 1)}...`;
}

function formatDiagnosticsBlock(title, data = {}) {
  const lines = Object.entries(data)
    .map(([key, value]) => `${key}=${value === undefined || value === null ? "-" : String(value)}`)
    .join(" | ");
  return `${title}: ${lines}`;
}

function getVideoDiagnostics() {
  const v = state.video || {};
  return {
    name: v.name || "-",
    path: v.path || "-",
    container: v.container || v.format || "-",
    codec: v.codec || v.videoCodec || "-",
    durationSec: v.durationSeconds || 0,
    width: v.width || 0,
    height: v.height || 0,
    fps: v.fps || 0,
    videoKbps: v.videoBitrateKbps || v.bitrateKbps || 0,
    hasAudio: Boolean(v.hasAudio),
    audioCodec: v.audioCodec || "-",
    audioKbps: v.audioBitrateKbps || 0,
  };
}

function getRenderDiagnostics() {
  return {
    mode: state.mode || "-",
    outputKbps: state.outputBitrateKbps || 0,
    renderCodec: normalizeRenderCodec(state.settings?.renderCodec),
    renderContainer: normalizeRenderContainer(state.settings?.renderContainer),
    renderAudioMode: normalizeRenderAudioMode(state.settings?.renderAudioMode),
    renderAudioKbps: getRenderAudioBitrateKbps(),
    customRender: isCustomRenderSettingsEnabled(),
  };
}

function getAuthDiagnostics() {
  return {
    authApiBase,
    authFallbacks: buildAuthServerCandidates().join(","),
    authorized: Boolean(state.settings?.authorized),
    telegramId: state.settings?.telegramId || "-",
    authPending: Boolean(state.auth?.pending),
    authChecking: Boolean(state.auth?.checking),
    sessionId: state.auth?.sessionId || "-",
    offlineGuest: Boolean(state.auth?.offlineGuest),
    language: state.settings?.language || "-",
  };
}

function getErrorDiagnostics(error) {
  return {
    error: readableError(error),
    status: error?.status || error?.data?.status || "-",
    baseUrl: error?.baseUrl || "-",
    code: error?.code || "-",
    stack: compactError(String(error?.stack || ""), 500),
  };
}

function pathToFileUrl(filePath) {
  let normalized = String(filePath || "").replace(/\\/g, "/");
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  return `file://${encodeURI(normalized).replace(/#/g, "%23").replace(/\?/g, "%3F")}`;
}

function formatDuration(seconds) {
  const total = Math.round(Number(seconds || 0));
  if (!Number.isFinite(total) || total <= 0) {
    return "-";
  }
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function formatSize(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) {
    return "-";
  }
  return `${(value / 1024 / 1024).toFixed(2)} ${t("mb")}`;
}

function formatNumber(value, digits) {
  return Number(value || 0)
    .toFixed(digits)
    .replace(/\.?0+$/, "");
}

function clamp(value, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return min;
  }
  return Math.max(min, Math.min(max, parsed));
}

function nearlyEqual(left, right) {
  const tolerance = Math.max(5, Math.max(Math.abs(left), Math.abs(right)) * 0.006);
  return Math.abs(left - right) <= tolerance;
}

function startParticles() {
  const canvas = elements.particles;
  const context = canvas.getContext("2d");
  if (!context) {
    return Promise.resolve();
  }
  const TITLE_BAR_HEIGHT = 44;
  const particles = [];
  const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(() => resize()) : null;
  const pointer = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
    lastAt: 0,
  };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let resizeEnergy = 0;
  let lastFrame = performance.now();
  let firstFrameRendered = false;
  let resolveReady = () => {};
  const ready = new Promise((resolve) => {
    resolveReady = resolve;
  });

  function readViewportSize() {
    const rect = canvas.getBoundingClientRect();
    const hostRect = elements.appShell?.getBoundingClientRect?.();
    const visual = window.visualViewport;
    const widthCandidates = [
      rect.width,
      hostRect?.width,
      window.innerWidth,
      document.documentElement?.clientWidth,
      document.body?.clientWidth,
      visual?.width,
    ];
    const heightCandidates = [
      rect.height,
      hostRect?.height,
      window.innerHeight,
      document.documentElement?.clientHeight,
      document.body?.clientHeight,
      visual?.height,
    ];

    const validWidths = widthCandidates
      .map((value) => Math.ceil(Number(value || 0)))
      .filter((value) => Number.isFinite(value) && value > 0);
    const validHeights = heightCandidates
      .map((value) => Math.ceil(Number(value || 0)))
      .filter((value) => Number.isFinite(value) && value > 0);

    const nextWidth = validWidths.length ? Math.max(...validWidths) : 1;
    const nextHeight = validHeights.length ? Math.max(...validHeights) : 1;

    return { width: nextWidth, height: nextHeight };
  }

  function resize() {
    ratio = window.devicePixelRatio || 1;
    const viewport = readViewportSize();
    const nextWidth = viewport.width;
    const nextHeight = viewport.height;
    const previousWidth = width;
    const previousHeight = height;
    const previousArea = previousWidth * previousHeight;
    const nextArea = nextWidth * nextHeight;
    const sizeChanged = nextWidth !== width || nextHeight !== height;
    width = nextWidth;
    height = nextHeight;
    const nextCanvasWidth = Math.round(width * ratio);
    const nextCanvasHeight = Math.round(height * ratio);
    if (canvas.width !== nextCanvasWidth || canvas.height !== nextCanvasHeight) {
      canvas.width = nextCanvasWidth;
      canvas.height = nextCanvasHeight;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (sizeChanged) {
      const scaleX = previousWidth > 0 ? width / previousWidth : 1;
      const scaleY = previousHeight > 0 ? height / previousHeight : 1;
      const deltaWidth = previousWidth > 0 ? width - previousWidth : 0;
      const deltaHeight = previousHeight > 0 ? height - previousHeight : 0;
      const stretchEnergy = clamp((Math.abs(deltaWidth) + Math.abs(deltaHeight)) / 420, 0, 1.15);
      const impulseX = clamp(-deltaWidth * 0.026, -12, 12);
      const impulseY = clamp(-deltaHeight * 0.022, -10, 10);
      const maxX = Math.max(8, width - 8);
      const minY = -Math.max(12, height);
      const maxY = height + 8;
      for (const particle of particles) {
        if (previousWidth > 0 && previousHeight > 0) {
          particle.x *= scaleX;
          particle.y *= scaleY;
        }
        particle.x = clamp(particle.x, 8, maxX);
        particle.y = clamp(particle.y, minY, maxY);
        particle.vx += impulseX * (0.38 + Math.random() * 0.46) + (-3 + Math.random() * 6);
        particle.vy += impulseY * (0.32 + Math.random() * 0.42) + (-2.5 + Math.random() * 5);
        particle.stretch = clamp((particle.stretch || 0) + stretchEnergy * (0.28 + Math.random() * 0.32), 0, 0.9);
      }
      resizeEnergy = clamp(resizeEnergy + stretchEnergy, 0, 1.1);
    }

    const targetCount = clamp(Math.round((width * height) / 5900), 54, 210);
    while (particles.length < targetCount) {
      particles.push(createParticle(true));
    }
    while (particles.length > targetCount) {
      particles.pop();
    }

    if (nextArea > previousArea && previousArea > 0 && particles.length) {
      const growthRatio = nextArea / previousArea;
      const relocateCount = Math.round(particles.length * clamp((growthRatio - 1) * 0.18, 0, 0.2));
      for (let index = 0; index < relocateCount; index += 1) {
        const particle = particles[Math.floor(Math.random() * particles.length)];
        if (!particle) {
          break;
        }
        Object.assign(particle, createParticle(true));
      }
    }
  }

  function createParticle(randomY = false, zone = null) {
    const left = clamp(Number(zone?.left ?? 0), 0, Math.max(0, width - 1));
    const top = clamp(Number(zone?.top ?? (randomY ? 0 : Math.max(0, TITLE_BAR_HEIGHT - 24))), 0, Math.max(0, height - 1));
    const right = clamp(Number(zone?.right ?? width), left + 1, Math.max(left + 1, width));
    const bottom = clamp(
      Number(zone?.bottom ?? (randomY ? height : Math.min(height, TITLE_BAR_HEIGHT + 16))),
      top + 1,
      Math.max(top + 1, height)
    );
    const zoneWidth = Math.max(1, right - left);
    const zoneHeight = Math.max(1, bottom - top);
    const size = 0.72 + Math.random() * 1.55;

    return {
      x: left + Math.random() * zoneWidth,
      y: randomY ? top + Math.random() * zoneHeight : top + Math.random() * zoneHeight,
      vx: -10 + Math.random() * 20,
      vy: randomY ? 6 + Math.random() * 28 : 18 + Math.random() * 34,
      size,
      alpha: 0.1 + Math.random() * 0.26,
      drag: 0.965 + Math.random() * 0.02,
      mass: 0.7 + size * 0.32,
      wobble: Math.random() * Math.PI * 2,
      stretch: Math.random() * 0.12,
    };
  }

  function resetParticle(particle) {
    Object.assign(particle, createParticle(false));
  }

  function drawScene(delta, now) {
    if (width < 1 || height < 1) {
      return;
    }

    const light = state.settings.theme === "light";
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, getCssVariable("--bg-top"));
    gradient.addColorStop(0.45, getCssVariable("--bg-mid"));
    gradient.addColorStop(1, getCssVariable("--bg-bottom"));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const vignette = context.createRadialGradient(width / 2, height * 0.5, 0, width / 2, height * 0.5, width * 0.76);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, light ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.28)");
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);

    resizeEnergy = Math.max(0, resizeEnergy - delta * 1.65);

    for (const particle of particles) {
      applyParticlePhysics(particle, delta, now);
      drawParticle(particle, light);
    }
  }

  function applyParticlePhysics(particle, delta, now) {
    const gravity = 6 + particle.size * 1.4;
    particle.vy += gravity * delta;
    particle.vx += Math.sin(now * 0.0014 + particle.wobble) * (2.8 + resizeEnergy * 5.5) * delta;

    if (pointer.active) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distanceSquared = dx * dx + dy * dy;
      const radius = 86;
      if (distanceSquared > 0.01 && distanceSquared < radius * radius) {
        const distance = Math.sqrt(distanceSquared);
        const force = ((radius - distance) / radius) ** 2.25;
        particle.vx += (dx / distance) * force * 145 * delta / particle.mass + pointer.vx * force * 0.018;
        particle.vy += (dy / distance) * force * 145 * delta / particle.mass + pointer.vy * force * 0.018;
        particle.stretch = clamp(particle.stretch + force * 0.28, 0, 0.9);
      }
    }

    if (resizeEnergy > 0) {
      particle.vx += Math.sin(now * 0.014 + particle.wobble) * resizeEnergy * 8 * delta;
      particle.vy += Math.cos(now * 0.011 + particle.wobble) * resizeEnergy * 6 * delta;
    }

    const damping = Math.pow(particle.drag, delta * 60);
    particle.vx *= damping;
    particle.vy *= damping;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;

    const margin = 8 + particle.size;
    if (particle.x < margin) {
      particle.x = margin;
      particle.vx = Math.abs(particle.vx) * 0.74;
      particle.stretch = clamp(particle.stretch + 0.2, 0, 0.9);
    } else if (particle.x > width - margin) {
      particle.x = width - margin;
      particle.vx = -Math.abs(particle.vx) * 0.74;
      particle.stretch = clamp(particle.stretch + 0.2, 0, 0.9);
    }

    const titleEdge = TITLE_BAR_HEIGHT - 7;
    if (particle.y < titleEdge && particle.vy < -4) {
      particle.y = titleEdge;
      particle.vy = Math.abs(particle.vy) * 0.46;
      particle.stretch = clamp(particle.stretch + 0.14, 0, 0.9);
    }

    if (particle.y > height + 20 || particle.x < -40 || particle.x > width + 40) {
      resetParticle(particle);
      return;
    }

    particle.stretch = Math.max(0, particle.stretch - delta * 2.2);
  }

  function drawParticle(particle, light) {
    const speed = Math.hypot(particle.vx, particle.vy);
    const stretch = clamp(speed / 260 + particle.stretch, 0, 0.95);
    const angle = Math.atan2(particle.vy, particle.vx);
    const alpha = particle.alpha * (1 + Math.min(0.12, stretch * 0.04));
    const coreColor = light ? `rgba(31,37,44,${alpha})` : `rgba(228,236,244,${alpha})`;
    const trailColor = light ? `rgba(31,37,44,${alpha * 0.16})` : `rgba(204,230,241,${alpha * 0.18})`;
    const radiusX = particle.size * (1 + stretch * 0.24);
    const radiusY = Math.max(0.58, particle.size * (1 - Math.min(0.18, stretch * 0.08)));
    const trailLength = clamp(speed / 18, 0, 9);

    context.save();
    context.translate(particle.x, particle.y);
    context.rotate(angle);

    if (trailLength > 1.6) {
      context.beginPath();
      context.strokeStyle = trailColor;
      context.lineWidth = Math.max(0.7, particle.size * 0.55);
      context.lineCap = "round";
      context.moveTo(-trailLength, 0);
      context.lineTo(-particle.size * 0.65, 0);
      context.stroke();
    }

    context.beginPath();
    context.fillStyle = coreColor;
    context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function markFirstFrame() {
    if (firstFrameRendered) {
      return;
    }
    firstFrameRendered = true;
    resolveReady();
  }

  function draw(now) {
    const viewport = readViewportSize();
    const maybeWidth = viewport.width;
    const maybeHeight = viewport.height;
    if (maybeWidth !== width || maybeHeight !== height) {
      resize();
    }
    const delta = Math.min(0.04, (now - lastFrame) / 1000);
    lastFrame = now;
    drawScene(delta, now);
    markFirstFrame();
    requestAnimationFrame(draw);
  }

  function updatePointer(event) {
    const viewport = readViewportSize();
    const now = performance.now();
    const nextX = clamp(Number(event.clientX || 0), 0, viewport.width);
    const nextY = clamp(Number(event.clientY || 0), 0, viewport.height);
    if (pointer.active) {
      const deltaMs = Math.max(12, now - pointer.lastAt);
      pointer.vx = pointer.vx * 0.45 + ((nextX - pointer.x) / deltaMs) * 1000 * 0.55;
      pointer.vy = pointer.vy * 0.45 + ((nextY - pointer.y) / deltaMs) * 1000 * 0.55;
    } else {
      pointer.vx = 0;
      pointer.vy = 0;
    }
    pointer.x = nextX;
    pointer.y = nextY;
    pointer.lastAt = now;
    pointer.active = true;
  }

  function clearPointer() {
    pointer.active = false;
    pointer.vx = 0;
    pointer.vy = 0;
  }

  const requestResize = () => requestAnimationFrame(resize);
  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerleave", clearPointer);
  window.addEventListener("blur", clearPointer);
  window.addEventListener("resize", requestResize);
  window.visualViewport?.addEventListener("resize", requestResize);
  window.addEventListener("orientationchange", requestResize);
  if (resizeObserver) {
    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }
    if (elements.appShell) {
      resizeObserver.observe(elements.appShell);
    }
  }
  resize();
  drawScene(0, performance.now());
  markFirstFrame();
  requestAnimationFrame(draw);
  return ready;
}

function getCssVariable(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

init().catch((error) => {
  console.error("Renderer init failed:", error);
  finishBootSequence();
});
