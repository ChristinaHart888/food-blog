// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAauADtDXF36zBHQ9ZXyg39TB7gzIG-bfY",
    authDomain: "food-blog-5fe9c.firebaseapp.com",
    projectId: "food-blog-5fe9c",
    storageBucket: "food-blog-5fe9c.appspot.com",
    messagingSenderId: "949443167135",
    appId: "1:949443167135:web:8a84765ceadbf1fc2773aa",
    measurementId: "G-0KNVFTXWNP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const firestore = db;
export { storage };
