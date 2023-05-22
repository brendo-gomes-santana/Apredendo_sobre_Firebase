import { initializeApp  } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDVR9TbD11d6i7KYCLRckzQYzZqb9k7yuM",
    authDomain: "cursoapp-920fd.firebaseapp.com",
    projectId: "cursoapp-920fd",
    storageBucket: "cursoapp-920fd.appspot.com",
    messagingSenderId: "1054852536143",
    appId: "1:1054852536143:web:60ee9d7b36143739f9173a",
    measurementId: "G-R1LGTPFVW6"
  };

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
export { db, auth }