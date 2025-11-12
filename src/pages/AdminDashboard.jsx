"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { StatisticsSection } from "../components/StatisticsSection"
import { CutsFilterTable } from "../components/CutsFilterTable"
import apiClient from "../api/apiClient"

export const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [cuts, setCuts] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    barberId: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  })
  const [barbers, setBarbers] = useState([])

  useEffect(() => {
    fetchBarbers()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchCuts()
  }, [filters])

  const fetchBarbers = async () => {
    try {
      const response = await apiClient.get("/barbers")
      setBarbers(response.data)
    } catch (err) {
      console.error("Error al cargar barberos:", err)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/stats")
      setStats(response.data)
    } catch (err) {
      console.error("Error al cargar estadísticas:", err)
    }
  }

  const fetchCuts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.barberId) params.barberId = filters.barberId
      if (filters.startDate) params.startDate = new Date(filters.startDate).toISOString()
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        params.endDate = endDate.toISOString()
      }

      const response = await apiClient.get("/cuts", { params })

      let filteredCuts = response.data
      if (filters.paymentMethod) {
        filteredCuts = filteredCuts.filter((cut) => cut.paymentMethod === filters.paymentMethod)
      }

      setCuts(filteredCuts)
    } catch (err) {
      console.error("Error al cargar cortes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleExport = () => {
    const csv = [
      ["Barbero", "Cliente", "Monto", "Método de pago", "Fecha", "Hora"],
      ...cuts.map((cut) => [
        `${cut.barberId?.name || "N/A"} ${cut.barberId?.lastName || ""}`,
        `${cut.clientName} ${cut.clientLastName}`,
        cut.amount,
        cut.paymentMethod,
        new Date(cut.createdAt).toLocaleDateString("es-ES"),
        new Date(cut.createdAt).toLocaleTimeString("es-ES"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cortes-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#1a1a1a] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Barbershop Admin</h1>
            <p className="text-sm text-gray-400">Panel de administrador</p>
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
        {/* Statistics Section */}
        {stats && <StatisticsSection stats={stats} />}

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Filtros</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Barbero</label>
              <select
                name="barberId"
                value={filters.barberId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#d4a574]"
              >
                <option value="">Todos los barberos</option>
                {barbers.map((barber) => (
                  <option key={barber._id} value={barber._id}>
                    {barber.name} {barber.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Método de pago</label>
              <select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#d4a574]"
              >
                <option value="">Todos los métodos</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Desde</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#d4a574]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Hasta</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#d4a574]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="w-full bg-[#d4a574] hover:bg-[#c19a5e] text-black font-bold py-2 rounded transition text-sm"
              >
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Cuts Table Section */}
        <CutsFilterTable cuts={cuts} loading={loading} />
      </div>
    </div>
  )
}
