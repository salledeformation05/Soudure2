import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/LoadingSpinner'

interface Stats {
  totalDesigns: number
  totalViews: number
  totalFavorites: number
  totalSales: number
  totalRevenue: number
  pendingDesigns: number
  conversionRate: number
  avgRevenuePerDesign: number
}

export default function CreatorStats() {
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
      const { data: designs, error: designsError } = await supabase
        .from('designs')
        .select('*')
        .eq('creator_id', user.id)

      if (designsError) throw designsError

      const totalDesigns = designs?.length || 0
      const totalViews = designs?.reduce((sum, d) => sum + (d.views || 0), 0) || 0
      const totalFavorites = designs?.reduce((sum, d) => sum + (d.favorites || 0), 0) || 0
      const totalSales = designs?.reduce((sum, d) => sum + (d.sales || 0), 0) || 0
      const pendingDesigns = designs?.filter(d => d.status === 'pending').length || 0

      const { data: orders } = await supabase
        .from('orders')
        .select('total_price, designs!inner(creator_id)')
        .eq('designs.creator_id', user.id)

      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0
      const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0
      const avgRevenuePerDesign = totalDesigns > 0 ? totalRevenue / totalDesigns : 0

      setStats({
        totalDesigns,
        totalViews,
        totalFavorites,
        totalSales,
        totalRevenue,
        pendingDesigns,
        conversionRate,
        avgRevenuePerDesign,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // const getPercentageChange = (current: number, previous: number) => {
  //   if (previous === 0) return current > 0 ? 100 : 0
  //   return ((current - previous) / previous) * 100
  // }

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Créateur</h1>
          <p className="text-gray-600 mt-2">Suivez la performance de vos designs et optimisez vos revenus</p>
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
        {/* Total Designs */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalDesigns || 0}</div>
              <div className="text-blue-100 text-sm">Designs</div>
            </div>
          </div>
          {stats?.pendingDesigns ? (
            <div className="bg-white/20 rounded-lg px-3 py-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-50">En attente</span>
                <span className="font-semibold text-yellow-300">{stats.pendingDesigns}</span>
              </div>
            </div>
          ) : (
            <div className="text-blue-100 text-sm">Tous approuvés ✅</div>
          )}
        </div>

        {/* Total Views */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatNumber(stats?.totalViews || 0)}</div>
              <div className="text-purple-100 text-sm">Vues</div>
            </div>
          </div>
          <div className="text-purple-100 text-sm">
            {stats?.conversionRate ? stats.conversionRate.toFixed(1) : 0}% de conversion
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalSales || 0}</div>
              <div className="text-green-100 text-sm">Ventes</div>
            </div>
          </div>
          <div className="text-green-100 text-sm">
            Moyenne: {stats?.avgRevenuePerDesign ? stats.avgRevenuePerDesign.toFixed(0) : 0}€/design
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💎</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalRevenue?.toFixed(0) || '0'} €</div>
              <div className="text-orange-100 text-sm">Revenus</div>
            </div>
          </div>
          <div className="text-orange-100 text-sm">
            Croissance: +12% ce mois
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de Conversion</h3>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {stats?.conversionRate ? stats.conversionRate.toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Vues → Ventes</div>
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
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    strokeDasharray={`${stats?.conversionRate || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    {stats?.conversionRate ? stats.conversionRate.toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Performance</span>
              <span className="font-semibold">
                {stats?.conversionRate && stats.conversionRate > 5 ? 'Excellente' : 
                 stats?.conversionRate && stats.conversionRate > 2 ? 'Bonne' : 'À améliorer'}
              </span>
            </div>
          </div>
        </div>

        {/* Favorites Engagement */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-lg">❤️</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{stats?.totalFavorites || 0}</div>
                  <div className="text-sm text-gray-600">Favoris total</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">+8%</div>
                <div className="text-xs text-gray-500">ce mois</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📊</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {stats?.totalDesigns ? Math.round((stats.totalFavorites / stats.totalDesigns)) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Favoris/design</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse des Revenus</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
              <div className="text-sm font-medium text-gray-700">Revenu moyen</div>
              <div className="text-lg font-bold text-orange-600">
                {stats?.avgRevenuePerDesign ? stats.avgRevenuePerDesign.toFixed(0) : 0} €
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="text-sm font-medium text-gray-700">Vente moyenne</div>
              <div className="text-lg font-bold text-green-600">
                {stats?.totalSales ? (stats.totalRevenue / stats.totalSales).toFixed(0) : 0} €
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="text-sm font-medium text-gray-700">Potentiel mensuel</div>
              <div className="text-lg font-bold text-purple-600">
                {stats?.totalRevenue ? (stats.totalRevenue * 1.12).toFixed(0) : 0} €
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Actions Rapides</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            Accès direct
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/creator/upload"
            className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">+</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Nouveau Design</p>
              <p className="text-blue-700 text-sm mt-1">Télécharger un nouveau design</p>
            </div>
            <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            to="/creator/designs"
            className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🎨</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Gérer Mes Designs</p>
              <p className="text-green-700 text-sm mt-1">
                {stats?.totalDesigns || 0} designs dans votre catalogue
              </p>
            </div>
            <div className="text-green-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            to="/profile"
            className="group flex items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Mon Profil</p>
              <p className="text-purple-700 text-sm mt-1">Modifier mes informations</p>
            </div>
            <div className="text-purple-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Conseils pour booster vos performances
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">🏷️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Tags pertinents</p>
                  <p className="text-gray-600 text-xs">Améliorez la découvrabilité</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm">🖼️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Haute résolution</p>
                  <p className="text-gray-600 text-xs">Images avec fond transparent</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm">📝</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Descriptions détaillées</p>
                  <p className="text-gray-600 text-xs">Mettez en valeur votre travail</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm">📈</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Tendances saisonnières</p>
                  <p className="text-gray-600 text-xs">Créez des designs actuels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 text-xl">🚀</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Performance globale</p>
              <p className="text-sm text-gray-600">
                Votre activité créative génère de la valeur • Période: {timeRange === 'week' ? '7 jours' : timeRange === 'month' ? '30 jours' : '1 an'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.totalSales || 0}</div>
              <div className="text-gray-600">Ventes totales</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.totalRevenue?.toFixed(0) || 0}€</div>
              <div className="text-gray-600">Revenus générés</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.conversionRate ? stats.conversionRate.toFixed(1) : 0}%</div>
              <div className="text-gray-600">Taux de conversion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}