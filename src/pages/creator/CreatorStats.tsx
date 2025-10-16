import { useEffect, useState } from 'react'
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
}

export default function CreatorStats() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

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

      setStats({
        totalDesigns,
        totalViews,
        totalFavorites,
        totalSales,
        totalRevenue,
        pendingDesigns,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Designs */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Designs Totaux</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalDesigns || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {stats?.pendingDesigns ? (
            <p className="text-sm text-yellow-600 mt-2">
              {stats.pendingDesigns} en attente d'approbation
            </p>
          ) : null}
        </div>

        {/* Total Views */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vues Totales</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalViews || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Favorites */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Favoris</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalFavorites || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ventes Totales</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalSales || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus Totaux</p>
              <p className="text-3xl font-bold text-primary-600">
                {stats?.totalRevenue?.toFixed(2) || '0.00'} €
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/creator/upload"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <svg
              className="w-8 h-8 text-primary-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Nouveau Design</p>
              <p className="text-sm text-gray-500">Télécharger un nouveau design</p>
            </div>
          </a>

          <a
            href="/creator/designs"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <svg
              className="w-8 h-8 text-primary-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Gérer Mes Designs</p>
              <p className="text-sm text-gray-500">Modifier ou supprimer</p>
            </div>
          </a>

          <a
            href="/profile"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <svg
              className="w-8 h-8 text-primary-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Mon Profil</p>
              <p className="text-sm text-gray-500">Modifier mes informations</p>
            </div>
          </a>
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          Conseils pour augmenter vos ventes
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Utilisez des tags pertinents pour améliorer la découvrabilité de vos designs
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Téléchargez des images haute résolution avec un fond transparent
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Rédigez des descriptions détaillées qui mettent en valeur votre design
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Suivez les tendances et créez des designs saisonniers
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
