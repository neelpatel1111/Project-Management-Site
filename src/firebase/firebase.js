import firebase from 'firebase/compat/app'
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCRFWjlh7bkLsVqwPhqtFrU8t-PYscV_FA",
  authDomain: "project-management-112ff.firebaseapp.com",
  projectId: "project-management-112ff",
  storageBucket: "project-management-112ff.appspot.com",
  messagingSenderId: "703097861566",
  appId: "1:703097861566:web:93e681b6a3a0f283fb35ef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
export const db = firebase.firestore();
// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage();
export default auth;
