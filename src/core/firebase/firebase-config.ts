// src/core/firebase/firebase-admin.ts

import dotenv from 'dotenv';
import admin from 'firebase-admin';
dotenv.config();

// Firebase Configuration 
const firebaseConfig = {
  apiKey: 'AIzaSyDfNRk2LqHdPmKXW3lYgnBBWvy0haPWQQk',
  authDomain: 'gaylord-spices-be80a.firebaseapp.com',
  projectId: 'gaylord-spices-be80a',
  storageBucket: 'gaylord-spices-be80a.firebasestorage.app',
  messagingSenderId: '1084612105810',
  appId: '1:1084612105810:web:0a4b3142d1bb51cfbcf18b',
  measurementId: 'G-06WC2EJLCG'
};

//  Firebase Service Account
const serviceAccount = {
  type: "service_account",
  project_id: "gaylord-spices-be80a",
  private_key_id: "162f61a94a40cae5f5e4a0e5eb5c06a23784ce1e",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpbAcrMV5lvD15\nLjt2XsXrM2lJpmL7Nio179owvW4luoC0IcwGu1qWWC6KQGZf3+V00qjN4fQgPeOm\nZuUol2GMmLZdum261XPkflVEn9nRdh8aTcGWboag/rLzdGsFsU8DlUN9tFFfLUor\nam6jf39D2ZyGz1irU6MBV00s9Jx+XT8njyhb69MIY2PshNKcfsXY6lCyFOPP3EHn\njueMr3hkxt2KAWGNLOktjTg2o06ba9iQU+UhN44oXKIqAdCCZX2gXkF+mAiDCz0e\nd4AvhrsnGlZ6i2QFm5+DCm5iO3XduPjxQL1dqFXy74Y9M1X1BCSikI+xyvMRS1B9\nki0KA55rAgMBAAECggEAI2zmvNXYVq57LiUIIvKjMNBxsgg8Byomvlt2RJ2/c90g\n/0lX14qCYRB0Ps1DesWevYQ07sPR35IBUXCPdyLcL2FZNJUAT8JFNuBhpPVFvuIT\nk9TxZyqaNPy832IW5LxT+LxTveuf3iZirVxWYRKOQlo0vA2MDVryKRwfk4hcVqGC\neMV+nHgTazS/3KhZBsqRagG/n55a+h/eY/BrPWT7kjsjk4hm2kiuHGEGIG0YJQjo\nGUvKOzQGqw0ox78ImdiM6uR8b23V8C9hi9KtoXYripxsqnidjgAairlWYSzEnLN8\nHacuwF7PT3rc0iWns0wFdl/es740UyjIQo6gD3AAEQKBgQDgFx086cbou/9n0Yia\nZAFq6x0JpKpTLnw/Zhe2gSgdd5vsXl8TmghIvDeojH03M5qXrQOXLmWoSBKUA7JB\ne/5J94Vu6H3oGgEgtGrKiPMKKJNZijV+fI0SyazJL9xK5PIomxalEWsEFf+KxMQT\nKVbC+R97etmW9uQCyPVUtLcD2wKBgQDBjA9n363JSuIx3N2k5ZlFSQBQBZ4Alo+4\nwVwBwbSHAEjAdKG/Bkp1XMXaz7QbFVaW0+dVWxXJ1X6jGQ9Q/IlbEaa0J+7ajQ0a\n405gGyvGuYmlHEAJ+KDXttr8Zq+msI178OMgT6XR5k/u+PGyb7IJoyPPugW2O+Dm\n6hJPrYocsQKBgQDc9G2T3j6OxK/1QhmbgfgT4HflRkPbeP5x1MyU240eYQ2RZwwA\nW+THMy7+NmhQwcUwwRvFOa5q24XWBD8Daqs1a6ZZ0Uw0S0/JW5vg0GA0KAYCR9Cv\nQ0gmukxwo4xnHI/ZkfImGKKYiMhLn/BlpGE0JkfwjRV3UUFJrbSZLQc3+QKBgAuM\nFac22yF1TEV5Tef2osxVbKVZkHGsieqV7q1UJzcetzh0POour+aMoGlLlw0+mqno\n/pZDFuuxxxpn9lf4mSFLzkxVTZTQcYW3Jgfp1xTGIQYux0tRABeemzYP0k75nZdV\nadeVqOj6+q3hQFpK+65Dg3FzQb/7lpFwSaNjUSghAoGAF8PkneUc/gE6wcK24YdR\nhtmk0V4ZIgtpf1xEFnjiO1nMNYQdv+NAIFGmKs0DuEViNjDId+GNKeaw7Uorr13F\nWkBZMdXYDq8lcw1R/qrLRzYnID/B5JV0afXab3lQUTOtI4tf6ADNw7ExtWa+l0oK\nsLXm21bI/O7sGcNicQ5lr+s=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@gaylord-spices-be80a.iam.gserviceaccount.com",
  client_id: "102740773330199241077",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40gaylord-spices-be80a.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
}

// Initialize Firebase Admin SDK if not already initialized
const databaseURL = 'https://gaylord-spices-be80a-default-rtdb.firebaseio.com/';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL,
    storageBucket: firebaseConfig.storageBucket,
  });
}


export { admin };
