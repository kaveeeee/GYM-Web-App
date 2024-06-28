import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCGsPcbzvbs5Jcrjdin-BQ3yq51FzCMw3s",
  authDomain: "paftest-a611e.firebaseapp.com",
  projectId: "paftest-a611e",
  storageBucket: "paftest-a611e.appspot.com",
  messagingSenderId: "964048300928",
  appId: "1:964048300928:web:75f17515e447a11870ef65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
