'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import useAuthStore from '@/app/store/authStore'

export default function Page() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="bg-white h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <Image
            className="absolute -top-1.5 right-2.5"
            src="/kaipo.png"
            alt="kaipo-logo"
            width={200}
            height={150}
          />
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Welcome to Kaipo
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Your healthcare management platform. Please log in to access your dashboard and manage your medical records.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleLogin}
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Login to Dashboard
              </button>
              <a 
                href="/about" 
                className="text-sm/6 font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              >
                Learn More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
