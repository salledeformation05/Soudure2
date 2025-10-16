import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import type { Design } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function CreatorDesigns() {
  const { user } = useAuthStore()
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  useEffect(() => {
    fetchDesigns()
  }, [filter])

  const fetchDesigns = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('designs')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setDesigns(data || [])
    } catch (error) {
      console.error('Error fetching designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDesign = async (designId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce design ?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', designId)
        .eq('creator_id', user?.id)

      if (error) throw error

      setDesigns(designs.filter((d) => d.id !== designId))
      alert('Design supprimé avec succès')
    } catch (error) {
      console.error('Error deleting design:', error)
      alert('Erreur lors de la suppression du design')
    }
  }

  const toggleAvailability = async (designId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('designs')
        .update({ available: !currentStatus })
        .eq('id', designId)
        .eq('creator_id', user?.id)

      if (error) throw error

      setDesigns(
        designs.map((d) =>
          d.id === designId ? { ...d, available: !currentStatus } : d
        )
      )
    } catch (error) {
      console.error('Error updating design:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    }

    const labels = {
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
    }

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approuvés
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejetés
          </button>
        </div>

        <Link to="/creator/upload" className="btn btn-primary">
          + Nouveau Design
        </Link>
      </div>

      {/* Designs Grid */}
      {designs.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun design trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par télécharger votre premier design
          </p>
          <Link to="/creator/upload" className="btn btn-primary inline-block">
            Télécharger un design
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="card">
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={design.thumbnail_url || design.image_url}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(design.status)}
                </div>
                {!design.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Indisponible</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-gray-900 mb-2">{design.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {design.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-500">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{design.views}</p>
                  <p>Vues</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{design.favorites}</p>
                  <p>Favoris</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{design.sales}</p>
                  <p>Ventes</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-lg font-bold text-primary-600">
                  {design.price.toFixed(2)} €
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/designs/${design.id}`}
                  className="flex-1 btn btn-secondary text-sm"
                >
                  Voir
                </Link>
                <button
                  onClick={() => toggleAvailability(design.id, design.available)}
                  className="flex-1 btn btn-secondary text-sm"
                >
                  {design.available ? 'Masquer' : 'Afficher'}
                </button>
                <button
                  onClick={() => deleteDesign(design.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
