import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'

interface Design {
  id: string
  title: string
  description: string
  image_url: string
  thumbnail_url: string
  price: number
  status: string
  created_at: string
  profiles: {
    email: string
    full_name?: string
  }
}

export default function AdminDesigns() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    fetchDesigns()
  }, [filter])

  const fetchDesigns = async () => {
    try {
      let query = supabase
        .from('designs')
        .select(`
          *,
          profiles:creator_id (email, full_name)
        `)
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

  const updateDesignStatus = async (designId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('designs')
        .update({ status: newStatus })
        .eq('id', designId)

      if (error) throw error

      setDesigns(
        designs.map((d) => (d.id === designId ? { ...d, status: newStatus } : d))
      )
    } catch (error) {
      console.error('Error updating design:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const deleteDesign = async (designId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce design ?')) {
      return
    }

    try {
      const { error } = await supabase.from('designs').delete().eq('id', designId)

      if (error) throw error

      setDesigns(designs.filter((d) => d.id !== designId))
      alert('Design supprimé avec succès')
    } catch (error) {
      console.error('Error deleting design:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    }

    const labels: Record<string, string> = {
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
    }

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
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
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'rejected'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rejetés
        </button>
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
      </div>

      {/* Designs List */}
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
        </div>
      ) : (
        <div className="space-y-4">
          {designs.map((design) => (
            <div key={design.id} className="card">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={design.thumbnail_url || design.image_url}
                    alt={design.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{design.title}</h3>
                      <p className="text-sm text-gray-600">
                        Par {design.profiles.full_name || design.profiles.email}
                      </p>
                    </div>
                    {getStatusBadge(design.status)}
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {design.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Prix:</span>
                      <p className="font-medium text-gray-900">
                        {design.price.toFixed(2)} €
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(design.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">ID:</span>
                      <p className="font-medium text-gray-900 text-xs">
                        {design.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {design.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateDesignStatus(design.id, 'approved')}
                          className="btn btn-primary text-sm"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => updateDesignStatus(design.id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {design.status === 'approved' && (
                      <button
                        onClick={() => updateDesignStatus(design.id, 'rejected')}
                        className="btn btn-secondary text-sm"
                      >
                        Rejeter
                      </button>
                    )}
                    {design.status === 'rejected' && (
                      <button
                        onClick={() => updateDesignStatus(design.id, 'approved')}
                        className="btn btn-primary text-sm"
                      >
                        Approuver
                      </button>
                    )}
                    <a
                      href={`/designs/${design.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary text-sm"
                    >
                      Voir
                    </a>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
