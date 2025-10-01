import { create } from 'zustand'
import Cookies from 'js-cookie'

interface UserInfo {
  sub: string // email
  role: string[]
  iat: number
  exp: number
  iss: string
}

interface AuthStore {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  setAuthenticated: (value: boolean) => void
  setUserInfo: (userInfo: UserInfo | null) => void
  logout: () => void
}

// Helper function to decode JWT payload
const decodeJWTPayload = (token: string): UserInfo | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

// Helper function to get JWT from cookie
const getJWTFromCookie = (): string | null => {
  if (typeof window === 'undefined') return null
  
  // Try common JWT cookie names
  return Cookies.get('jwt') || Cookies.get('token') || Cookies.get('authToken') || null
}

const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  userInfo: null,
  setAuthenticated: (value: boolean) => {
    set({ isAuthenticated: value })
    
    // If authenticating, try to decode JWT and set user info
    if (value) {
      const token = getJWTFromCookie()
      if (token) {
        const userInfo = decodeJWTPayload(token)
        set({ userInfo })
      }
    } else {
      // Clear user info when not authenticated
      set({ userInfo: null })
    }
  },
  setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),
  logout: () => set({ isAuthenticated: false, userInfo: null }),
}))

export default useAuthStore
