import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}))

export default useAuthStore
