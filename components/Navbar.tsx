import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/kaipo.png"
                alt="Kaipo Logo"
                width={40}
                height={30}
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-gray-900">Kaipo</span>
            </Link>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/clinics">Untuk Pasien</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Untuk Klinik</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
