import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyCLZevY5lf3o6VnI4z7VHNynQ8GaNSVCCk",
  authDomain: "book-santa101.firebaseapp.com",
  databaseURL: "https://book-santa101-default-rtdb.firebaseio.com",
  projectId: "book-santa101",
  storageBucket: "book-santa101.appspot.com",
  messagingSenderId: "282138140799",
  appId: "1:282138140799:web:7978f02664476992ce5f4a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
