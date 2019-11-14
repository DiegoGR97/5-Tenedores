import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBDoab1uPoSlCb58HAYxoXWG96_GJJP0Zg",
  authDomain: "tenedores-diegogr97.firebaseapp.com",
  databaseURL: "https://tenedores-diegogr97.firebaseio.com",
  projectId: "tenedores-diegogr97",
  storageBucket: "tenedores-diegogr97.appspot.com",
  messagingSenderId: "222067431108",
  appId: "1:222067431108:web:d585a0f76afc99a5af9b91"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
