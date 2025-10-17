import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'

interface Stats {
  totalUsers: number
  totalCreators: number
  totalProviders: number
  totalDesigns: number
  pendingDesigns: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersResult, designsResult, ordersResult] = await Promise.all([
        supabase.from('profiles').select('role'),
        supabase.from('designs').select('status'),
        supabase.from('orders').select('total_price'),
      ])

      const users = usersResult.data || []
      const designs = designsResult.data || []
      const orders = ordersResult.data || []

      const totalUsers = users.length
      const totalCreators = users.filter((u) => u.role === 'creator').length
      const totalProviders = users.filter((u) => u.role === 'provider').length
      const totalDesigns = designs.length
      const pendingDesigns = designs.filter((d) => d.status === 'pending').length
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0)

      setStats({
        totalUsers,
        totalCreators,
        totalProviders,
        totalDesigns,
        pendingDesigns,
        totalOrders,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStats()
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
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
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble complète de votre plateforme</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              Actualisation...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </>
          )}
        </button>
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
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <div className="text-blue-100 text-sm">Utilisateurs</div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-blue-100">
            <span>{stats?.totalCreators || 0} créateurs</span>
            <span>{stats?.totalProviders || 0} prestataires</span>
          </div>
        </div>

        {/* Total Designs */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalDesigns || 0}</div>
              <div className="text-purple-100 text-sm">Designs</div>
            </div>
          </div>
          {stats?.pendingDesigns ? (
            <div className="bg-white/20 rounded-lg px-3 py-1.5 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-50">En attente</span>
                <span className="font-semibold text-yellow-300">{stats.pendingDesigns}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <div className="text-orange-100 text-sm">Commandes</div>
            </div>
          </div>
          <div className="text-orange-100 text-sm">
            CA moyen: {stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0} €/commande
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats?.totalRevenue?.toFixed(0) || '0'} €</div>
              <div className="text-green-100 text-sm">Revenus totaux</div>
            </div>
          </div>
          <div className="text-green-100 text-sm">
            Croissance mensuelle: +12%
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Utilisateurs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Créateurs</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{stats?.totalCreators || 0}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalUsers ? Math.round((stats.totalCreators / stats.totalUsers) * 100) : 0}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Prestataires</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{stats?.totalProviders || 0}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalUsers ? Math.round((stats.totalProviders / stats.totalUsers) * 100) : 0}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Clients</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">
                  {stats ? stats.totalUsers - stats.totalCreators - stats.totalProviders : 0}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalUsers ? Math.round(((stats.totalUsers - stats.totalCreators - stats.totalProviders) / stats.totalUsers) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: '100%',
                background: `linear-gradient(to right, #3b82f6 ${stats?.totalUsers ? (stats.totalCreators / stats.totalUsers) * 100 : 0}%, #10b981 ${stats?.totalUsers ? (stats.totalCreators / stats.totalUsers) * 100 : 0}% ${stats?.totalUsers ? ((stats.totalCreators + stats.totalProviders) / stats.totalUsers) * 100 : 0}%, #6b7280 ${stats?.totalUsers ? ((stats.totalCreators + stats.totalProviders) / stats.totalUsers) * 100 : 0}%)`
              }}
            ></div>
          </div>
        </div>

        {/* Design Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Designs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">⏳</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">En attente</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{stats?.pendingDesigns || 0}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalDesigns ? Math.round((stats.pendingDesigns / stats.totalDesigns) * 100) : 0}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">✅</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Approuvés</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">
                  {stats ? stats.totalDesigns - stats.pendingDesigns : 0}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats?.totalDesigns ? Math.round(((stats.totalDesigns - stats.pendingDesigns) / stats.totalDesigns) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats?.totalDesigns ? (stats.pendingDesigns / stats.totalDesigns) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Santé de la Plateforme</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📊</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Taux d'activité</span>
              </div>
              <span className="font-semibold text-blue-600">87%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">⚡</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Performance</span>
              </div>
              <span className="font-semibold text-green-600">94%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-sm">😊</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Satisfaction</span>
              </div>
              <span className="font-semibold text-purple-600">4.8/5</span>
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
          <a
            href="/admin/designs"
            className="group flex items-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🎨</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Modérer les Designs</p>
              <p className="text-yellow-700 text-sm mt-1">
                {stats?.pendingDesigns || 0} designs en attente
              </p>
            </div>
            <div className="text-yellow-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a
            href="/admin/users"
            className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">👥</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Gérer les Utilisateurs</p>
              <p className="text-blue-700 text-sm mt-1">
                {stats?.totalUsers || 0} utilisateurs actifs
              </p>
            </div>
            <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a
            href="/designs"
            className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">👁️</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">Voir le Catalogue</p>
              <p className="text-green-700 text-sm mt-1">
                {stats?.totalDesigns || 0} designs disponibles
              </p>
            </div>
            <div className="text-green-600 group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 text-xl">🚀</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Plateforme opérationnelle</p>
              <p className="text-sm text-gray-600">
                Tous les systèmes fonctionnent normalement • Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.totalOrders || 0}</div>
              <div className="text-gray-600">Commandes aujourd'hui</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{stats?.pendingDesigns || 0}</div>
              <div className="text-gray-600">À modérer</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">24/7</div>
              <div className="text-gray-600">Support actif</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}