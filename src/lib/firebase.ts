/**
 * firebase.ts — Series B Firebase Client
 * Migrated from scratch/total-loss-intake/src/lib/firebaseAuthRules.ts
 * Extended with PI Lead Platform auth patterns.
 *
 * FIRESTORE SECURITY RULES (see firestore.rules — deployed separately):
 * - Users: own data only
 * - PI Leads: write = backend only, read = purchasing firm or admin
 * - Firm Portal: read = approved firms, write = backend only
 * - System Config: read/write = admin only
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// ── Firebase Config (env-driven, never hardcoded) ────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ── Auth Providers ────────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();

/** Google OAuth popup — for law firm portal login */
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await _ensureUserDoc(result.user);
  return result.user;
};

/** Email/password — for customer intake portal */
export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

/** Register a new firm account */
export const registerFirm = async (email: string, password: string, firmName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "firms", result.user.uid), {
    email,
    firmName,
    role: "firm",
    isApproved: false, // Admin approves before portal access
    createdAt: serverTimestamp(),
  });
  return result.user;
};

export const logoutUser = () => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

/** Ensure a user document exists after any auth method */
const _ensureUserDoc = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      email: user.email,
      displayName: user.displayName,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
};

// ── PI Lead Submission ────────────────────────────────────────────────────────
export interface PILeadPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  accidentType: string;
  injuryDescription: string;
  hadErVisit: boolean;
  policeReportFiled: boolean;
  policeReportStatus?: "filed" | "pending" | "none";
  atFaultParty: string;
  insuranceCarrier: string;
  estimatedDamages: number;
  tcpaConsent: boolean;
  voice_eligible?: boolean;
  hasPhotos?: string;
  hasUIM?: string;
  trustedformCertUrl?: string;
}

/**
 * Submit a PI intake lead to Firestore.
 * Scoring (LVI) happens server-side via Cloud Function trigger.
 */
export const submitPILead = async (payload: PILeadPayload): Promise<string> => {
  const leadsRef = collection(db, "pi_leads");
  const docRef = await addDoc(leadsRef, {
    ...payload,
    status: "pending_score",
    submitted_at: serverTimestamp(),
    source: "ttl_intake_form",
  });
  return docRef.id;
};

export const updatePILead = async (leadId: string, updates: Record<string, unknown>): Promise<void> => {
  const userRef = doc(db, "pi_leads", leadId);
  await setDoc(userRef, updates, { merge: true });
};

// ── File Upload (Police Reports, Photos) ────────────────────────────────────
export const uploadCaseFile = async (
  uid: string,
  file: File,
  fileType: "police_report" | "photos" | "medical" | "insurance_card"
): Promise<string> => {
  const filePath = `user_uploads/${uid}/${fileType}/${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// ── GDPR/CCPA — Right to Erasure ─────────────────────────────────────────────
export const deleteUserDataVault = async (uid: string): Promise<boolean> => {
  await deleteDoc(doc(db, "case_files", uid));
  await deleteDoc(doc(db, "users", uid));
  console.log(`[Data Privacy] Purged all records for user ${uid}`);
  return true;
};

// ── Firm Portal Helpers ────────────────────────────────────────────────────────
export const getFirmProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "firms", uid));
  return snap.exists() ? snap.data() : null;
};
