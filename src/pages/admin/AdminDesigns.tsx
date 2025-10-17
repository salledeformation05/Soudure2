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
  const [searchTerm, setSearchTerm] = useState('')

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
      approved: 'bg-green-100 text-green-800 border border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
    }

    const labels: Record<string, string> = {
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
    }

    const icons: Record<string, string> = {
      approved: '✅',
      pending: '⏳',
      rejected: '❌',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    )
  }

  const getStats = () => {
    const total = designs.length
    const pending = designs.filter(d => d.status === 'pending').length
    const approved = designs.filter(d => d.status === 'approved').length
    const rejected = designs.filter(d => d.status === 'rejected').length

    return { total, pending, approved, rejected }
  }

  const stats = getStats()

  const filteredDesigns = designs.filter(design =>
    design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.profiles.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Designs</h1>
          <p className="text-gray-600 mt-2">Modérez et gérez les designs soumis par les créateurs</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher un design..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold">Total Designs</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-semibold">En Attente</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold">Approuvés</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-semibold">Rejetés</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
            <p className="text-gray-600 text-sm mt-1">Filtrer les designs par statut</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'pending' as const, label: 'En attente', count: stats.pending },
              { key: 'approved' as const, label: 'Approuvés', count: stats.approved },
              { key: 'rejected' as const, label: 'Rejetés', count: stats.rejected },
              { key: 'all' as const, label: 'Tous les designs', count: stats.total }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === key 
                    ? 'bg-white/20 text-white/90' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Designs Grid */}
      {filteredDesigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Aucun design trouvé' : 'Aucun design en attente'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Aucun design ne correspond à votre recherche.'
                : 'Tous les designs ont été modérés pour le moment.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-primary"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow duration-300">
                  <img
                    src={design.thumbnail_url || design.image_url}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                        {design.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="font-medium">Par {design.profiles.full_name || design.profiles.email}</span>
                        <span>•</span>
                        <span>{new Date(design.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(design.status)}
                      <div className="text-2xl font-bold text-primary-600">
                        {design.price.toFixed(2)} €
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 line-clamp-2 leading-relaxed">
                    {design.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 font-medium mb-1">ID Design</div>
                      <div className="text-sm font-mono text-gray-900 font-semibold">
                        {design.id.slice(0, 8)}...
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 font-medium mb-1">Créateur</div>
                      <div className="text-sm text-gray-900 font-semibold truncate">
                        {design.profiles.full_name || 'Non renseigné'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 font-medium mb-1">Email</div>
                      <div className="text-sm text-gray-900 font-semibold truncate">
                        {design.profiles.email}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {design.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateDesignStatus(design.id, 'approved')}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-sm shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
                        >
                          <span>✅</span>
                          Approuver
                        </button>
                        <button
                          onClick={() => updateDesignStatus(design.id, 'rejected')}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold text-sm shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
                        >
                          <span>❌</span>
                          Rejeter
                        </button>
                      </>
                    )}
                    {design.status === 'approved' && (
                      <button
                        onClick={() => updateDesignStatus(design.id, 'rejected')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold text-sm shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
                      >
                        <span>❌</span>
                        Rejeter
                      </button>
                    )}
                    {design.status === 'rejected' && (
                      <button
                        onClick={() => updateDesignStatus(design.id, 'approved')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-sm shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
                      >
                        <span>✅</span>
                        Approuver
                      </button>
                    )}
                    
                    <a
                      href={`/designs/${design.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-sm shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300"
                    >
                      <span>👁️</span>
                      Voir le design
                    </a>
                    
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
                    >
                      <span>🗑️</span>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {filteredDesigns.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-primary-600 text-lg">💡</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Conseil de modération</p>
                <p className="text-sm text-gray-600">
                  Vérifiez la qualité et l'originalité des designs avant approbation
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Affichage de <span className="font-semibold text-gray-900">{filteredDesigns.length}</span> designs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}