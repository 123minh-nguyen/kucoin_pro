import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
var firebaseConfig = {
    apiKey: "AIzaSyCeluO6xq8CP_QnTxlZ2q1-s_71buFouPI",
    authDomain: "firkcreactnative.firebaseapp.com",
    databaseURL: "https://firkcreactnative-default-rtdb.firebaseio.com/",
    projectId: "firkcreactnative",
    storageBucket: "firkcreactnative.appspot.com",
    messagingSenderId: "714528678628",
    appId: "1:714528678628:web:25d8db891edf45db3e82f1",
    measurementId: "G-0Y97M55812"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firebaseApp = firebase;