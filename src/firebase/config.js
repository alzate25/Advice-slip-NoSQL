// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDjHsqxVQpK3hFpczSADQAwJShRju14lHI",
  authDomain: "advice-slip.firebaseapp.com",
  projectId: "advice-slip",
  storageBucket: "advice-slip.appspot.com",
  messagingSenderId: "1031480682851",
  appId: "1:1031480682851:web:2b4467013a349147494b56",
  measurementId: "G-1M6JM56HDK"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };