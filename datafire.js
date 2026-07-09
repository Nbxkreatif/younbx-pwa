        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
        import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc, getDocs, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

        const playerApp = initializeApp(APP_CONFIG.PLAYER, "playerApp");
        const realtimeDB = getDatabase(playerApp);

        const chatApp = initializeApp(APP_CONFIG.CHAT, "chatApp");
        const firestoreDB = getFirestore(chatApp);
        const auth = getAuth(chatApp);
        const provider = new GoogleAuthProvider();

        async function loadPlayerIframe() {
            try {
                const snapshot = await get(ref(realtimeDB, "config/iframeUrl"));
                if (snapshot.exists()) {
                    const player = document.getElementById(APP_ELEMENT.PLAYER);
                    if (player) player.src = snapshot.val();
                } else {
                    console.warn("iframeUrl tidak ditemukan.");
                }
            } catch (err) {
                console.error("Gagal memuat iframe:", err);
            }
        }

        window.FirebaseService = {
            realtimeDB, firestoreDB, auth, provider,
            collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc, getDocs, where,
            ref, get, signInWithPopup, signOut, onAuthStateChanged, loadPlayerIframe
        };

        document.addEventListener("DOMContentLoaded", () => {
            FirebaseService.loadPlayerIframe();
        });
    
