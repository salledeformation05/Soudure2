import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

interface Support {
  id: string
  name: string
  description: string
  base_price: number
  production_time_days: number
  available: boolean
  image_url?: string
}

export default function Supports() {
  const [supports, setSupports] = useState<Support[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupports()
  }, [])

  const fetchSupports = async () => {
    try {
      const { data, error } = await supabase
        .from('supports')
        .select('*')
        .eq('available', true)
        .order('base_price')

      if (error) throw error
      setSupports(data || [])
    } catch (error) {
      console.error('Error fetching supports:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nos Supports
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez notre sélection de supports pour personnaliser vos designs préférés
        </p>
      </div>

      {supports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun support disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supports.map((support) => (
            <div key={support.id} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {support.image_url ? (
                  <img
                    src={support.image_url}
                    alt={support.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {support.name}
              </h3>

              {support.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {support.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{support.production_time_days} jours</span>
                </div>
                <div className="text-lg font-semibold text-primary-600">
                  À partir de {support.base_price.toFixed(2)} €
                </div>
              </div>

              <Link
                to="/designs"
                className="btn btn-primary w-full"
              >
                Voir les designs
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 card bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Besoin d'aide pour choisir ?
        </h2>
        <p className="text-gray-700 mb-6">
          Notre équipe est disponible pour vous conseiller sur le support le plus adapté à vos besoins.
        </p>
        <Link to="/contact" className="btn btn-primary">
          Nous contacter
        </Link>
      </div>
    </div>
  )
}
