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

  const exportReport = () => {
    if (!reportData) return

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
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  if (!reportData) {
    return <div>Aucune donnée disponible</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h2>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="input"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <button onClick={exportReport} className="btn btn-primary">
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90 mb-1">Utilisateurs Totaux</p>
          <p className="text-3xl font-bold">{reportData.totalUsers}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90 mb-1">Designs Totaux</p>
          <p className="text-3xl font-bold">{reportData.totalDesigns}</p>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-sm opacity-90 mb-1">Commandes Totales</p>
          <p className="text-3xl font-bold">{reportData.totalOrders}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-sm opacity-90 mb-1">Revenus Totaux</p>
          <p className="text-3xl font-bold">{reportData.totalRevenue.toFixed(0)} €</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Designs
          </h3>
          <div className="space-y-3">
            {reportData.topDesigns.map((design, index) => (
              <div key={design.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{design.title}</p>
                    <p className="text-sm text-gray-600">{design.sales} ventes</p>
                  </div>
                </div>
                <span className="font-semibold text-primary-600">
                  {design.revenue.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Créateurs
          </h3>
          <div className="space-y-3">
            {reportData.topCreators.map((creator, index) => (
              <div key={creator.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{creator.full_name}</p>
                    <p className="text-sm text-gray-600">{creator.designs_count} designs</p>
                  </div>
                </div>
                <span className="font-semibold text-primary-600">
                  {creator.total_sales} ventes
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenus Mensuels
        </h3>
        <div className="space-y-2">
          {reportData.revenueByMonth.map((item) => (
            <div key={item.month} className="flex items-center justify-between">
              <span className="text-gray-700">{item.month}</span>
              <span className="font-semibold text-gray-900">
                {item.revenue.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 5 Prestataires
        </h3>
        <div className="space-y-3">
          {reportData.topProviders.map((provider, index) => (
            <div key={provider.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                <div>
                  <p className="font-medium text-gray-900">{provider.business_name}</p>
                  <p className="text-sm text-gray-600">{provider.orders_count} commandes</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
