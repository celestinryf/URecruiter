import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCQgsyho0NaghnIP4VXQDfRw3uDqBdAbJw",
  authDomain: "urecruiter-8139a.firebaseapp.com",
  projectId: "urecruiter-8139a",
  storageBucket: "urecruiter-8139a.firebasestorage.app",
  messagingSenderId: "671935404851",
  appId: "1:671935404851:web:8e8cbfce0e979dd9edfc46"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

