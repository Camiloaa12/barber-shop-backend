export const CutsList = ({ cuts }) => {
  if (cuts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No hay cortes registrados para este día</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {cuts.map((cut) => (
        <div key={cut._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-[#1a1a1a]">
                {cut.clientName} {cut.clientLastName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Método: <span className="font-semibold capitalize">{cut.paymentMethod}</span>
              </p>
              {cut.observations && <p className="text-sm text-gray-600 mt-1">Notas: {cut.observations}</p>}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#d4a574]">${cut.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(cut.createdAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
