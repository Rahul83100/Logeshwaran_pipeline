'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

export type AccessLevel = 'public' | 'private'

export interface UserData {
  uid: string
  email: string
  name: string
  role: 'admin' | 'user'
  access_level: AccessLevel
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Listen dynamically to user profile document so access_level immediately updates!
        const unsubscribeDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
             setUserData(docSnap.data() as UserData)
          } else {
             setUserData(null)
          }
           setLoading(false)
        })
        return () => unsubscribeDoc()
      } else {
        setUserData(null)
        setLoading(false)
      }
    })
    return () => unsubscribeAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
