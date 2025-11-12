"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the login page
    router.push("/login")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Barbershop Manager</h1>
        <p className="text-gray-400">Redirigiendo...</p>
      </div>
    </div>
  )
}
