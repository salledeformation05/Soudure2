import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'

interface ReportData {
  totalUsers: number
  totalDesigns: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  activeProviders: number
  activeCreators: number
  revenueByMonth: Array<{ month: string; revenue: number }>
  topDesigns: Array<{
    id: string
    title: string
    sales: number
    revenue: number
  }>
  topCreators: Array<{
    id: string
    full_name: string
    designs_count: number
    total_sales: number
  }>
  topProviders: Array<{
    id: string
    business_name: string
    orders_count: number
    rating: number
  }>
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const { data: users } = await supabase.from('profiles').select('id, role')
      const { data: designs } = await supabase.from('designs').select('id, sales')
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, total_price, created_at, design_id, designs(title, creator_id), provider_id')

      const totalUsers = users?.length || 0
      const totalDesigns = designs?.length || 0
      const totalOrders = orders?.length || 0
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
      const completedOrders = orders?.filter(o => o.status === 'completed' || o.status === 'delivered').length || 0
      const activeProviders = users?.filter(u => u.role === 'provider').length || 0
      const activeCreators = users?.filter(u => u.role === 'creator').length || 0

      const revenueByMonth = calculateRevenueByMonth(orders || [])
      const topDesigns = calculateTopDesigns(orders || [])
      const topCreators = calculateTopCreators(orders || [])

      const { data: providers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'provider')

      const topProviders = await calculateTopProviders(providers || [], orders || [])

