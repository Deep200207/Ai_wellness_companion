
import {initializeApp} from "firebase/app"
import {getAuth,GoogleAuthProvider} from "firebase/auth"



const firebaseConfig = {
  apiKey: "AIzaSyCQadCcv-K3BGxlCbxWAB8jyPR4wAljX-0",
  authDomain: "loginpage-61e77.firebaseapp.com",
  projectId: "loginpage-61e77",
  storageBucket: "loginpage-61e77.firebasestorage.app",
  messagingSenderId: "513294218054",
  appId: "1:513294218054:web:96e55f3b814255b32b6b47",
  measurementId: "G-7ZPG78ZM6T"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();