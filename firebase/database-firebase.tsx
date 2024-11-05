// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import firebase from 'firebase/app'
import 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const fetchScenarios = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        return snapshot.val();  
    } else {
        console.log("No data available");
        return null;
    }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// async function fetchScenarios() {
//     const logsRef = ref(db, 'scenario');
//     const snapshot = await get(logsRef);
//     const data = snapshot.val();

//     const scenarios = data
//         ? Object.keys(data).map((key) => ({
//             id: key,
//             ...data[key],
//         }))
//         : [];
        

//     return scenarios;
// }

export default db;