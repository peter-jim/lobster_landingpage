/**
 * OpenClaw i18n Engine
 * Handles language detection (URL > localStorage > IP > browser), loading, switching, and DOM updates.
 */
(function () {
    'use strict';

    const SUPPORTED_LANGS = ['zh-CN', 'en', 'ja'];
    const DEFAULT_LANG = 'zh-CN';
    const STORAGE_KEY = 'oc_lang';
    const LANG_DIR = './lang/';

    // Country code → language mapping
    const COUNTRY_LANG_MAP = {
        'CN': 'zh-CN', 'TW': 'zh-CN', 'HK': 'zh-CN', 'MO': 'zh-CN',
        'JP': 'ja',
        'US': 'en', 'GB': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en',
        'IE': 'en', 'SG': 'en', 'IN': 'en', 'PH': 'en', 'MY': 'en',
        'DE': 'en', 'FR': 'en', 'IT': 'en', 'ES': 'en', 'NL': 'en',
        'SE': 'en', 'NO': 'en', 'DK': 'en', 'FI': 'en', 'PT': 'en',
        'BR': 'en', 'MX': 'en', 'AR': 'en', 'CL': 'en', 'CO': 'en',
        'KR': 'en', 'TH': 'en', 'VN': 'en', 'ID': 'en',
        'RU': 'en', 'UA': 'en', 'PL': 'en', 'CZ': 'en',
        'ZA': 'en', 'EG': 'en', 'AE': 'en', 'SA': 'en', 'TR': 'en',
    };

    let currentLang = DEFAULT_LANG;
    let langData = {};
    let langCache = {};

    // ========== Utility ==========

    function getNestedValue(obj, path) {
        return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
    }

    function isSupported(lang) {
        return SUPPORTED_LANGS.includes(lang);
    }

    function normalizeLang(raw) {
        if (!raw) return null;
        const l = raw.trim();
        // Exact match
        if (isSupported(l)) return l;
        // zh variants → zh-CN
        if (/^zh/i.test(l)) return 'zh-CN';
        // ja variants
        if (/^ja/i.test(l)) return 'ja';
        // en variants
        if (/^en/i.test(l)) return 'en';
        return null;
    }

    // ========== Language Detection ==========

    function detectFromURL() {
        const params = new URLSearchParams(window.location.search);
        return normalizeLang(params.get('lang'));
    }

    function detectFromStorage() {
        try {
            return normalizeLang(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            return null;
        }
    }

    function detectFromBrowser() {
        const nav = navigator.language || navigator.userLanguage || '';
        return normalizeLang(nav);
    }

    async function detectFromIP() {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            const resp = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            clearTimeout(timeout);
            if (!resp.ok) return null;
            const data = await resp.json();
            const country = (data.country_code || '').toUpperCase();
            return COUNTRY_LANG_MAP[country] || 'en';
        } catch (e) {
            return null;
        }
    }

    // ========== Language File Loading ==========

    async function loadLang(lang) {
        if (langCache[lang]) return langCache[lang];
        try {
            const resp = await fetch(`${LANG_DIR}${lang}.json`);
            if (!resp.ok) throw new Error('Failed to load ' + lang);
            const data = await resp.json();
            langCache[lang] = data;
            return data;
        } catch (e) {
            console.warn('[i18n] Failed to load language file:', lang, e);
            return null;
        }
    }

    // ========== DOM Update ==========

    function applyTranslations(data) {
        if (!data) return;
        langData = data;

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = getNestedValue(data, key);
            if (val !== null) {
                // Check if the value contains HTML (e.g. <strong>)
                if (val.includes('<')) {
                    el.innerHTML = val;
                } else {
                    el.textContent = val;
                }
            }
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = getNestedValue(data, key);
            if (val !== null) el.placeholder = val;
        });

        // Update elements with data-i18n-aria
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const val = getNestedValue(data, key);
            if (val !== null) el.setAttribute('aria-label', val);
        });

        // Update <html lang>
        document.documentElement.lang = currentLang === 'zh-CN' ? 'zh-CN' : currentLang;

        // Update <title> and meta tags
        if (data.meta) {
            if (data.meta.title) document.title = data.meta.title;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && data.meta.description) metaDesc.content = data.meta.description;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle && data.meta.ogTitle) ogTitle.content = data.meta.ogTitle;
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc && data.meta.ogDesc) ogDesc.content = data.meta.ogDesc;
        }

        // Update language switcher active state
        updateSwitcherUI();
    }

    // ========== Language Switcher UI ==========

    function updateSwitcherUI() {
        const currentLabel = document.getElementById('langCurrentLabel');
        if (currentLabel && langData.langSwitcher) {
            currentLabel.textContent = langData.langSwitcher[currentLang] || currentLang;
        }
        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach(opt => {
            const lang = opt.getAttribute('data-lang');
            if (lang === currentLang) {
                opt.classList.add('bg-primary/10', 'text-primary', 'font-bold');
                opt.classList.remove('text-slate-600', 'dark:text-slate-300');
            } else {
                opt.classList.remove('bg-primary/10', 'text-primary', 'font-bold');
                opt.classList.add('text-slate-600', 'dark:text-slate-300');
            }
        });
    }

    function initSwitcher() {
        const toggle = document.getElementById('langSwitcherToggle');
        const dropdown = document.getElementById('langDropdown');
        if (!toggle || !dropdown) return;

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
            dropdown.classList.toggle('opacity-0');
            dropdown.classList.toggle('scale-95');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (!dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden', 'opacity-0', 'scale-95');
            }
        });

        // Language option click
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', async () => {
                const lang = opt.getAttribute('data-lang');
                if (lang && lang !== currentLang) {
                    await switchLanguage(lang);
                    // GA4 tracking
                    if (typeof gtag === 'function') {
                        gtag('event', 'language_switch', { from_lang: currentLang, to_lang: lang });
                    }
                }
                dropdown.classList.add('hidden', 'opacity-0', 'scale-95');
            });
        });
    }

    // ========== Public API ==========

    async function switchLanguage(lang) {
        if (!isSupported(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* ignore */ }

        const data = await loadLang(lang);
        if (data) {
            applyTranslations(data);
            // Update loading messages if still visible
            updateLoadingMessages(data);
        }
    }

    function updateLoadingMessages(data) {
        if (!data || !data.loading) return;
        // Expose for loading script to pick up
        window.__i18nLoadingMsgs = [
            data.loading.msg1, data.loading.msg2, data.loading.msg3,
            data.loading.msg4, data.loading.msg5
        ].filter(Boolean);
    }

    // Get a translation value by key (for use in JS code)
    function t(key, replacements) {
        let val = getNestedValue(langData, key);
        if (val === null) return key;
        if (replacements) {
            Object.keys(replacements).forEach(k => {
                val = val.replace(new RegExp('\\{' + k + '\\}', 'g'), replacements[k]);
            });
        }
        return val;
    }

    // ========== Initialization ==========

    async function init() {
        // 1. Detect language (priority: URL > storage > browser)
        let lang = detectFromURL() || detectFromStorage() || detectFromBrowser() || DEFAULT_LANG;

        // 2. Load and apply initial language
        currentLang = lang;
        const data = await loadLang(lang);
        if (data) {
            applyTranslations(data);
        }

        // 3. Initialize switcher UI
        initSwitcher();

        // 4. Background: check IP and switch if user hasn't explicitly chosen
        if (!detectFromURL() && !detectFromStorage()) {
            detectFromIP().then(ipLang => {
                if (ipLang && ipLang !== currentLang) {
                    switchLanguage(ipLang);
                }
            });
        }
    }

    // Export to global scope
    window.i18n = {
        init: init,
        switchLanguage: switchLanguage,
        t: t,
        getCurrentLang: () => currentLang
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