      setReportData({
        totalUsers,
        totalDesigns,
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        activeProviders,
        activeCreators,
        revenueByMonth,
        topDesigns,
        topCreators,
        topProviders,
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRevenueByMonth = (orders: any[]) => {
    const monthlyRevenue: Record<string, number> = {}

    orders.forEach(order => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (order.total_price || 0)
    })

    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }

  const calculateTopDesigns = (orders: any[]) => {
    const designStats: Record<string, { title: string; sales: number; revenue: number }> = {}

    orders.forEach(order => {
      if (order.design_id && order.designs) {
        const key = order.design_id
        if (!designStats[key]) {
          designStats[key] = {
            title: order.designs.title,
            sales: 0,
            revenue: 0,
          }
        }
        designStats[key].sales++
        designStats[key].revenue += order.total_price || 0
      }
    })

    return Object.entries(designStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  const calculateTopCreators = (orders: any[]) => {
    const creatorStats: Record<string, { full_name: string; designs_count: number; total_sales: number }> = {}

    orders.forEach(order => {
      if (order.designs?.creator_id) {
        const creatorId = order.designs.creator_id
        if (!creatorStats[creatorId]) {
          creatorStats[creatorId] = {
            full_name: 'Creator',
            designs_count: 0,
            total_sales: 0,
          }
        }
        creatorStats[creatorId].total_sales++
      }
    })

    return Object.entries(creatorStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.total_sales - a.total_sales)
      .slice(0, 5)
  }

  const calculateTopProviders = async (providers: any[], orders: any[]) => {
    const providerStats: Record<string, { business_name: string; orders_count: number; rating: number }> = {}

    orders.forEach(order => {
      if (order.provider_id) {
        const providerId = order.provider_id
        if (!providerStats[providerId]) {
          const provider = providers.find(p => p.id === providerId)
          providerStats[providerId] = {
            business_name: provider?.full_name || 'Provider',
            orders_count: 0,
            rating: 0,
          }
        }
        providerStats[providerId].orders_count++
      }
    })

    for (const providerId in providerStats) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', providerId)

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        providerStats[providerId].rating = avgRating
      }
    }

    return Object.entries(providerStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.orders_count - a.orders_count)
      .slice(0, 5)
  }

  const exportReport = async () => {
    if (!reportData) return
    
    setExporting(true)
    try {
      const csvContent = [
        ['Metric', 'Value'],
        ['Total Users', reportData.totalUsers],
        ['Total Designs', reportData.totalDesigns],
        ['Total Orders', reportData.totalOrders],
        ['Total Revenue', `${reportData.totalRevenue.toFixed(2)} €`],
        ['Pending Orders', reportData.pendingOrders],
        ['Completed Orders', reportData.completedOrders],
        ['Active Providers', reportData.activeProviders],
        ['Active Creators', reportData.activeCreators],
      ]
        .map(row => row.join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `alphacadeau-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setExporting(false)
    }
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }

  const getProgressPercentage = (current: number, total: number) => {
    return total > 0 ? (current / total) * 100 : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600">Les données de rapport n'ont pas pu être chargées.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Analytics</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble complète de votre plateforme</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-medium shadow-sm"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={exportReport} 
            disabled={exporting}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Export...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{reportData.totalUsers}</div>
              <div className="text-blue-100 text-sm">Utilisateurs</div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-blue-100">
            <span>{reportData.activeCreators} créateurs</span>
            <span>{reportData.activeProviders} prestataires</span>
          </div>
        </div>

        {/* Total Designs */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{reportData.totalDesigns}</div>
              <div className="text-green-100 text-sm">Designs</div>
            </div>
          </div>
          <div className="text-green-100 text-sm">
            {reportData.topDesigns.length} designs populaires
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{reportData.totalOrders}</div>
              <div className="text-orange-100 text-sm">Commandes</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-orange-100">
              <span>En attente: {reportData.pendingOrders}</span>
              <span>Terminées: {reportData.completedOrders}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${getProgressPercentage(reportData.completedOrders, reportData.totalOrders)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{reportData.totalRevenue.toFixed(0)} €</div>
              <div className="text-purple-100 text-sm">Revenus totaux</div>
            </div>
          </div>
          <div className="text-purple-100 text-sm">
            CA moyen: {(reportData.totalRevenue / Math.max(reportData.totalOrders, 1)).toFixed(0)} €/commande
          </div>
        </div>
      </div>

      {/* Charts and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Évolution des Revenus</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {dateRange === 'week' ? '7j' : dateRange === 'month' ? '30j' : '1an'}
            </span>
          </div>
          
          <div className="space-y-4">
            {reportData.revenueByMonth.map((item, index) => {
              const maxRevenue = Math.max(...reportData.revenueByMonth.map(r => r.revenue))
              const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
              
              return (
                <div key={item.month} className="flex items-center gap-4 group">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">{formatMonth(item.month)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 group-hover:from-purple-600 group-hover:to-purple-700"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="w-20 text-right">
                    <span className="text-sm font-bold text-gray-900">{item.revenue.toFixed(0)} €</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Designs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top 5 Designs</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              Par revenus
            </span>
          </div>
          
          <div className="space-y-4">
            {reportData.topDesigns.map((design, index) => (
              <div key={design.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{design.title}</p>
                  <p className="text-sm text-gray-600">{design.sales} ventes</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-primary-600 text-lg">{design.revenue.toFixed(0)} €</p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Creators */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top 5 Créateurs</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              Par ventes
            </span>
          </div>
          
          <div className="space-y-4">
            {reportData.topCreators.map((creator, index) => (
              <div key={creator.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                  <span className="text-white text-sm font-bold">#{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{creator.full_name}</p>
                  <p className="text-sm text-gray-600">{creator.designs_count} designs créés</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-lg">{creator.total_sales}</p>
                  <p className="text-xs text-gray-500">Ventes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top 5 Prestataires</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              Par commandes
            </span>
          </div>
          
          <div className="space-y-4">
            {reportData.topProviders.map((provider, index) => (
              <div key={provider.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
                  <span className="text-white text-sm font-bold">#{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{provider.business_name}</p>
                  <p className="text-sm text-gray-600">{provider.orders_count} commandes traitées</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-gray-900">{provider.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Note moyenne</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 text-xl">📈</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Performance globale</p>
              <p className="text-sm text-gray-600">
                Données mises à jour en temps réel • Période: {dateRange === 'week' ? '7 jours' : dateRange === 'month' ? '30 jours' : '1 an'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{reportData.totalOrders}</div>
              <div className="text-gray-600">Commandes totales</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{reportData.totalRevenue.toFixed(0)} €</div>
              <div className="text-gray-600">Chiffre d'affaires</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{reportData.activeCreators + reportData.activeProviders}</div>
              <div className="text-gray-600">Actifs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}