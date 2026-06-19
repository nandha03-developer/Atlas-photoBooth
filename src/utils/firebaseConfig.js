// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiFERDhdCvrJgfoy1MhN3qltmC6MlL3Bk",
  authDomain: "atlasfotoboothbackend.firebaseapp.com",
  projectId: "atlasfotoboothbackend",
  storageBucket: "atlasfotoboothbackend.appspot.com",
  messagingSenderId: "329083212122",
  appId: "1:329083212122:web:a9f55e7eeb25a71f86a363",
  measurementId: "G-Q3Q08XJJKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
// const analytics = getAnalytics(app);
export default app;