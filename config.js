import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyA_VsGsGRMcInG-wVtsvcDLjunEkZ_cnsY",
  authDomain: "test1-21ed7.firebaseapp.com",
  projectId: "test1-21ed7",
  storageBucket: "test1-21ed7.appspot.com",
  messagingSenderId: "1045621112707",
  appId: "1:1045621112707:web:07768a4e816d34d485c0b6",
  measurementId: "G-BNH4C0S2BR"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    
}