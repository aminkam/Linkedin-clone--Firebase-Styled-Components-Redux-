import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3Wk1o1TkuuAoXMNG6pKxPOnOjX0pAdZE",
  authDomain: "linkedin-clone-bcb52.firebaseapp.com",
  projectId: "linkedin-clone-bcb52",
  storageBucket: "linkedin-clone-bcb52.appspot.com",
  messagingSenderId: "862993923252",
  appId: "1:862993923252:web:684fc80a51256061f92be1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
