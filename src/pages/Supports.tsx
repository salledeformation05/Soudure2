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
  category?: string
  features?: string[]
}

export default function Supports() {
  const [supports, setSupports] = useState<Support[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'name'>('price')

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

  const categories = ['all', ...Array.from(new Set(supports.map(s => s.category).filter(Boolean)))]

  const filteredAndSortedSupports = supports
    .filter(support => selectedCategory === 'all' || support.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.base_price - b.base_price
        case 'time':
          return a.production_time_days - b.production_time_days
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      textile: '👕',
      decoration: '🏠',
      accessoire: '👜',
      digital: '💻',
      papeterie: '📄'
    }
    return icons[category] || '📦'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Chargement des supports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">🎁</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Nos Supports de Création
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre collection exclusive de supports pour donner vie à vos designs. 
            Chaque produit est fabriqué avec soin par nos artisans partenaires.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">{supports.length}</div>
            <div className="text-sm text-gray-600">Supports disponibles</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.min(...supports.map(s => s.production_time_days))}
            </div>
            <div className="text-sm text-gray-600">Jours min. de production</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.max(...supports.map(s => s.production_time_days))}
            </div>
            <div className="text-sm text-gray-600">Jours max. de production</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.min(...supports.map(s => s.base_price))}€
            </div>
            <div className="text-sm text-gray-600">Prix à partir de</div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">📂</span>
                Catégories
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <span>{category === 'all' ? '📦' : getCategoryIcon(category)}</span>
                    {category === 'all' ? 'Tous' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">🔍</span>
                Trier par
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'price' as const, label: 'Prix', icon: '💰' },
                  { key: 'time' as const, label: 'Délai', icon: '⏱️' },
                  { key: 'name' as const, label: 'Nom', icon: '🔤' },
                ].map((sort) => (
                  <button
                    key={sort.key}
                    onClick={() => setSortBy(sort.key)}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      sortBy === sort.key
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <span>{sort.icon}</span>
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supports Grid */}
        {filteredAndSortedSupports.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Aucun support trouvé
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Aucun support ne correspond à vos critères de recherche.
                Essayez de modifier vos filtres ou contactez-nous pour une demande spéciale.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedSupports.map((support) => (
              <div 
                key={support.id} 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-105 group"
              >
                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {support.image_url ? (
                    <img
                      src={support.image_url}
                      alt={support.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl text-gray-400">📦</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {support.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                        <span>{getCategoryIcon(support.category)}</span>
                        {support.category}
                      </span>
                    </div>
                  )}

                  {/* Price Overlay */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg">
                      {support.base_price.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {support.name}
                  </h3>

                  {support.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {support.description}
                    </p>
                  )}

                  {/* Features */}
                  {support.features && support.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="w-4 h-4">✨</span>
                        Caractéristiques
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {support.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium border border-orange-200"
                          >
                            {feature}
                          </span>
                        ))}
                        {support.features.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            +{support.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5">⏱️</span>
                      <span>{support.production_time_days} jours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5">🏭</span>
                      <span>Production locale</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to="/designs"
                    className="w-full inline-flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-orange-600 to-amber-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group/btn"
                  >
                    <span className="group-hover/btn:scale-110 transition-transform">🎨</span>
                    <span>Explorer les designs</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Support personnalisé
              </h3>
              <p className="text-orange-100 text-lg mb-6 leading-relaxed">
                Vous avez un projet spécifique ou besoin de conseils pour choisir le support idéal ? 
                Notre équipe d'experts est là pour vous accompagner.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-orange-100">
                  <span className="w-6 h-6 mr-3">🎯</span>
                  <span>Conseils personnalisés gratuits</span>
                </div>
                <div className="flex items-center text-orange-100">
                  <span className="w-6 h-6 mr-3">⚡</span>
                  <span>Réponse sous 24h</span>
                </div>
                <div className="flex items-center text-orange-100">
                  <span className="w-6 h-6 mr-3">🏆</span>
                  <span>Expertise de nos artisans</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-12 flex flex-col justify-center">
              <div className="space-y-4">
                <Link 
                  to="/contact" 
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform">📞</span>
                  Nous contacter
                </Link>
                <a 
                  href="tel:+33123456789" 
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform">📱</span>
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}