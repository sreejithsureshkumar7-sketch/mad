const firebaseConfig = {
  apiKey: "AIzaSyDd_BFLn4-YTkEkSu4sIPxpPxeDQJZpcVk",
  authDomain: "hadha-attendance-pro.firebaseapp.com",
  projectId: "hadha-attendance-pro",
  storageBucket: "hadha-attendance-pro.firebasestorage.app",
  messagingSenderId: "695092882560",
  appId: "1:695092882560:web:6d872cbaf2e299ec4e0a65",
  measurementId: "G-P3ZR844Q76"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
