import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'

interface Favorite {
  id: string
  created_at: string
  designs: {
    id: string
    title: string
    image_url: string
    price: number
    views: number
    favorites: number
    tags: string[]
  }
}

export default function Favorites() {
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          designs!inner(id, title, image_url, price, views, favorites, tags)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFavorites(data as any || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    setRemovingId(favoriteId)
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) throw error
      
      // Animation de suppression
      setTimeout(() => {
        setFavorites(favorites.filter(f => f.id !== favoriteId))
        setRemovingId(null)
      }, 300)
    } catch (error) {
      console.error('Error removing favorite:', error)
      setRemovingId(null)
    }
  }

  const removeAllFavorites = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) return
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user!.id)

      if (error) throw error
      setFavorites([])
    } catch (error) {
      console.error('Error removing all favorites:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-red-50/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Chargement de vos favoris...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-red-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header élégant */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">❤️</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Mes Favoris
          </h1>
          <p className="text-xl text-gray-600">
            Retrouvez tous vos designs coup de cœur en un seul endroit
          </p>
        </div>

        {/* Statistiques et actions */}
        {favorites.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                    {favorites.length}
                  </div>
                  <div className="text-sm text-gray-600">Designs favoris</div>
                </div>
                <div className="h-12 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {favorites.reduce((acc, fav) => acc + fav.designs.favorites, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Favoris totaux</div>
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 flex gap-4">
                <Link
                  to="/designs"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="mr-2">🎨</span>
                  Explorer plus
                </Link>
                <button
                  onClick={removeAllFavorites}
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="mr-2">🗑️</span>
                  Tout supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grille des favoris */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">❤️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Aucun favori pour le moment
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Commencez à collectionner vos designs préférés pour les retrouver facilement plus tard
              </p>
              <Link 
                to="/designs" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-3">✨</span>
                Découvrir le catalogue
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className={`group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/60 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                  removingId === favorite.id ? 'opacity-0 scale-95' : 'opacity-100'
                }`}
              >
                <Link to={`/designs/${favorite.designs.id}`}>
                  {/* Image avec overlay */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={favorite.designs.image_url}
                      alt={favorite.designs.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge favori */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-pink-600 border border-white/60">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-1"></span>
                        Favori
                      </span>
                    </div>

                    {/* Stats overlay */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between text-white text-sm">
                        <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span>👁️</span>
                          {favorite.designs.views}
                        </span>
                        <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span>❤️</span>
                          {favorite.designs.favorites}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200 text-lg">
                      {favorite.designs.title}
                    </h3>
                    
                    {/* Tags */}
                    {favorite.designs.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {favorite.designs.tags.slice(0, 2).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 px-2 py-1 rounded-lg font-medium border border-pink-200"
                          >
                            #{tag}
                          </span>
                        ))}
                        {favorite.designs.tags.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                            +{favorite.designs.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Prix et date */}
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="font-bold text-lg bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                          {favorite.designs.price.toFixed(2)} €
                        </div>
                        <div className="text-xs text-gray-500">
                          Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Bouton de suppression */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    removeFavorite(favorite.id)
                  }}
                  disabled={removingId === favorite.id}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  {removingId === favorite.id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Call-to-action pour les favoris vides */}
        {favorites.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-3xl p-8 border border-pink-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Continuez votre collection
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Découvrez de nouveaux designs et ajoutez-les à vos favoris pour créer votre collection personnalisée
              </p>
              <Link
                to="/designs"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">🌟</span>
                Explorer les nouveautés
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}