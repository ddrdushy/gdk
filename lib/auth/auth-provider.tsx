"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getDb } from "@/lib/firebase/client";
import type { UserProfile, UserRole } from "@/lib/schemas/user";

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (params: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: UserRole, extras?: { organisationName?: string }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: FirebaseUser) => {
    const db = getDb();
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setProfile(snap.data() as UserProfile);
    } else {
      const initial: UserProfile = {
        uid: u.uid,
        email: u.email ?? "",
        displayName: u.displayName,
        photoURL: u.photoURL,
      };
      await setDoc(
        ref,
        {
          ...initial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setProfile(initial);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await loadProfile(u);
        } catch (err) {
          console.error("failed to load profile", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [loadProfile]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }, []);

  const signUpWithEmail = useCallback(
    async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(getFirebaseAuth(), provider);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth());
  }, []);

  const setRole = useCallback(
    async (role: UserRole, extras?: { organisationName?: string }) => {
      // Read from Firebase Auth directly — React state may not have caught
      // up yet right after sign-up / sign-in (onAuthStateChanged is async).
      const fbUser = getFirebaseAuth().currentUser ?? user;
      if (!fbUser) throw new Error("not signed in");
      const db = getDb();
      const ref = doc(db, "users", fbUser.uid);
      await setDoc(
        ref,
        {
          uid: fbUser.uid,
          email: fbUser.email ?? "",
          displayName: fbUser.displayName,
          role,
          ...(extras?.organisationName ? { organisationName: extras.organisationName } : {}),
          onboardedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setProfile((p) =>
        p
          ? { ...p, role, ...(extras ?? {}) }
          : {
              uid: fbUser.uid,
              email: fbUser.email ?? "",
              displayName: fbUser.displayName,
              photoURL: fbUser.photoURL,
              role,
              ...(extras ?? {}),
            }
      );
    },
    [user]
  );

  const refreshProfile = useCallback(async () => {
    const fbUser = getFirebaseAuth().currentUser ?? user;
    if (fbUser) await loadProfile(fbUser);
  }, [user, loadProfile]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      setRole,
      refreshProfile,
    }),
    [user, profile, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, setRole, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
