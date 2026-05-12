import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { pricingData as defaultPricingData, extraData as defaultExtraData } from '../data/pricingData';
import type { Category } from '../data/pricingData';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const DOC_REF = doc(db, 'tabela', 'pricing');

export interface AppData {
  categories: Category[];
  extraData: typeof defaultExtraData;
  updatedAt?: unknown;
  updatedBy?: string;
}

export async function loadFromFirestore(): Promise<AppData | null> {
  try {
    const snap = await getDoc(DOC_REF);
    if (snap.exists()) {
      return snap.data() as AppData;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveToFirestore(data: AppData): Promise<void> {
  await setDoc(DOC_REF, {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin',
  });
}

export { defaultPricingData, defaultExtraData };
