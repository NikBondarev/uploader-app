import {initializeApp} from 'firebase/app';
import { getStorage } from "firebase/storage";
import { upload } from "./upload";




const firebaseConfig = {
    apiKey: "AIzaSyAm07VYniRpW8L1YXWhOwuZFG2yLM94jSY",
    authDomain: "uploader-app-nk.firebaseapp.com",
    projectId: "uploader-app-nk",
    storageBucket: "uploader-app-nk.appspot.com",
    messagingSenderId: "1063484589384",
    appId: "1:1063484589384:web:6b653818363b264f3adf7d"
  };
  
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);


upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif']
})