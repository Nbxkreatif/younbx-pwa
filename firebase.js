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
