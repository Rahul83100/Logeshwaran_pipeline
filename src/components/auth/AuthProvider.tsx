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
    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      // Cleanup previous doc listener if user changes/logs out
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = undefined;
      }

      if (currentUser) {
        // Listen dynamically to user profile document so access_level immediately updates!
        unsubscribeDoc = onSnapshot(doc(db, 'users', currentUser.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
               setUserData(docSnap.data() as UserData)
            } else {
               setUserData(null)
            }
            setLoading(false)
          },
          (error) => {
            console.error("Error fetching user profile:", error);
            setUserData(null);
            setLoading(false); // Make sure we don't get stuck loading on permission errors
          }
        )
      } else {
        setUserData(null)
        setLoading(false)
      }
    })
    
    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
