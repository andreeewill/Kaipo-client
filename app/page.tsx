'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import useAuthStore from '@/app/store/authStore'
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

export default function Page() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    // if (isAuthenticated) {
    //   router.push('/dashboard')
    // }
  }, [isAuthenticated, router])

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
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
              <Button
                onClick={handleLogin}
                size="lg"
              >
                Login to Dashboard
              </Button>
              <Button
                variant="ghost"
                asChild
              >
                <a href="/about">
                  Learn More <span aria-hidden="true">→</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
