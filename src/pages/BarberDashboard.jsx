"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { CutForm } from "../components/CutForm"
import { CutsList } from "../components/CutsList"
import apiClient from "../api/apiClient"

export const BarberDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [cuts, setCuts] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetchCuts()
  }, [selectedDate, refreshTrigger])

  const fetchCuts = async () => {
    setLoading(true)
    try {
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)

      const response = await apiClient.get("/cuts", {
        params: {
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString(),
        },
      })
      setCuts(response.data)
    } catch (err) {
      console.error("Error al cargar cortes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCutAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const totalIncome = cuts.reduce((sum, cut) => sum + cut.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#1a1a1a] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Barbershop Manager</h1>
            <p className="text-sm text-gray-400">
              Bienvenido, {user?.name} {user?.lastName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#d4a574] hover:bg-[#c19a5e] text-black font-bold rounded transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#d4a574]">
            <p className="text-gray-600 text-sm font-semibold mb-2">CORTES DEL DÍA</p>
            <p className="text-3xl font-bold text-[#1a1a1a]">{cuts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#d4a574]">
            <p className="text-gray-600 text-sm font-semibold mb-2">INGRESOS HOY</p>
            <p className="text-3xl font-bold text-[#d4a574]">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#1a1a1a]">
            <p className="text-gray-600 text-sm font-semibold mb-2">PROMEDIO POR CORTE</p>
            <p className="text-3xl font-bold text-[#1a1a1a]">
              ${cuts.length > 0 ? (totalIncome / cuts.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <CutForm onCutAdded={handleCutAdded} />
          </div>

          {/* Cuts List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1a1a1a]">Historial de cortes</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4a574]"
                />
              </div>

              {loading ? <p className="text-center text-gray-600">Cargando cortes...</p> : <CutsList cuts={cuts} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
