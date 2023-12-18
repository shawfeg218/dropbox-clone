import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVSh33uyVUy_D-WGELHl78HXDIRGgYGU4",
  authDomain: "dropbox-clone-3dc9a.firebaseapp.com",
  projectId: "dropbox-clone-3dc9a",
  storageBucket: "dropbox-clone-3dc9a.appspot.com",
  messagingSenderId: "220195106803",
  appId: "1:220195106803:web:8c4d19e20ce990f5d36c86",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
