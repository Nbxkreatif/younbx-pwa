importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCcPjAEy81n9GkWtbnEDGj0213FlkonY7o",
  authDomain: "komentarlive.firebaseapp.com",
  databaseURL: "https://komentarlive-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "komentarlive",
  storageBucket: "komentarlive.firebasestorage.app",
  messagingSenderId: "784367055167",
  appId: "1:784367055167:web:5db0d2eaf3c61de97c638a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Message:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "https://nbxkreatif.github.io/younbx-pwa/20260704_040233.png",
      badge: "https://nbxkreatif.github.io/younbx-pwa/20260704_040233.png"
    }
  );
});
