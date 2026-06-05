import {
  collection, addDoc, onSnapshot, query, orderBy,
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
  where, getDocs, deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Types ────────────────────────────────────────────────────
export interface RSVPEntry {
  id?: string
  name: string
  guests: number
  attending: boolean
  message?: string
  email?: string
  createdAt?: unknown
}

export interface WallMessage {
  id?: string
  author: string
  text: string
  approved: boolean
  createdAt?: unknown
}

export interface GiftClaim {
  giftId: string
  claimedBy: string
  claimedAt?: unknown
}

export interface TriviaResult {
  id?: string
  userId: string
  displayName: string
  score: number
  total: number
  answeredIndices: number[]
  answers: Record<number, number>
  completed: boolean
  cheer?: string
  noteSent?: boolean
  createdAt?: unknown
  updatedAt?: unknown
}

// ─── RSVP ────────────────────────────────────────────────────
export async function submitRSVP(data: Omit<RSVPEntry, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'rsvps'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function deleteRSVP(id: string) {
  return deleteDoc(doc(db, 'rsvps', id))
}

export async function getRSVPByEmail(email: string): Promise<RSVPEntry | null> {
  const q = query(collection(db, 'rsvps'), where('email', '==', email))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as RSVPEntry
}

export function subscribeRSVPs(cb: (entries: RSVPEntry[]) => void) {
  const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as RSVPEntry)))
  )
}

// ─── Wall Messages ────────────────────────────────────────────
export async function submitMessage(data: Omit<WallMessage, 'id' | 'createdAt' | 'approved'>) {
  return addDoc(collection(db, 'messages'), {
    ...data,
    approved: false,
    createdAt: serverTimestamp(),
  })
}

export function subscribeApprovedMessages(cb: (msgs: WallMessage[]) => void) {
  const q = query(
    collection(db, 'messages'),
    where('approved', '==', true),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as WallMessage)))
  )
}

export function subscribeAllMessages(cb: (msgs: WallMessage[]) => void) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as WallMessage)))
  )
}

export async function approveMessage(id: string) {
  return updateDoc(doc(db, 'messages', id), { approved: true })
}

export async function rejectMessage(id: string) {
  return updateDoc(doc(db, 'messages', id), { approved: false })
}

// ─── Gifts ────────────────────────────────────────────────────
export async function claimGift(giftId: string, name: string) {
  return setDoc(doc(db, 'gifts', giftId), {
    giftId,
    claimedBy: name,
    claimedAt: serverTimestamp(),
  })
}

export async function releaseGift(giftId: string) {
  const ref = doc(db, 'gifts', giftId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    await updateDoc(ref, { claimedBy: '' })
  }
}

export function subscribeGifts(cb: (claims: Record<string, GiftClaim>) => void) {
  return onSnapshot(collection(db, 'gifts'), snap => {
    const map: Record<string, GiftClaim> = {}
    snap.docs.forEach(d => { map[d.id] = d.data() as GiftClaim })
    cb(map)
  })
}

// ─── Trivia ───────────────────────────────────────────────────
export async function getTriviaResult(uid: string): Promise<TriviaResult | null> {
  const snap = await getDoc(doc(db, 'trivia', uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as TriviaResult
}

export async function saveTriviaProgress(uid: string, data: Omit<TriviaResult, 'id' | 'createdAt'>) {
  const ref = doc(db, 'trivia', uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  }
  return setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export function subscribeLeaderboard(cb: (results: TriviaResult[]) => void) {
  // Single orderBy avoids needing a composite index in Firestore
  const q = query(collection(db, 'trivia'), orderBy('score', 'desc'))
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as TriviaResult)))
  })
}

export async function saveCheer(uid: string, cheer: string) {
  return updateDoc(doc(db, 'trivia', uid), { cheer })
}

export async function saveNoteSent(uid: string) {
  return updateDoc(doc(db, 'trivia', uid), { noteSent: true })
}
export async function voteDrink(drinkId: string) {
  const ref = doc(db, 'drinks', drinkId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const current = (snap.data().votes as number) ?? 0
    return updateDoc(ref, { votes: current + 1 })
  }
  return setDoc(ref, { drinkId, votes: 1 })
}

export function subscribeDrinks(cb: (votes: Record<string, number>) => void) {
  return onSnapshot(collection(db, 'drinks'), snap => {
    const map: Record<string, number> = {}
    snap.docs.forEach(d => { map[d.id] = (d.data().votes as number) ?? 0 })
    cb(map)
  })
}

// ─── Notas anónimas ───────────────────────────────────────────
export async function submitNote(text: string) {
  return addDoc(collection(db, 'notes'), {
    text,
    createdAt: serverTimestamp(),
  })
}
