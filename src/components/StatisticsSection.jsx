export const StatisticsSection = ({ stats }) => {
  const { todayStats, incomeByBarber } = stats

  return (
    <div className="mb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#d4a574]">
          <p className="text-gray-600 text-sm font-semibold mb-2">INGRESOS DEL DÍA</p>
          <p className="text-3xl font-bold text-[#d4a574]">${todayStats.totalIncome?.toFixed(2) || "0.00"}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#1a1a1a]">
          <p className="text-gray-600 text-sm font-semibold mb-2">CORTES DEL DÍA</p>
          <p className="text-3xl font-bold text-[#1a1a1a]">{todayStats.totalCuts || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#2d2d2d]">
          <p className="text-gray-600 text-sm font-semibold mb-2">PROMEDIO POR CORTE</p>
          <p className="text-3xl font-bold text-[#2d2d2d]">
            ${todayStats.totalCuts > 0 ? (todayStats.totalIncome / todayStats.totalCuts).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Barber Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Desempeño de barberos (Hoy)</h2>

        {incomeByBarber.length > 0 ? (
          <div className="space-y-3">
            {incomeByBarber.map((barber) => (
              <div key={barber.barberId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">{barber.barberName}</p>
                    <p className="text-sm text-gray-600">{barber.cuts} cortes realizados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#d4a574]">${barber.totalIncome.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${(barber.totalIncome / barber.cuts).toFixed(2)} promedio</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No hay datos disponibles</p>
        )}
      </div>
    </div>
  )
}
