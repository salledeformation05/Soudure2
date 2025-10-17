import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Design } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Designs() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'price'>('recent')
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([])

  useEffect(() => {
    fetchDesigns()
    fetchCategories()
  }, [selectedCategory, sortBy])

  const fetchDesigns = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('designs')
        .select('*')
        .eq('status', 'approved')
        .eq('available', true)

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false })
          break
        case 'popular':
          query = query.order('views', { ascending: false })
          break
        case 'price':
          query = query.order('price', { ascending: true })
          break
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      setDesigns(data || [])
    } catch (error) {
      console.error('Error fetching designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        
      if (error) throw error
      
      // Simuler des comptes pour les catégories (à adapter selon votre structure)
      const categoriesWithCount = data?.map(cat => ({
        ...cat,
        count: Math.floor(Math.random() * 50) + 10
      })) || []
      
      setCategories([{ id: 'all', name: 'Tous les designs', count: designs.length }, ...categoriesWithCount])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filteredDesigns = designs.filter(design =>
    design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header élégant */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-xl mb-6">
            <span className="text-3xl text-white">🎨</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Galerie de Designs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez une collection exclusive de designs créatifs, 
            imaginés par des artistes talentueux du monde entier
          </p>
        </div>

        {/* Filtres et recherche avancée */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Barre de recherche */}
            <div className="lg:col-span-6">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">🔍</span>
                Rechercher un design
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Rechercher par titre, description, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="w-6 h-6">🎯</span>
                </div>
              </div>
            </div>

            {/* Catégories */}
            <div className="lg:col-span-4">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">📂</span>
                Catégories
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">📊</span>
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none"
              >
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="price">Prix croissant</option>
              </select>
            </div>
          </div>

          {/* Tags de recherche rapide */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-5 h-5">⚡</span>
              Recherche rapide
            </label>
            <div className="flex flex-wrap gap-2">
              {['Abstract', 'Minimaliste', 'Vintage', 'Moderne', 'Nature', 'Geometric'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200 text-sm font-medium text-gray-700"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-2xl font-bold">{designs.length}+</div>
            <div className="text-blue-100 text-sm">Designs disponibles</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-2xl font-bold">{categories.length}+</div>
            <div className="text-green-100 text-sm">Catégories</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-2xl font-bold">24h</div>
            <div className="text-purple-100 text-sm">Livraison express</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-orange-100 text-sm">Qualité garantie</div>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 font-medium">Chargement des designs...</p>
            </div>
          </div>
        )}

        {/* Grille de designs */}
        {!loading && filteredDesigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDesigns.map((design) => (
              <Link
                key={design.id}
                to={`/designs/${design.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/60 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                {/* Image avec overlay */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={design.thumbnail_url || design.image_url}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-900 border border-white/60">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Disponible
                    </span>
                  </div>
                  
                  {/* Bouton action rapide */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-colors duration-200">
                      <span className="w-5 h-5">❤️</span>
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200 text-lg">
                    {design.title}
                  </h3>
                  
                  {design.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
                      {design.description}
                    </p>
                  )}

                  {/* Tags */}
                  {design.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {design.tags.slice(0, 2).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-2 py-1 rounded-lg font-medium border border-primary-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {design.tags.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                          +{design.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats et prix */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4">👁️</span>
                        {design.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4">❤️</span>
                        {design.favorites}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        {design.price.toFixed(2)} €
                      </div>
                      <div className="text-xs text-gray-500">à partir de</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* État vide */}
        {!loading && filteredDesigns.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun design trouvé
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous n'avons trouvé aucun design correspondant à vos critères. 
                Essayez de modifier votre recherche ou explorez d'autres catégories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSortBy('recent')
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Call-to-action footer */}
        {!loading && filteredDesigns.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-3xl p-8 border border-primary-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Vous êtes créateur ?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Rejoignez notre communauté d'artistes et commencez à vendre vos designs dès aujourd'hui
              </p>
              <Link
                to="/become-creator"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">🚀</span>
                Devenir créateur
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}