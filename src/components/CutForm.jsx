"use client"

import { useState } from "react"
import apiClient from "../api/apiClient"

export const CutForm = ({ onCutAdded }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientLastName: "",
    amount: "",
    paymentMethod: "efectivo",
    observations: "",
    clientId: null,
  })
  const [clients, setClients] = useState([])
  const [showClientSearch, setShowClientSearch] = useState(true)
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if ((name === "clientName" || name === "clientLastName") && value.length > 0) {
      searchClients()
    }
  }

  const searchClients = async () => {
    try {
      const response = await apiClient.get("/clients", {
        params: {
          name: formData.clientName,
          lastName: formData.clientLastName,
        },
      })
      setClients(response.data)
    } catch (err) {
      console.error("Error al buscar clientes:", err)
    }
  }

  const handleSelectClient = (client) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client._id,
      clientName: client.name,
      clientLastName: client.lastName,
    }))
    setSelectedClient(client)
    setClients([])
    setShowClientSearch(false)
  }

  const handleCreateNewClient = async () => {
    try {
      const response = await apiClient.post("/clients", {
        name: formData.clientName,
        lastName: formData.clientLastName,
      })
      handleSelectClient(response.data)
    } catch (err) {
      setError("Error al crear cliente")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await apiClient.post("/cuts", {
        clientId: formData.clientId,
        clientName: formData.clientName,
        clientLastName: formData.clientLastName,
        amount: Number.parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        observations: formData.observations,
      })

      setSuccess("Corte registrado exitosamente")
      setFormData({
        clientName: "",
        clientLastName: "",
        amount: "",
        paymentMethod: "efectivo",
        observations: "",
        clientId: null,
      })
      setSelectedClient(null)
      setShowClientSearch(true)

      setTimeout(() => setSuccess(""), 3000)
      onCutAdded()
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar corte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Registrar corte</h2>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Cliente</label>

          {selectedClient ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
              <p className="text-[#1a1a1a]">
                {selectedClient.name} {selectedClient.lastName}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedClient(null)
                  setShowClientSearch(true)
                  setFormData((prev) => ({
                    ...prev,
                    clientId: null,
                    clientName: "",
                    clientLastName: "",
                  }))
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#d4a574]"
                />
                <input
                  type="text"
                  name="clientLastName"
                  value={formData.clientLastName}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#d4a574]"
                />
              </div>

              {clients.length > 0 && (
                <div className="border border-gray-300 rounded max-h-32 overflow-y-auto">
                  {clients.map((client) => (
                    <button
                      key={client._id}
                      type="button"
                      onClick={() => handleSelectClient(client)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 text-sm text-gray-700 border-b last:border-b-0"
                    >
                      {client.name} {client.lastName}
                    </button>
                  ))}
                </div>
              )}

              {formData.clientName && formData.clientLastName && clients.length === 0 && (
                <button
                  type="button"
                  onClick={handleCreateNewClient}
                  className="w-full px-3 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-100 font-semibold"
                >
                  Crear nuevo cliente
                </button>
              )}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Monto ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d4a574]"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Método de pago</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d4a574]"
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Observations */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Observaciones</label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleInputChange}
            placeholder="Notas del corte..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d4a574]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedClient}
          className="w-full bg-[#1a1a1a] hover:bg-[#2d2d2d] text-white font-bold py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrar corte"}
        </button>
      </form>
    </div>
  )
}
