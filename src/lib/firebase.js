import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBSvJxibqBYjvV_Srvv08xjERwcz7m3cXM",
  authDomain: "project3-2b5f4.firebaseapp.com",
  databaseURL: "https://project3-2b5f4-default-rtdb.firebaseio.com",
  projectId: "project3-2b5f4",
  storageBucket: "project3-2b5f4.firebasestorage.app",
  messagingSenderId: "801776107650",
  appId: "1:801776107650:web:98f47305624b2c2e59b49b",
  measurementId: "G-RRHLSTKLE8",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
