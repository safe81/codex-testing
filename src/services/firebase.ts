import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

// Configuração Firebase alinhada com o projeto swingar-71111290-b34c7
const firebaseConfig = {
  apiKey: "AIzaSyBSosJnO-qnF08c3LobKNcvtcosd7-Xav8",
  authDomain: "swingar-71111290-b34c7.firebaseapp.com",
  projectId: "swingar-71111290-b34c7",
  storageBucket: "swingar-71111290-b34c7.firebasestorage.app", // Corrigido para o nome de bucket mais recente
  messagingSenderId: "358521707518",
  appId: "1:358521707518:web:250efc82ba3003bcc5feaf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (opcional)
let analytics: Analytics | null = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };
