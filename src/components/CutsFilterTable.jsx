export const CutsFilterTable = ({ cuts, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-600">Cargando cortes...</p>
      </div>
    )
  }

  if (cuts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-600">No hay cortes para mostrar</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Barbero</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Monto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Método</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {cuts.map((cut, index) => (
              <tr key={cut._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {cut.barberId?.name || "N/A"} {cut.barberId?.lastName || ""}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {cut.clientName} {cut.clientLastName}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[#d4a574]">${cut.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                    {cut.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(cut.createdAt).toLocaleDateString("es-ES")}
                  <br />
                  <span className="text-xs">
                    {new Date(cut.createdAt).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{cut.observations || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
