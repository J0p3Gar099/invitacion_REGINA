import {
  collection, addDoc, onSnapshot, query, orderBy,
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
  where, getDocs
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Types ────────────────────────────────────────────────────
export interface RSVPEntry {
  id?: string
  name: string
  guests: number
  attending: boolean
  message?: string
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

export interface DrinkVote {
  drinkId: string
  voterName: string
  createdAt?: unknown
}

// ─── RSVP ────────────────────────────────────────────────────
export async function submitRSVP(data: Omit<RSVPEntry, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'rsvps'), {
    ...data,
    createdAt: serverTimestamp(),
  })
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
    approved: false, // requires moderation
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

// Admin: all messages
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

// ─── Drinks ───────────────────────────────────────────────────
export async function voteDrink(drinkId: string, voterName: string) {
  return addDoc(collection(db, 'drinks'), {
    drinkId,
    voterName,
    createdAt: serverTimestamp(),
  })
}

export function subscribeDrinks(cb: (votes: Record<string, number>) => void) {
  return onSnapshot(collection(db, 'drinks'), snap => {
    const counts: Record<string, number> = {}
    snap.docs.forEach(d => {
      const { drinkId } = d.data()
      counts[drinkId] = (counts[drinkId] ?? 0) + 1
    })
    cb(counts)
  })
}
