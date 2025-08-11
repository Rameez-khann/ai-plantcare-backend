// src/core/firebase/firebase-admin.ts

import dotenv from 'dotenv';
import admin from 'firebase-admin';
dotenv.config();


const firebaseConfig = {
  apiKey: "AIzaSyBFGPy0ceMCc9GHufcUk-Fz67oA4vGvKxc",
  authDomain: "ai-indoor-plantcare.firebaseapp.com",
  databaseURL: "https://ai-indoor-plantcare-default-rtdb.firebaseio.com",
  projectId: "ai-indoor-plantcare",
  storageBucket: "ai-indoor-plantcare.firebasestorage.app",
  messagingSenderId: "431280431415",
  appId: "1:431280431415:web:faf1f97357bd3ee0a0bab2",
  measurementId: "G-SVZ6ZX34H7"
};

const serviceAccount = {
  type: "service_account",
  project_id: "ai-indoor-plantcare",
  private_key_id: "f9256f6e82932fc21db5a7e98f69d17cdfb933cf",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2ZdfPT0h5uXrO\n3iIbBc1eHso6UqiOIqfMtZRU7ZoakGLcMXvsin4XAMkdyBeqGNJVNbA0/Lc4cSu9\ni/S05TXJs7IDB7JEOMF3mVEQ10py2Hu6OG3F6eEHc+NZrS/MqlF9ZvNdLXueoTit\ngxfwqjI3u04FRTu8ZxAbFxKaaSUfKQy/N/JOX2qziwAT7akuhzCiLYUV2bn0XR1T\nwVmf1hynZq/Sbk/hVbqCkxD9/XlcYoNFfKyWHC/iGcA5jUcIPgtNURLJYesJZDtN\nARpQtC2+JNRmpmYcOCdO3MP45GcG7ssH5pzday++benJPi38Oly0se0OA8ByKahb\nwDI8OHxHAgMBAAECggEACBuTJ2lwS3eLCyAE/GuFG05wvH1JIHb6O4IaHlj+H85+\n6SfKnj3yaJEF35eHNG3sXOeei18XwTVdSuHU66eWp6kfsWfJrPj9jJSZmGSMMCUJ\nrEJENZHLCXBFe7UplJuWNLtQomSFBAz0PoOUcFkNvhF1izbDzCuj+SL3ljqJ8Q5o\nU6Uy0P6plhcHUHO46Q2AB6TH7BTynJG1wYiO2szS8kIZ6UtF7pPyjehSqLkYip0k\n/eNI1dxA2V0ayHMIjCNlMrQRGNJ45J0cc9M4CEL5+aLNvpAOFUm2UvgfXYuKHKIz\ngM0/sPvrj+nJgHdKiQ1naMWBUPynqy5Y9djFDHKb2QKBgQDldrg45Iuf1wPYnfpn\nrwOD5VqGK5fCIJL86Z+RFitqcwsMqlgrGF2aRK8FGBpsOXOC/NqL/m+2XiXSJ81p\n54hhe6hi6+tidLBq1EIX7aYBP0Ux30LOFPT1SDcqEmUP6lLdc2Ou5RqdkqMxXPgZ\nrxgvDzE0TBhOnPGTunEvDxoUzwKBgQDLfbxGWdXos+dyQqQ8wgQGvXw56Du5+aLg\nK3o6A5DLcn9UadicKgozyt7qGvTwuBpYLCMNaG6ex5QDm+w2bMWoHIG7KsJhs9M5\nebodiughsQbaZqhq/ZlvzVdYwRW6Tz4bgps6ZwPhM6BMSGisYtCtBfSJJMEiBpq9\nP6++qDhvCQKBgAW16anIzkzBDiBy9gtkiKLcr18NcK5tHxtaORVkRtpUWJ8NEjqo\nVZQER5LJ4cZ1u5Ez98BqKZ+RQkGzqeIL2BINAMjNdEM0Ajv2Ylq0GGCJkZBHLSNx\n1BLSpETQxmEaBMvsFjwBCaOIRbVxyd7hw6lQKHpTtnsmXsC9cBmqt4xzAoGAXivF\nCqWeab9/94/Bo+CBroDYUZAYu9s8NhPIz7pAsvY82NrXBIYsDIXxHVP2UMRSZMWg\nPx86Oj7QT89DxHgYDNGMdAq4xDBNKwcbS3qyLI1ZR49El6be8C+OIaPRo1PywRZz\nMdbko76Zi1PjJQvh2ICuBx28RzvZNoWXllsRKskCgYEAixVf5glZ5UZ9Pboge+oS\ngWHHD0aJumyX3ty5Wq1IlJ314PPk6LoZBdkjm0+gq1hMeCStDpqdnAh/IYwBM6ao\n+oiFyFWJ7r2oCMHkJmvyJ5EL5EGJSjI/FKhfjN7wDlu/2BWJ3z8cPikIf1gayzHA\nzo0f/4Dg3ymDpmsVnBs6Zbc=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@ai-indoor-plantcare.iam.gserviceaccount.com",
  client_id: "118318395423918412840",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ai-indoor-plantcare.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
}


// Initialize Firebase Admin SDK if not already initialized
const databaseURL = "https://ai-indoor-plantcare-default-rtdb.firebaseio.com/";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL,
    storageBucket: firebaseConfig.storageBucket,
  });
}


export { admin };
