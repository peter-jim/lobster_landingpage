/**
 * OpenClaw i18n Engine
 * Handles language detection (URL > localStorage > IP > browser), switching, and DOM updates.
 * Translation data is embedded inline for maximum compatibility (works with file:// and http://).
 */
(function () {
    'use strict';

    const SUPPORTED_LANGS = ['zh-CN', 'en', 'ja'];
    const DEFAULT_LANG = 'zh-CN';
    const STORAGE_KEY = 'oc_lang';

    // ========== Embedded Translation Data ==========
    const LANG_DATA = {"zh-CN":{"meta":{"title":"OpenClaw桌面版 - 免费桌面宠物小龙虾养成软件下载 | OpenClaw桌面龙虾","description":"OpenClaw桌面版（OpenClaw桌面龙虾）是一款免费桌面宠物养成软件，网页版已上线可直接在线体验！在你的电脑桌面养一只可爱的赛博小龙虾，支持Mac和Windows，像素风互动养成、技能解锁、趣味陪伴，立即体验OpenClaw桌面版。","ogTitle":"OpenClaw桌面版 - 免费下载你的专属桌面宠物小龙虾","ogDesc":"OpenClaw桌面版网页版已上线，立即在线体验！在桌面养一只赛博小龙虾，像素风养成、趣味互动、技能解锁，支持Mac/Windows。"},"nav":{"features":"功能特色","stats":"数据统计","credibility":"团队实力","faq":"常见问题","tryNow":"立即体验"},"hero":{"subtitle":"OpenClaw桌面版 · 你的专属桌面龙虾宠物","desc":"领养你的赛博小龙虾，OpenClaw桌面版带来全新桌面宠物养成体验！网页版已上线，无需下载即可在线体验。趣味互动、技能解锁、像素风冒险。","downloadMac":"Mac版下载","downloadWin":"Windows版下载","macAriaLabel":"下载OpenClaw桌面龙虾Mac版","winAriaLabel":"下载OpenClaw桌面龙虾Windows版"},"aff":{"title":"你的好友邀请你体验 OpenClaw！","codeLabel":"专属邀请码:","copyBtn":"复制","copiedBtn":"已复制","tip":"安装后打开 App，输入邀请码即可获得额外奖励"},"features":{"title":"为什么选择 OpenClaw桌面版？","subtitle":"OpenClaw桌面版——一只有趣、可爱、聪明的赛博小龙虾，让你的桌面从此不再无聊。","card1Title":"像素风养成","card1Desc":"精美像素艺术风格的桌面宠物，复古又现代。喂食、玩耍、训练你的小龙虾，看它一天天成长。","card2Title":"技能解锁","card2Desc":"随着互动积累经验值，解锁独特的龙虾技能。每只龙虾的成长路线都不一样，打造你的专属桌面伙伴。","card3Title":"跨平台支持","card3Desc":"同时支持 macOS 和 Windows 系统，无论你用什么电脑，都能拥有一只桌面小龙虾陪你工作和学习。","card4Title":"免费下载","card4Desc":"OpenClaw桌面版免费下载，基础养成功能全部免费体验。需要更强大的 AI 算力？可按需解锁高级功能。"},"stats":{"title":"用数据说话","subtitle":"OpenClaw桌面龙虾是一款<strong>完全免费</strong>的桌面宠物养成软件，已有超过万名用户选择信赖。","downloads":"全球用户下载","skills":"可解锁技能","compatibility":"系统兼容性","size":"轻量安装包","rating":"用户评分"},"credibility":{"title":"海外名校团队，打造极致桌面体验","subtitle":"核心团队成员来自全球顶尖学府，深耕游戏交互与 AI 技术领域。","harvard":"哈佛大学","mit":"麻省理工学院","tsinghua":"清华大学","stanford":"斯坦福大学","techTitle":"顶尖科技公司技术生态","techSubtitle":"团队核心成员拥有全球一线科技公司工作经验，技术实力雄厚。"},"compare":{"title":"为什么选择 OpenClaw？","subtitle":"与市面上其他桌面宠物软件相比，OpenClaw 在多个维度领先。","headerFeature":"功能特性","headerOC":"OpenClaw 桌面龙虾","headerOther":"其他桌面宠物","price":"价格","priceSelf":"✅ 完全免费","priceOther":"部分付费","os":"系统支持","osSelf":"✅ Windows + Mac","osOther":"通常单一系统","skillCount":"技能数量","skillSelf":"✅ 20+","skillOther":"5-10","install":"安装难度","installSelf":"✅ 一键安装","installOther":"需要配置","resource":"资源占用","resourceSelf":"✅ 低（<100MB内存）","resourceOther":"较高","privacy":"隐私保护","privacySelf":"✅ 本地运行，无上传","privacyOther":"可能收集数据"},"quote":{"text":"桌面宠物不仅是娱乐工具，更是提升工作效率和情感陪伴的创新方式。我们将最前沿的技术融入到一只小小的桌面龙虾中，让每一次互动都充满惊喜。","author":"OpenClaw Team","role":"核心团队 · 海外名校背景 · 10年+开发经验"},"faq":{"title":"常见问题","subtitle":"关于 OpenClaw 桌面龙虾，你可能想了解的一切。","q1":"OpenClaw桌面版是免费的吗？","a1":"OpenClaw桌面版免费下载，支持Mac和Windows系统。基础的桌面宠物养成功能全部免费，部分高级功能（如AI算力）可根据需要付费解锁。","q2":"OpenClaw桌面版支持哪些操作系统？","a2":"OpenClaw桌面版目前支持macOS和Windows两大操作系统。无论你使用苹果电脑还是Windows PC，都可以下载安装OpenClaw桌面版并使用。","q3":"桌面龙虾有哪些互动功能？","a3":"OpenClaw桌面版支持丰富的互动功能：像素风养成、喂食、玩耍、训练、技能解锁、桌面冒险等。你的小龙虾会随着互动不断成长，解锁专属技能，成为你独一无二的桌面伙伴。","q4":"如何下载OpenClaw桌面版？","a4":"访问官网 lobster.pet 即可免费下载Mac版和Windows版的OpenClaw桌面版。点击页面顶部的下载按钮，选择对应的系统版本即可。","q5":"桌面龙虾会影响电脑性能吗？","a5":"资源占用很小。OpenClaw桌面版经过精心优化，运行时内存占用约 100-200MB，不会影响你的正常办公或游戏体验。它会静静地待在你的桌面上，等待你的互动。"},"cta":{"title":"准备好领养你的桌面龙虾了吗？","subtitle":"OpenClaw桌面版网页版已上线！无需下载，打开浏览器即可在线体验。桌面版 Mac/Windows 同步开发中。","tryOnline":"🦞 立即在线体验","desktopDownload":"🖥️ 桌面版下载"},"footer":{"brand":"OpenClaw桌面龙虾","privacy":"隐私政策","terms":"用户协议","contact":"联系我们","seoText":"OpenClaw桌面版（lobster.pet）又名OpenClaw桌面龙虾，是一款免费桌面宠物养成软件，支持Mac和Windows系统。像素风互动养成、技能解锁、趣味陪伴，立即下载OpenClaw桌面版，在你的电脑桌面养一只可爱的赛博小龙虾。","copyright":"© 2026 OpenClaw桌面版 (Lobster.pet) · 免费桌面宠物养成软件下载"},"loading":{"msg1":"正在召唤小龙虾...","msg2":"准备桌面冒险地图...","msg3":"打磨像素世界...","msg4":"小龙虾正在热身...","msg5":"加载中，马上就好..."},"toast":{"fetchingVersion":"🦞 正在获取最新版本...","downloadMac":"🦞 开始下载 Mac {arch} 版 v{version}！","downloadFallback":"🦞 下载备用版本 v{version}...","downloadWin":"🦞 开始下载 Windows 版 v{version}！","copyFail":"复制失败，请手动复制邀请码: "},"langSwitcher":{"zh-CN":"中文","en":"English","ja":"日本語"}},"en":{"meta":{"title":"OpenClaw - Free Desktop Pet Lobster | Pixel Art Virtual Pet for Mac & Windows","description":"OpenClaw is a free desktop pet app. Adopt your own cyber lobster! Available as a web app and desktop download for Mac & Windows. Pixel art style, skill unlocking, interactive adventures.","ogTitle":"OpenClaw - Your Free Desktop Pet Lobster","ogDesc":"Adopt a cyber lobster on your desktop! Free pixel-art pet with skill unlocking, interactive adventures. Available for Mac & Windows."},"nav":{"features":"Features","stats":"Stats","credibility":"Our Team","faq":"FAQ","tryNow":"Try Now"},"hero":{"subtitle":"OpenClaw · Your Personal Desktop Lobster Pet","desc":"Adopt your own cyber lobster! OpenClaw brings a brand-new desktop pet experience. Web version is live — play instantly in your browser. Interactive fun, skill unlocking & pixel-art adventures.","downloadMac":"Download for Mac","downloadWin":"Download for Windows","macAriaLabel":"Download OpenClaw for Mac","winAriaLabel":"Download OpenClaw for Windows"},"aff":{"title":"Your friend invited you to try OpenClaw!","codeLabel":"Invite Code:","copyBtn":"Copy","copiedBtn":"Copied","tip":"Open the app after installing, enter the invite code to get bonus rewards"},"features":{"title":"Why Choose OpenClaw?","subtitle":"A fun, adorable & intelligent cyber lobster that makes your desktop come alive.","card1Title":"Pixel Art Style","card1Desc":"A beautiful pixel-art desktop pet — retro yet modern. Feed, play with, and train your lobster. Watch it grow day by day.","card2Title":"Skill Unlocking","card2Desc":"Earn XP through interactions and unlock unique lobster skills. Every lobster's growth path is different — create your one-of-a-kind desktop companion.","card3Title":"Cross-Platform","card3Desc":"Supports both macOS and Windows. No matter what computer you use, you can have a desktop lobster to keep you company while working or studying.","card4Title":"Free to Download","card4Desc":"OpenClaw is free to download with all core features included. Need more powerful AI capabilities? Premium features available on demand."},"stats":{"title":"The Numbers Speak","subtitle":"OpenClaw is a <strong>completely free</strong> desktop pet app, trusted by over 10,000 users worldwide.","downloads":"Global Downloads","skills":"Unlockable Skills","compatibility":"System Compatibility","size":"Lightweight Install","rating":"User Rating"},"credibility":{"title":"World-Class Team, Premium Desktop Experience","subtitle":"Our core team members come from top global universities, specializing in game interaction & AI technology.","harvard":"Harvard University","mit":"MIT","tsinghua":"Tsinghua University","stanford":"Stanford University","techTitle":"Backed by Top Tech Talent","techSubtitle":"Core team members bring experience from leading global tech companies."},"compare":{"title":"Why Choose OpenClaw?","subtitle":"See how OpenClaw stacks up against other desktop pets.","headerFeature":"Feature","headerOC":"OpenClaw","headerOther":"Other Desktop Pets","price":"Price","priceSelf":"✅ Completely Free","priceOther":"Partially Paid","os":"OS Support","osSelf":"✅ Windows + Mac","osOther":"Usually single OS","skillCount":"Skills","skillSelf":"✅ 20+","skillOther":"5-10","install":"Installation","installSelf":"✅ One-click Install","installOther":"Requires setup","resource":"Resource Usage","resourceSelf":"✅ Low (<100MB RAM)","resourceOther":"Higher","privacy":"Privacy","privacySelf":"✅ Runs locally, no uploads","privacyOther":"May collect data"},"quote":{"text":"A desktop pet is more than entertainment — it's an innovative way to boost productivity and provide emotional companionship. We've infused cutting-edge technology into a tiny desktop lobster, making every interaction a delightful surprise.","author":"OpenClaw Team","role":"Core Team · Top University Background · 10+ Years Experience"},"faq":{"title":"Frequently Asked Questions","subtitle":"Everything you need to know about OpenClaw.","q1":"Is OpenClaw free?","a1":"Yes! OpenClaw is free to download for both Mac and Windows. All core desktop pet features are completely free. Some premium features (like AI compute power) can be unlocked as needed.","q2":"What operating systems does OpenClaw support?","a2":"OpenClaw currently supports macOS and Windows. Whether you use a Mac or a Windows PC, you can download and enjoy OpenClaw.","q3":"What interactive features does OpenClaw have?","a3":"OpenClaw offers rich interactive features: pixel-art raising, feeding, playing, training, skill unlocking, desktop adventures, and more. Your lobster grows through interactions, unlocking unique skills to become your one-of-a-kind desktop companion.","q4":"How do I download OpenClaw?","a4":"Visit the official website lobster.pet to download OpenClaw for free on Mac and Windows. Click the download buttons at the top of the page and select your system version.","q5":"Will it affect my computer's performance?","a5":"Not at all. OpenClaw is carefully optimized with minimal resource usage (about 100-200MB RAM). It won't affect your normal work or gaming. It sits quietly on your desktop, waiting for your interaction."},"cta":{"title":"Ready to Adopt Your Desktop Lobster?","subtitle":"The web version is live! No download needed — play instantly in your browser. Desktop version for Mac/Windows also available.","tryOnline":"🦞 Try Online Now","desktopDownload":"🖥️ Desktop Download"},"footer":{"brand":"OpenClaw","privacy":"Privacy Policy","terms":"Terms of Service","contact":"Contact Us","seoText":"OpenClaw (lobster.pet) is a free desktop pet app for Mac and Windows. Pixel-art interactive raising, skill unlocking, and fun companionship. Download OpenClaw now and adopt an adorable cyber lobster on your desktop.","copyright":"© 2026 OpenClaw (Lobster.pet) · Free Desktop Pet App"},"loading":{"msg1":"Summoning your lobster...","msg2":"Preparing the adventure map...","msg3":"Polishing the pixel world...","msg4":"Lobster warming up...","msg5":"Almost ready..."},"toast":{"fetchingVersion":"🦞 Fetching latest version...","downloadMac":"🦞 Downloading Mac {arch} v{version}!","downloadFallback":"🦞 Downloading fallback v{version}...","downloadWin":"🦞 Downloading Windows v{version}!","copyFail":"Copy failed. Please copy the invite code manually: "},"langSwitcher":{"zh-CN":"中文","en":"English","ja":"日本語"}},"ja":{"meta":{"title":"OpenClaw - 無料デスクトップペット ロブスター | ピクセルアート バーチャルペット Mac & Windows対応","description":"OpenClawは無料のデスクトップペット育成アプリです。あなただけのサイバーロブスターを飼おう！Webアプリで今すぐ体験、Mac/Windows版もダウンロード可能。ピクセルアート、スキル解放、インタラクティブな冒険。","ogTitle":"OpenClaw - あなただけの無料デスクトップペット ロブスター","ogDesc":"デスクトップにサイバーロブスターを！無料ピクセルアートペット、スキル解放、インタラクティブな冒険。Mac/Windows対応。"},"nav":{"features":"機能紹介","stats":"実績データ","credibility":"チーム紹介","faq":"よくある質問","tryNow":"今すぐ体験"},"hero":{"subtitle":"OpenClaw · あなた専用のデスクトップ ロブスターペット","desc":"あなただけのサイバーロブスターを迎えよう！OpenClawが全く新しいデスクトップペット体験をお届けします。Web版は公開中、ブラウザですぐに遊べます。楽しいインタラクション、スキル解放、ピクセルアート冒険。","downloadMac":"Mac版ダウンロード","downloadWin":"Windows版ダウンロード","macAriaLabel":"OpenClaw Mac版をダウンロード","winAriaLabel":"OpenClaw Windows版をダウンロード"},"aff":{"title":"お友達からOpenClawへの招待です！","codeLabel":"招待コード:","copyBtn":"コピー","copiedBtn":"コピー済","tip":"インストール後にアプリを開き、招待コードを入力してボーナス報酬をゲット"},"features":{"title":"OpenClawが選ばれる理由","subtitle":"面白くて、かわいくて、賢いサイバーロブスターが、あなたのデスクトップを楽しくします。","card1Title":"ピクセルアート育成","card1Desc":"美しいピクセルアートスタイルのデスクトップペット。レトロでモダン。エサをあげたり、遊んだり、トレーニングして、日々の成長を見守ろう。","card2Title":"スキル解放","card2Desc":"インタラクションで経験値を積み、ユニークなロブスタースキルを解放。育成ルートはそれぞれ異なり、あなただけのデスクトップパートナーに。","card3Title":"クロスプラットフォーム","card3Desc":"macOSとWindows両方に対応。どのパソコンでも、仕事や勉強のお供にデスクトップロブスターを。","card4Title":"無料ダウンロード","card4Desc":"OpenClawは無料でダウンロード、基本機能はすべて無料。より強力なAI機能が必要なら、プレミアム機能をオンデマンドで解放できます。"},"stats":{"title":"数字で見る実績","subtitle":"OpenClawは<strong>完全無料</strong>のデスクトップペット育成アプリ。世界中で1万人以上のユーザーに信頼されています。","downloads":"グローバルダウンロード","skills":"解放可能スキル","compatibility":"システム互換性","size":"軽量インストール","rating":"ユーザー評価"},"credibility":{"title":"世界トップクラスのチームが作る極上の体験","subtitle":"コアチームメンバーは世界最高峰の大学出身、ゲームインタラクションとAI技術に精通。","harvard":"ハーバード大学","mit":"MIT（マサチューセッツ工科大学）","tsinghua":"清華大学","stanford":"スタンフォード大学","techTitle":"トップテック企業の技術力","techSubtitle":"コアチームメンバーはグローバルトップテック企業での実務経験を持っています。"},"compare":{"title":"なぜOpenClawを選ぶのか？","subtitle":"他のデスクトップペットアプリとの比較をご覧ください。","headerFeature":"機能","headerOC":"OpenClaw","headerOther":"他のデスクトップペット","price":"価格","priceSelf":"✅ 完全無料","priceOther":"一部有料","os":"OS対応","osSelf":"✅ Windows + Mac","osOther":"通常単一OS","skillCount":"スキル数","skillSelf":"✅ 20+","skillOther":"5-10","install":"インストール","installSelf":"✅ ワンクリック","installOther":"設定が必要","resource":"リソース使用量","resourceSelf":"✅ 低い（RAM 100MB未満）","resourceOther":"やや高い","privacy":"プライバシー","privacySelf":"✅ ローカル実行、アップロードなし","privacyOther":"データ収集の可能性あり"},"quote":{"text":"デスクトップペットは単なる娯楽ツールではありません。生産性を高め、感情的な癒しをもたらす革新的な方法です。最先端の技術を小さなデスクトップロブスターに詰め込み、すべてのインタラクションを楽しい驚きに変えています。","author":"OpenClaw Team","role":"コアチーム · 海外名門大学出身 · 開発経験10年以上"},"faq":{"title":"よくある質問","subtitle":"OpenClawについて知りたいことすべて。","q1":"OpenClawは無料ですか？","a1":"はい！OpenClawはMac・Windows両方で無料ダウンロードできます。デスクトップペットの基本機能はすべて無料です。一部のプレミアム機能（AI計算能力など）は必要に応じて解放できます。","q2":"対応しているOSは？","a2":"OpenClawは現在macOSとWindowsに対応しています。Macでも Windows PCでも、ダウンロードしてお楽しみいただけます。","q3":"どんなインタラクション機能がありますか？","a3":"OpenClawはピクセルアート育成、エサやり、遊び、トレーニング、スキル解放、デスクトップ冒険など豊富なインタラクション機能を搭載。ロブスターはインタラクションを通じて成長し、ユニークなスキルを解放して、あなただけのデスクトップパートナーになります。","q4":"ダウンロード方法は？","a4":"公式サイト lobster.pet にアクセスして、Mac版・Windows版のOpenClawを無料でダウンロードできます。ページ上部のダウンロードボタンをクリックし、お使いのシステムを選択してください。","q5":"パソコンの動作に影響しますか？","a5":"影響はありません。OpenClawは最適化されており、メモリ使用量は約100〜200MB程度です。通常の作業やゲームに支障はありません。デスクトップで静かにあなたのインタラクションを待っています。"},"cta":{"title":"デスクトップ ロブスターを迎える準備はできましたか？","subtitle":"Web版は公開中！ダウンロード不要、ブラウザですぐに体験できます。デスクトップ版 Mac/Windows も開発中。","tryOnline":"🦞 今すぐオンラインで体験","desktopDownload":"🖥️ デスクトップ版ダウンロード"},"footer":{"brand":"OpenClaw","privacy":"プライバシーポリシー","terms":"利用規約","contact":"お問い合わせ","seoText":"OpenClaw（lobster.pet）は、Mac/Windows対応の無料デスクトップペット育成アプリです。ピクセルアートのインタラクティブ育成、スキル解放、楽しい仲間。今すぐOpenClawをダウンロードして、かわいいサイバーロブスターをデスクトップに迎えましょう。","copyright":"© 2026 OpenClaw (Lobster.pet) · 無料デスクトップペットアプリ"},"loading":{"msg1":"ロブスターを呼び出し中...","msg2":"冒険マップを準備中...","msg3":"ピクセルワールドを磨き中...","msg4":"ロブスターウォーミングアップ中...","msg5":"もうすぐ準備完了..."},"toast":{"fetchingVersion":"🦞 最新版を取得中...","downloadMac":"🦞 Mac {arch} 版 v{version} をダウンロード中！","downloadFallback":"🦞 バックアップ版 v{version} をダウンロード中...","downloadWin":"🦞 Windows版 v{version} をダウンロード中！","copyFail":"コピーに失敗しました。招待コードを手動でコピーしてください: "},"langSwitcher":{"zh-CN":"中文","en":"English","ja":"日本語"}}};

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
        if (isSupported(l)) return l;
        if (/^zh/i.test(l)) return 'zh-CN';
        if (/^ja/i.test(l)) return 'ja';
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

    // ========== Language Loading (inline, no fetch needed) ==========

    function loadLang(lang) {
        return LANG_DATA[lang] || LANG_DATA[DEFAULT_LANG] || null;
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

        // Prevent dropdown clicks from closing the dropdown before processing
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Language option click
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = opt.getAttribute('data-lang');
                if (lang && lang !== currentLang) {
                    switchLanguage(lang);
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

    function switchLanguage(lang) {
        if (!isSupported(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* ignore */ }

        const data = loadLang(lang);
        if (data) {
            applyTranslations(data);
            updateLoadingMessages(data);
        }
    }

    function updateLoadingMessages(data) {
        if (!data || !data.loading) return;
        window.__i18nLoadingMsgs = [
            data.loading.msg1, data.loading.msg2, data.loading.msg3,
            data.loading.msg4, data.loading.msg5
        ].filter(Boolean);
    }

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

    function init() {
        // 1. Detect language (priority: URL > storage > browser)
        let lang = detectFromURL() || detectFromStorage() || detectFromBrowser() || DEFAULT_LANG;

        // 2. Load and apply initial language (synchronous — data is inline)
        currentLang = lang;
        const data = loadLang(lang);
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
