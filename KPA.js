   (function () {
            if (!APP_CONFIG.SECURITY.enabled) return;
            const targetUrl = atob(APP_CONFIG.SECURITY.keyapi);
            let allowedHost = "";
            try {
                allowedHost = new URL(targetUrl).hostname.toLowerCase().replace(/^www\./, "");
            } catch (e) {
                console.error("Config Error");
                return;
            }
            const currentHost = location.hostname.toLowerCase().replace(/^www\./, "");
            const isAllowed = currentHost === allowedHost || currentHost.endsWith("." + allowedHost);

            if (!isAllowed) {
                document.documentElement.innerHTML = `
                <head><title>Error</title></head>
                <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#fff;font-family:Arial;text-align:center;">
                    <div><h1>ERROR</h1><p>Domain tidak diizinkan.</p><p>Mengalihkan...</p></div>
                </body>`;
                setTimeout(() => { location.replace(targetUrl); }, 2000);
                throw new Error("Unauthorized Domain");
            }
        })();

        const {
            firestoreDB, auth, provider, collection, addDoc, query, orderBy, onSnapshot,
            serverTimestamp, doc, deleteDoc, updateDoc, getDocs, where, signInWithPopup, signOut, onAuthStateChanged
        } = window.FirebaseService;

        /* ELEMENT DOM SELECTOR */
        const player = document.getElementById(APP_ELEMENT.PLAYER);
        const comments = document.getElementById(APP_ELEMENT.CHAT);
        const scrollArea = document.getElementById(APP_ELEMENT.CHAT_SCROLL);
        const txtMessage = document.getElementById(APP_ELEMENT.CHAT_INPUT);
        const btnSend = document.getElementById(APP_ELEMENT.SEND_BUTTON);
        const loginBtn = document.getElementById(APP_ELEMENT.LOGIN_BUTTON);
        const avatar = document.getElementById(APP_ELEMENT.USER_AVATAR);
        const pinnedBox = document.getElementById(APP_ELEMENT.PINNED);
        const openChatBtn = document.getElementById(APP_ELEMENT.OPEN_CHAT);
        const closeChatBtn = document.getElementById(APP_ELEMENT.CLOSE_CHAT);
        const chatWindow = document.getElementById(APP_ELEMENT.CHAT_WINDOW);
        const notifBadge = document.getElementById(APP_ELEMENT.NOTIF);
        const likeBtn = document.getElementById(APP_ELEMENT.LIKE_BUTTON);
        const likeCount = document.getElementById(APP_ELEMENT.LIKE_COUNT);
        const viewerCount = document.getElementById(APP_ELEMENT.VIEWER_COUNT);
        const installBtn = document.getElementById(APP_ELEMENT.INSTALL_BUTTON);
        const installText = document.getElementById(APP_ELEMENT.INSTALL_TEXT);
        const modal = document.getElementById(APP_ELEMENT.MODAL);
        const modalBtn = document.getElementById(APP_ELEMENT.MODAL_BUTTON);
        const modalClose = document.getElementById(APP_ELEMENT.MODAL_CLOSE);

        /* POPUP SYSTEM CHAT ELEMENT */
        const emojiMenu = document.getElementById("emojiMenu");
        const flagMenu = document.getElementById("flagMenu");
        const emojiTrigger = document.getElementById("emojiTrigger");
        const flagTrigger = document.getElementById("flagTrigger");

        /* HELPERS */
        function $(id){ return document.getElementById(id); }
        function escapeHTML(text){
            if(!text) return "";
            return text.replace(/[&<>'"]/g, function(m){
                return { "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[m];
            });
        }
        function formatCount(number){
            if(number>=1000000) return (number/1000000).toFixed(1)+"M";
            if(number>=1000) return (number/1000).toFixed(1)+"K";
            return number;
        }

        /* GOOGLE AUTHENTICATION SYSTEM */
        async function loginGoogle(){
            try { await signInWithPopup(auth, provider); }
            catch(error){ console.error(error); alert("Login gagal\n"+error.message); }
        }
        async function logoutGoogle(){
            if(!confirm("Apakah ingin logout?")) return;
            try { await signOut(auth); } catch(error){ console.error(error); }
        }

        onAuthStateChanged(auth, user=>{
            if(user){
                APP_STATE.currentUser={ uid:user.uid, name:user.displayName, email:user.email, photoURL:user.photoURL };
                loginBtn.style.display="none";
                avatar.src=user.photoURL;
                avatar.style.display="block";
                if(APP_CONFIG.ADMINS.includes(user.email)){ document.body.classList.add("is-admin"); }
            } else {
                APP_STATE.currentUser=null;
                loginBtn.style.display="block";
                avatar.style.display="none";
                document.body.classList.remove("is-admin");
            }
        });

        /* TRIGGER CONTROL */
        openChatBtn.onclick=()=>{
            chatWindow.style.display="flex";
            openChatBtn.style.display="none";
            APP_STATE.isChatOpen=true;
            APP_STATE.unreadCount=0;
            notifBadge.style.display="none";
            notifBadge.innerText="0";
            scrollArea.scrollTop = scrollArea.scrollHeight;
        };
        closeChatBtn.onclick=()=>{
            chatWindow.style.display="none";
            openChatBtn.style.display="flex";
            APP_STATE.isChatOpen=false;
        };

        loginBtn.onclick=loginGoogle;
        avatar.onclick=logoutGoogle;
        const refreshBtn = document.getElementById("headerRefresh");
        if(refreshBtn){ refreshBtn.onclick=()=>{ location.reload(); }; }

        /* WRITE CHAT CONTROLLER */
        btnSend.onclick = async () => {
            if (!APP_STATE.currentUser) { alert("Silakan login terlebih dahulu."); return; }
            const message = txtMessage.value.trim();
            if (message === "") return;
            btnSend.disabled = true;

            try {
                await addDoc(collection(firestoreDB, "comments"), {
                    name: APP_STATE.currentUser.name,
                    email: APP_STATE.currentUser.email,
                    photoURL: APP_STATE.currentUser.photoURL,
                    message: message,
                    isPinned: false,
                    createdAt: serverTimestamp()
                });
                txtMessage.value = "";
                txtMessage.focus();
            } catch (error) {
                console.error(error);
                alert("Gagal mengirim komentar.");
            } finally {
                btnSend.disabled = false;
            }
        };

        txtMessage.addEventListener("keydown", function(e){
            if(e.key === "Enter" && !e.shiftKey){
                e.preventDefault();
                btnSend.click();
            }
        });

        window.deleteComment = async function(id){
            if(!confirm("Hapus komentar ini?")) return;
            try { await deleteDoc(doc(firestoreDB, "comments", id)); }
            catch(error){ console.error(error); alert("Gagal menghapus komentar."); }
        };

        window.togglePinComment = async function(id, currentStatus){
            try {
                if(!currentStatus){
                    const snapshot = await getDocs(query(collection(firestoreDB, "comments"), where("isPinned", "==", true)));
                    for(const item of snapshot.docs){
                        await updateDoc(doc(firestoreDB, "comments", item.id), { isPinned:false });
                    }
                }
                await updateDoc(doc(firestoreDB, "comments", id), { isPinned:!currentStatus });
            } catch(error){ console.error(error); alert("Gagal memperbarui pin."); }
        };

        txtMessage.addEventListener("input", function(){
            this.style.height="auto";
            this.style.height= this.scrollHeight+"px";
        });

        const MAX_MESSAGE = 500;
        txtMessage.addEventListener("input", function(){
            if(this.value.length > MAX_MESSAGE){
                this.value = this.value.substring(0, MAX_MESSAGE);
            }
        });

        /* REALTIME FIREBASE DATABASE SYNCHRONIZER */
        const commentsQuery = query(collection(firestoreDB, "comments"), orderBy("createdAt", "asc"));
        onSnapshot(commentsQuery, (snapshot)=>{
            if(!APP_STATE.isFirstLoad && !APP_STATE.isChatOpen){
                let newComment = 0;
                snapshot.docChanges().forEach((change)=>{
                    if(change.type==="added"){ newComment++; }
                });
                if(newComment>0){
                    APP_STATE.unreadCount += newComment;
                    notifBadge.innerText = APP_STATE.unreadCount;
                    notifBadge.style.display="block";
                }
            }
            APP_STATE.isFirstLoad=false;

            let normalHTML="";
            let pinnedHTML="";
            let hasPinned=false;
            const autoScroll = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 100;

            snapshot.forEach((item)=>{
                const data=item.data();
                const id=item.id;
                const isAdmin = APP_CONFIG.ADMINS.includes(data.email);
                const badge = isAdmin ? '<span class="badge-admin">Admin ✔️</span>' : "";
                const renderData = { id, data, badge, isAdmin };

                if(data.isPinned){
                    hasPinned=true;
                    pinnedHTML += renderPinnedComment(renderData);
                } else {
                    normalHTML += renderComment(renderData);
                }
            });

            if(hasPinned){
                pinnedBox.innerHTML = pinnedHTML;
                pinnedBox.classList.add("has-pin");
            } else {
                pinnedBox.innerHTML="";
                pinnedBox.classList.remove("has-pin");
            }

            comments.innerHTML = normalHTML;
            if(autoScroll){ scrollArea.scrollTop = scrollArea.scrollHeight; }
        }, (error)=>{ console.error("Realtime Error", error); });

        /* COMPONENT EMBED RENDER */
        function formatCommentTime(timestamp){
            if(!timestamp) return "Mengirim...";
            try { return timestamp.toDate().toLocaleString("id-ID", { hour:"2-digit", minute:"2-digit" }); }
            catch(e){ return "Mengirim..."; }
        }

        /* RENDERING RAW STRINGS COMMENT */
        function renderComment(item){
            const { id, data, badge, isAdmin } = item;
            return `
            <div class="comment">
                <img class="comment-avatar" src="${data.photoURL}" alt="avatar">
                <div class="comment-content">
                    <div class="name-wrapper">
                        <span class="name" style="${isAdmin ? "color:#ffd166;" : ""}">${escapeHTML(data.name)}</span>
                        ${badge}
                    </div>
                    <div class="text-comment">${escapeHTML(data.message)}</div>
                    <div class="time">${formatCommentTime(data.createdAt)}</div>
                </div>
                <div class="admin-actions">
                    <button class="pin-btn" onclick="togglePinComment('${id}', ${data.isPinned || false})">${data.isPinned ? "📌" : "📍"}</button>
                    <button class="delete-btn" onclick="deleteComment('${id}')">🗑️</button>
                </div>
            </div>`;
        }

        function renderPinnedComment(item){
            return `<div class="pin-label">📌 KOMENTAR SEMATAN</div>${renderComment(item)}`;
        }

        function scrollBottom(){ if(!scrollArea) return; scrollArea.scrollTop = scrollArea.scrollHeight; }
        function resetNotification(){ APP_STATE.unreadCount = 0; notifBadge.innerText = "0"; notifBadge.style.display = "none"; }

        if(openChatBtn){ openChatBtn.addEventListener("click", ()=>{ resetNotification(); scrollBottom(); }); }

        /* INTERACT POPUP SYSTEM */
        function insertAtCursor(text){
            if(!txtMessage) return;
            const start = txtMessage.selectionStart;
            const end = txtMessage.selectionEnd;
            txtMessage.value = txtMessage.value.substring(0, start) + text + txtMessage.value.substring(end);
            txtMessage.focus();
            txtMessage.selectionStart = txtMessage.selectionEnd = start + text.length;
        }

        document.querySelectorAll(".grid-item").forEach(btn=>{
            btn.addEventListener("click", function(e){
                e.stopPropagation();
                const emoji = this.dataset.emoji || this.textContent;
                insertAtCursor(emoji);
            });
        });

        function closePopupMenu(){
            if(emojiMenu) emojiMenu.style.display="none";
            if(flagMenu) flagMenu.style.display="none";
        }
        function toggleEmoji(){
            if(!emojiMenu) return;
            if(flagMenu) flagMenu.style.display="none";
            emojiMenu.style.display = emojiMenu.style.display==="grid" ? "none" : "grid";
        }
        function toggleFlag(){
            if(!flagMenu) return;
            if(emojiMenu) emojiMenu.style.display="none";
            flagMenu.style.display = flagMenu.style.display==="grid" ? "none" : "grid";
        }

        if(emojiTrigger){ emojiTrigger.addEventListener("click", function(e){ e.stopPropagation(); toggleEmoji(); }); }
        if(flagTrigger){ flagTrigger.addEventListener("click", function(e){ e.stopPropagation(); toggleFlag(); }); }

        /* ---------- MODAL DONASI SYSTEM ---------- */
        if (modalBtn && modal) {
            modalBtn.onclick = () => {
                modal.style.display = "block";
            };
        }

        if (modalClose && modal) {
            modalClose.onclick = () => {
                closeDonationModal();
            };
        }

        function closeDonationModal() {
            modal.style.display = "none";
            if ($("pnQris")) $("pnQris").style.display = "none";
            if ($("pnWallet")) $("pnWallet").style.display = "none";
        }

        window.toggleQRIS = function() {
            const qrisSec = $("pnQris");
            const walletSec = $("pnWallet");
            if (qrisSec) {
                if(walletSec) walletSec.style.display = "none";
                qrisSec.style.display = qrisSec.style.display === "block" ? "none" : "block";
            }
        };

        window.toggleEwallet = function() {
            const qrisSec = $("pnQris");
            const walletSec = $("pnWallet");
            if (walletSec) {
                if(qrisSec) qrisSec.style.display = "none";
                walletSec.style.display = walletSec.style.display === "block" ? "none" : "block";
            }
        };

        window.copyNumber = function() {
            const numText = $("pnNumber") ? $("pnNumber").innerText : "";
            if (numText) {
                navigator.clipboard.writeText(numText).then(() => {
                    alert("Nomor berhasil disalin: " + numText);
                }).catch(err => {
                    console.error("Gagal menyalin text: ", err);
                });
            }
        };

      
  
