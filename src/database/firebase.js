// src/firebase.js
import admin from "firebase-admin";
import { config } from "dotenv";

config(); // load .env

// admin.initializeApp({
// 	credential: admin.credential.applicationDefault(),
// 	projectId: process.env.FIREBASE_PROJECT_ID,
// });
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

export default admin;

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;