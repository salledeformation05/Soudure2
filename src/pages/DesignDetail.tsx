import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { Design, Support } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ReviewsList from '../components/ReviewsList'

export default function DesignDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [design, setDesign] = useState<Design | null>(null)
  const [supports, setSupports] = useState<Support[]>([])
  const [selectedSupport, setSelectedSupport] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (id) {
      fetchDesignAndSupports()
      trackView()
      checkFavorite()
    }
  }, [id])

  const fetchDesignAndSupports = async () => {
    try {
      // Fetch design
      const { data: designData, error: designError } = await supabase
        .from('designs')
        .select('*')
        .eq('id', id)
        .single()

      if (designError) throw designError
      setDesign(designData)

      // Fetch available supports
      const { data: supportsData, error: supportsError } = await supabase
        .from('supports')
        .select('*')
        .eq('available', true)

      if (supportsError) throw supportsError
      setSupports(supportsData || [])
    } catch (error) {
      console.error('Error fetching design:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackView = async () => {
    if (!id) return

    try {
      await supabase.from('design_views').insert({
        design_id: id,
        user_id: user?.id || null,
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const checkFavorite = async () => {
    if (!user || !id) return

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('design_id', id)
        .maybeSingle()

      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('design_id', id)
        setIsFavorite(false)
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            design_id: id,
          })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleOrder = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!selectedSupport) {
      alert('Veuillez sélectionner un produit')
      return
    }

    navigate('/order/customize', {
      state: {
        designId: id,
        supportId: selectedSupport,
      },
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!design) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Design non trouvé</h2>
        <Link to="/designs" className="btn btn-primary">
          Retour aux designs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500">
          <li>
            <Link to="/" className="hover:text-primary-600">Accueil</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/designs" className="hover:text-primary-600">Designs</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{design.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={design.image_url}
              alt={design.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Tags */}
          {design.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {design.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="card mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {design.title}
                </h1>
                <p className="text-2xl font-semibold text-primary-600">
                  À partir de {design.price.toFixed(2)} €
                </p>
              </div>

              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-400 hover:text-red-600'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {design.description && (
              <p className="text-gray-700 mb-6">{design.description}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
              <span>{design.views} vues</span>
              <span>{design.favorites} favoris</span>
              <span>{design.sales} ventes</span>
            </div>

            {/* Support Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choisissez un produit
              </label>
              <div className="grid grid-cols-2 gap-3">
                {supports.map((support) => (
                  <button
                    key={support.id}
                    onClick={() => setSelectedSupport(support.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      selectedSupport === support.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{support.name}</div>
                    <div className="text-sm text-gray-500">
                      +{support.base_price.toFixed(2)} €
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleOrder}
              disabled={!selectedSupport}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commander maintenant
            </button>
          </div>

          {/* Additional Info */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              ✨ Production locale
            </h3>
            <p className="text-sm text-gray-700">
              Ce produit sera fabriqué par un prestataire local proche de votre
              adresse de livraison, garantissant qualité et rapidité.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Avis clients
        </h2>
        <ReviewsList designId={design.id} />
      </div>
    </div>
  )
}
