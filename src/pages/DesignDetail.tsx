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
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchDesignAndSupports()
      trackView()
      checkFavorite()
    }
  }, [id])

  const fetchDesignAndSupports = async () => {
    try {
      const { data: designData, error: designError } = await supabase
        .from('designs')
        .select('*')
        .eq('id', id)
        .single()

      if (designError) throw designError
      setDesign(designData)

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
        await supabase.from('favorites').insert({
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement du design...</p>
        </div>
      </div>
    )
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🎨</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Design non trouvé</h2>
          <p className="text-gray-600 mb-6">Le design que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link 
            to="/designs" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>←</span>
            <span className="ml-2">Retour aux designs</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb amélioré */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-3 text-sm">
            <li>
              <Link 
                to="/" 
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200 flex items-center"
              >
                <span className="w-5 h-5">🏠</span>
                <span className="ml-1">Accueil</span>
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li>
              <Link 
                to="/designs" 
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                Designs
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li className="text-primary-600 font-medium truncate max-w-xs">
              {design.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Section Image avec galerie */}
          <div className="space-y-6">
            {/* Image principale */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/60 p-6">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={design.image_url}
                  alt={design.title}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                />
                
                {/* Badge de statut */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Disponible
                  </span>
                </div>
                
                {/* Bouton favori flottant */}
                <button
                  onClick={toggleFavorite}
                  className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                    isFavorite
                      ? 'bg-red-500/90 text-white shadow-lg'
                      : 'bg-white/80 text-gray-400 hover:text-red-500 shadow-lg'
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
            </div>

            {/* Tags améliorés */}
            {design.tags.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-sm bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-4 py-2 rounded-full border border-primary-200 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section Détails */}
          <div className="space-y-6">
            {/* En-tête du produit */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {design.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                      À partir de {design.price.toFixed(2)} €
                    </p>
                    <span className="text-sm text-gray-500 line-through">
                      {(design.price * 1.2).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5">👁️</span>
                  <span>{design.views} vues</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5">❤️</span>
                  <span>{design.favorites} favoris</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5">🛒</span>
                  <span>{design.sales} ventes</span>
                </div>
              </div>

              {/* Description */}
              {design.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{design.description}</p>
                </div>
              )}
            </div>

            {/* Sélection du support */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6">📦</span>
                Choisissez votre produit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {supports.map((support) => (
                  <button
                    key={support.id}
                    onClick={() => setSelectedSupport(support.id)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                      selectedSupport === support.id
                        ? 'border-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 shadow-lg'
                        : 'border-gray-200 hover:border-primary-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900 text-lg">{support.name}</div>
                      <div className="text-primary-600 font-bold text-lg">
                        +{support.base_price.toFixed(2)} €
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Livraison sous 2-3 jours
                    </div>
                  </button>
                ))}
              </div>

              {/* Bouton de commande */}
              <button
                onClick={handleOrder}
                disabled={!selectedSupport}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  <span>🛒</span>
                  <span>Commander maintenant</span>
                </span>
              </button>
            </div>

            {/* Info production locale */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏭</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    Production locale et responsable
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ce produit est fabriqué par un artisan local proche de votre adresse de livraison, 
                    garantissant une qualité exceptionnelle, un impact écologique réduit et une livraison rapide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Avis */}
        <div className="mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">⭐</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Avis clients
              </h2>
            </div>
            <ReviewsList designId={design.id} />
          </div>
        </div>
      </div>
    </div>
  )
}