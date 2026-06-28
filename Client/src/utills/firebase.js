
import { initializeApp } from "firebase/app";

import{ getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "kimra-ai.firebaseapp.com",
  projectId: "kimra-ai",
  storageBucket: "kimra-ai.firebasestorage.app",
  messagingSenderId: "583585295271",
  appId: "1:583585295271:web:f29d9c446b6cc279062482"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth ,provider}