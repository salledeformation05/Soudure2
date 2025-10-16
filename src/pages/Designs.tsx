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

  useEffect(() => {
    fetchDesigns()
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

  const filteredDesigns = designs.filter(design =>
    design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Découvrez nos Designs
        </h1>
        <p className="text-gray-600">
          Des milliers de designs uniques créés par des artistes talentueux
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              placeholder="Rechercher par titre, description ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Trier par
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus populaires</option>
              <option value="price">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Designs Grid */}
      {!loading && filteredDesigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <Link
              key={design.id}
              to={`/designs/${design.id}`}
              className="card hover:shadow-md transition-shadow duration-200 p-0 overflow-hidden group"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={design.thumbnail_url || design.image_url}
                  alt={design.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {design.title}
                </h3>
                {design.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {design.description}
                  </p>
                )}

                {/* Tags */}
                {design.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{design.views} vues</span>
                  <span className="font-semibold text-primary-600">
                    {design.price.toFixed(2)} €
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredDesigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun design trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSortBy('recent')
            }}
            className="btn btn-secondary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  )
}
