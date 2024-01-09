
import {initializeApp} from "firebase/app"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRsqoC2P1xL5sazD4i1i8kLccqfvmUpJk",
    authDomain: "react-tm-todolist.firebaseapp.com",
    projectId: "react-tm-todolist",
    storageBucket: "react-tm-todolist.appspot.com",
    messagingSenderId: "156300356352",
    appId: "1:156300356352:web:30b8efd609b5ef17d2e1e5"
  };


  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 下記記入することでどこでも使用できるようになる
export default db;