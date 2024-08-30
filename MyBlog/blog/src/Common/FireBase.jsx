

import {getAuth,GoogleAuthProvider} from 'firebase/auth'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCaHVNTHnEOfZkQ7z42uzUiEGtudHdlyu4",
  authDomain: "myblog-mern-stack-38f6a.firebaseapp.com",
  projectId: "myblog-mern-stack-38f6a",
  storageBucket: "myblog-mern-stack-38f6a.appspot.com",
  messagingSenderId: "141548665857",
  appId: "1:141548665857:web:cfe71bb11aeaf293815400",
  measurementId: "G-YDTTD2ZQJ2"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider();
export {auth,provider};