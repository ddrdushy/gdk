const MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with that email already exists. Try logging in instead.",
  "auth/invalid-email": "That email doesn't look right.",
  "auth/weak-password": "Password is too weak — use at least 8 characters.",
  "auth/wrong-password": "Wrong password. Try again or reset it.",
  "auth/user-not-found": "No account with that email yet.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/popup-closed-by-user": "Sign-in cancelled.",
  "auth/popup-blocked": "Your browser blocked the Google popup. Allow popups for this site.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/operation-not-allowed": "This sign-in method isn't enabled for the project.",
  "auth/account-exists-with-different-credential":
    "Account exists with a different sign-in method. Try the other option.",
};

/** Turn a thrown Firebase auth error into a clean, user-facing string. */
export function friendlyAuthError(err: unknown, fallback = "Something went wrong"): string {
  if (!err) return fallback;
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = String((err as { code: unknown }).code);
    if (MESSAGES[code]) return MESSAGES[code];
  }
  const raw = err instanceof Error ? err.message : String(err);
  const codeMatch = raw.match(/auth\/[a-z-]+/);
  if (codeMatch && MESSAGES[codeMatch[0]]) return MESSAGES[codeMatch[0]];
  return raw.replace("Firebase: ", "").replace(/\s*\(auth\/[^)]+\)\.?$/, "") || fallback;
}
