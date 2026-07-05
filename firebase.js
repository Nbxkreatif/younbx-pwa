import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcPjAEy81n9GkWtbnEDGj0213FlkonY7o",
  authDomain: "komentarlive.firebaseapp.com",
  databaseURL: "https://komentarlive-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "komentarlive",
  storageBucket: "komentarlive.firebasestorage.app",
  messagingSenderId: "784367055167",
  appId: "1:784367055167:web:5db0d2eaf3c61de97c638a"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    "https://nbxkreatif.github.io/younbx-pwa/firebase-messaging-sw.js"
  ).then(async (registration) => {

    const permission = await Notification.requestPermission();

    if (permission === "granted") {

      const token = await getToken(messaging, {
        vapidKey: "iGxBX4y5iShDx4byION2nc1leJiD1VDQOiK1NwvaVn4",
        serviceWorkerRegistration: registration
      });

      console.log("FCM Token:", token);

      alert("Notifikasi berhasil diaktifkan");
    } else {
      alert("Izin notifikasi ditolak");
    }

  });
}
