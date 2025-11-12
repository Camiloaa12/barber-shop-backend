"use client"
import { useNavigate } from "react-router-dom"

export const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#d4a574] mb-4">403</h1>
        <p className="text-2xl text-white mb-8">Acceso no autorizado</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-[#d4a574] hover:bg-[#c19a5e] text-black font-bold rounded-lg transition"
        >
          Volver a inicio
        </button>
      </div>
    </div>
  )
}
