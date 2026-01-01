import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9Hpfz0iMOGeab2o0pnX-22sli30N7lzE",
  authDomain: "green-basket-74af8.firebaseapp.com",
  projectId: "green-basket-74af8",
  storageBucket: "green-basket-74af8.firebasestorage.app",
  messagingSenderId: "565092613896",
  appId: "1:565092613896:web:b1816bc89912d1c6c876bd",
  measurementId: "G-Y18D5P39SM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;