import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBgylw6jaha6Yv5wsgo-KkOyuKsXx3E2aI",
    authDomain: "cila-ecommerce.firebaseapp.com",
    projectId: "cila-ecommerce",
    storageBucket: "cila-ecommerce.appspot.com",
    messagingSenderId: "286916929301",
    appId: "1:286916929301:web:cbbdcd0429c95532226b1c"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export {auth}