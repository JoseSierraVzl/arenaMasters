import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCnAjdyLwvFYBoTFrMH7D3HOFTXb07oJ5M',
  authDomain: 'arenamasters-997d6.firebaseapp.com',
  projectId: 'arenamasters-997d6',
  storageBucket: 'arenamasters-997d6.firebasestorage.app',
  messagingSenderId: '512365415305',
  appId: '1:512365415305:web:53e4b61f21ad9be1542f58',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc }
