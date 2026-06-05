import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Admin email(s) — set via env var or hardcode here
export const ADMIN_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? ''
).split(',').map(e => e.trim()).filter(Boolean)

export function isAdmin(user: User | null): boolean {
  if (!user) return false
  return ADMIN_EMAILS.includes(user.email ?? '')
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export async function loginAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logoutUser() {
  return signOut(auth)
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb)
}
