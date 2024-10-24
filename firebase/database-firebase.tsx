// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getDatabase, onValue, ref, get } from "firebase/database";
import { use } from "react";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function fetchScenarios() {
    const scenariosRef = ref(db, 'scenarios');
    const snapshot = await get(scenariosRef);
    const data = snapshot.val();

    const scenarios = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
        }))
        : [];
        

    return scenarios;
}

export default fetchScenarios;