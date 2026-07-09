
        /* CONFIG GLOBAL CONFIGURATION */
        window.APP_CONFIG = {
            PLAYER: {
                apiKey: "AIzaSyD7HHdgrH6T0LCtVIZaoch6ZODgWZoGGXM",
                authDomain: "iftv-112.firebaseapp.com",
                databaseURL: "https://iftv-112-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "iftv-112",
                storageBucket: "iftv-112.firebasestorage.app",
                messagingSenderId: "1050432226610",
                appId: "1:1050432226610:web:73bd1d12c4f23c9704c32b"
            },
            CHAT: {
                apiKey: "AIzaSyCcPjAEy81n9GkWtbnEDGj0213FlkonY7o",
                authDomain: "komentarlive.firebaseapp.com",
                projectId: "komentarlive",
                storageBucket: "komentarlive.firebasestorage.app",
                messagingSenderId: "784367055167",
                appId: "1:784367055167:web:3e2a5fb586070ce77c638a"
            },
            ADMINS: ["dahnial22@gmail.com", "email-admin2@gmail.com"],
            DONATION: {
                phone: "082121210694",
                qrisImage: "",
                dana: "", ovo: "", gopay: "", shopeepay: ""
            },
            SECURITY: {
                enabled: true,
                keyapi: "aHR0" + "cHM6Ly93" + "d3cubmFi" + "aXJla3Jl" + "YXRpZi5j" + "b20="
            },
            VIEWER: {
                night: { min: 35, max: 90 },
                morning: { min: 80, max: 220 },
                afternoon: { min: 180, max: 400 },
                prime: { min: 320, max: 700 },
                updateInterval: 4000
            },
            LIKE: {
                storageKey: "pn_local_likes",
                animationSpeed: 2400
            }
        };

        window.APP_DATA = {
            HEARTS: ["❤️", "💖", "💕", "💗", "💞", "🔥", "💯", "🌹"],
            EMOJI_STORAGE: "pn_emoji",
            DEFAULT_IFRAME: "",
            VERSION: "YouNBX TV V5"
        };

        window.APP_ELEMENT = {
            PLAYER: "player",
            CHAT: "comments",
            CHAT_SCROLL: "comments-scroll-area",
            CHAT_INPUT: "message",
            SEND_BUTTON: "btnKirim",
            LOGIN_BUTTON: "loginBtn",
            USER_AVATAR: "userAvatar",
            PINNED: "pinned-comment-container",
            OPEN_CHAT: "openChatBtn",
            CLOSE_CHAT: "closeChatBtn",
            CHAT_WINDOW: "chatWindow",
            NOTIF: "chatNotifBadge",
            LIKE_BUTTON: "floatLikeBtn",
            LIKE_COUNT: "likeCount",
            VIEWER_COUNT: "viewerCount",
            INSTALL_BUTTON: "installBtn",
            INSTALL_TEXT: "installText",
            MODAL: "pnModal",
            MODAL_BUTTON: "pnSupportBtn",
            MODAL_CLOSE: "pnClose",
            QRIS: "pnQris",
            WALLET: "pnWallet"
        };

        window.APP_STATE = {
            currentUser: null,
            unreadCount: 0,
            isFirstLoad: true,
            isChatOpen: false,
            deferredPrompt: null
        };
    
