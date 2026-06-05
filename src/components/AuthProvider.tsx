'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { type User } from 'firebase/auth'
import { auth, isAdmin, onAuthChange } from '@/lib/auth'

interface AuthCtx {
  user: User | null
  loading: boolean
  admin: boolean
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, admin: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthChange(u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  return (
    <Ctx.Provider value={{ user, loading, admin: isAdmin(user) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  return useContext(Ctx)
}
