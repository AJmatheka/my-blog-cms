import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCe8rUvh0-PoqEjPpDOhhZnmuPTogHChyk",
  authDomain: "my-blog-cms-f9dda.firebaseapp.com",
  projectId: "my-blog-cms-f9dda",
  storageBucket: "my-blog-cms-f9dda.appspot.com",
  messagingSenderId: "781554804978",
  appId: "1:781554804978:web:941ea1ed1ed256fc92c86b"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
