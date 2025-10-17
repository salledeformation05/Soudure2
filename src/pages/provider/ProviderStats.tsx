import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/LoadingSpinner'
import PaymentSection from '../../components/PaymentSection'

interface Stats {
  totalOrders: number
  pendingOrders: number
  inProductionOrders: number
  completedOrders: number
  totalRevenue: number
  averageRating: number
  monthlyGrowth: number
  completionRate: number
}

export default function ProviderStats() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    if (!user) return

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('provider_id', user.id)

      if (error) throw error

      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
      const inProductionOrders = orders?.filter(o => o.status === 'in_production').length || 0
      const completedOrders = orders?.filter(o => o.status === 'completed' || o.status === 'delivered').length || 0
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0

      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating, orders!inner(provider_id)')
        .eq('orders.provider_id', user.id)

      const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

      // Calcul des métriques avancées
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      const monthlyGrowth = 12.5 // Pour l'exemple, en réalité on calculerait vs période précédente

      setStats({
        totalOrders,
        pendingOrders,
        inProductionOrders,
        completedOrders,
        totalRevenue,
        averageRating,
        monthlyGrowth,
        completionRate,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceLevel = (rate: number) => {
    if (rate >= 90) return { level: 'Excellent', color: 'green' }
    if (rate >= 75) return { level: 'Bon', color: 'blue' }
    if (rate >= 60) return { level: 'Moyen', color: 'yellow' }
    return { level: 'À améliorer', color: 'red' }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const performanceLevel = getPerformanceLevel(stats?.completionRate || 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Prestataire</h1>
          <p className="text-gray-600 mt-2">Suivez vos performances et optimisez votre activité</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatNumber(stats?.totalOrders || 0)}</div>
              <div className="text-blue-100 text-sm">Commandes</div>
            </div>
          </div>
          <div className="text-blue-100 text-sm">
            <span className="text-green-300">↑ {stats?.monthlyGrowth}%</span> ce mois
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats ? stats.pendingOrders + stats.inProductionOrders : 0}</div>
              <div className="text-orange-100 text-sm">En cours</div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-orange-100">
            <span>{stats?.pendingOrders || 0} en attente</span>
            <span>{stats?.inProductionOrders || 0} en production</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatNumber(stats?.completedOrders || 0)}</div>
              <div className="text-green-100 text-sm">Terminées</div>
            </div>
          </div>
          <div className="text-green-100 text-sm">
            Taux: {stats?.completionRate ? stats.completionRate.toFixed(1) : 0}%
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalRevenue?.toFixed(0) || '0'} €</div>
              <div className="text-purple-100 text-sm">Revenus</div>
            </div>
          </div>
          <div className="text-purple-100 text-sm">
            Moyenne: {stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}€/commande
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating & Reviews */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Satisfaction Clients</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                <span className="text-gray-400 text-lg">/5</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(stats?.averageRating || 0)
                        ? 'text-yellow-400'
                        : i < (stats?.averageRating || 0)
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className={`text-sm font-semibold px-3 py-1.5 rounded-full text-center ${
            (stats?.averageRating || 0) >= 4.5 ? 'bg-green-100 text-green-800' :
            (stats?.averageRating || 0) >= 4.0 ? 'bg-blue-100 text-blue-800' :
            (stats?.averageRating || 0) >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {stats?.averageRating ? 
              stats.averageRating >= 4.5 ? 'Excellente' :
              stats.averageRating >= 4.0 ? 'Très bonne' :
              stats.averageRating >= 3.5 ? 'Bonne' : 'À améliorer'
              : 'Aucune note'
            }
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Taux d'Achèvement</h3>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.completionRate ? stats.completionRate.toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Commandes terminées</div>
            </div>
            <div className="w-20 h-20">
              <div className="relative w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${stats?.completionRate || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    {stats?.completionRate ? stats.completionRate.toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`text-sm font-semibold px-3 py-1.5 rounded-full text-center ${
            performanceLevel.color === 'green' ? 'bg-green-100 text-green-800' :
            performanceLevel.color === 'blue' ? 'bg-blue-100 text-blue-800' :
            performanceLevel.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            Performance: {performanceLevel.level}
          </div>
        </div>

        {/* Order Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Commandes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">En attente</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{stats?.pendingOrders || 0}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalOrders ? Math.round(((stats.pendingOrders || 0) / stats.totalOrders) * 100) : 0}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">En production</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{stats?.inProductionOrders || 0}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalOrders ? Math.round(((stats.inProductionOrders || 0) / stats.totalOrders) * 100) : 0}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Terminées</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{stats?.completedOrders || 0}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalOrders ? Math.round(((stats.completedOrders || 0) / stats.totalOrders) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                background: `linear-gradient(to right, #f59e0b ${stats?.totalOrders ? ((stats.pendingOrders || 0) / stats.totalOrders) * 100 : 0}%, #3b82f6 ${stats?.totalOrders ? ((stats.pendingOrders || 0) / stats.totalOrders) * 100 : 0}% ${stats?.totalOrders ? (((stats.pendingOrders || 0) + (stats.inProductionOrders || 0)) / stats.totalOrders) * 100 : 0}%, #10b981 ${stats?.totalOrders ? (((stats.pendingOrders || 0) + (stats.inProductionOrders || 0)) / stats.totalOrders) * 100 : 0}%)`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <PaymentSection
        totalAmount={stats?.totalRevenue || 0}
        paidAmount={(stats?.totalRevenue || 0) * 0.4}
        role="provider"
      />

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Actions Rapides</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            Accès direct
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/provider/orders"
            className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">📦</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Gérer les Commandes</p>
              <p className="text-blue-700 text-sm mt-1">
                {stats ? stats.pendingOrders + stats.inProductionOrders : 0} commande{stats && (stats.pendingOrders + stats.inProductionOrders) > 1 ? 's' : ''} en cours
              </p>
            </div>
            <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            to="/provider/profile"
            className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Mon Profil</p>
              <p className="text-green-700 text-sm mt-1">Modifier mes informations et capacités</p>
            </div>
            <div className="text-green-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🚀</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Performance globale</p>
              <p className="text-sm text-gray-600">
                Votre activité progresse régulièrement • Période: {timeRange === 'week' ? '7 jours' : timeRange === 'month' ? '30 jours' : '1 an'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.totalOrders || 0}</div>
              <div className="text-gray-600">Commandes totales</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.totalRevenue?.toFixed(0) || 0}€</div>
              <div className="text-gray-600">Revenus générés</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.completionRate ? stats.completionRate.toFixed(0) : 0}%</div>
              <div className="text-gray-600">Taux d'achèvement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}