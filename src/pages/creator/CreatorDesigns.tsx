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
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingDesign, setUpdatingDesign] = useState<string | null>(null)

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
    } catch (error) {
      console.error('Error deleting design:', error)
      alert('Erreur lors de la suppression du design')
    }
  }

  const toggleAvailability = async (designId: string, currentStatus: boolean) => {
    setUpdatingDesign(designId)
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
    } finally {
      setUpdatingDesign(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800 border border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
    }

    const labels = {
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
    }

    const icons = {
      approved: '✅',
      pending: '⏳',
      rejected: '❌',
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${styles[status as keyof typeof styles]}`}
      >
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getStats = () => {
    const total = designs.length
    const approved = designs.filter(d => d.status === 'approved').length
    const pending = designs.filter(d => d.status === 'pending').length
    const rejected = designs.filter(d => d.status === 'rejected').length
    const available = designs.filter(d => d.available).length

    return { total, approved, pending, rejected, available }
  }

  const stats = getStats()
  const filteredDesigns = designs.filter(design =>
    design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (design.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRevenue = (design: Design) => {
    return (design.sales * design.price * 0.7).toFixed(2) // 70% pour le créateur
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Mes Designs</h1>
          <p className="text-gray-600 mt-2">Gérez et suivez la performance de vos créations</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
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

          <Link 
            to="/creator/upload" 
            className="flex items-center gap-2 bg-primary-600 text-white rounded-xl px-6 py-2.5 hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-lg">+</span>
            Nouveau Design
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-blue-100 text-sm">Total</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.approved}</div>
            <div className="text-green-100 text-sm">Approuvés</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-yellow-100 text-sm">En attente</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <div className="text-red-100 text-sm">Rejetés</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.available}</div>
            <div className="text-purple-100 text-sm">Disponibles</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtrer par statut</h3>
            <p className="text-gray-600 text-sm mt-1">Afficher les designs par statut de modération</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all' as const, label: 'Tous les designs', count: stats.total },
              { key: 'approved' as const, label: 'Approuvés', count: stats.approved },
              { key: 'pending' as const, label: 'En attente', count: stats.pending },
              { key: 'rejected' as const, label: 'Rejetés', count: stats.rejected }
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
              {searchTerm ? 'Aucun design trouvé' : 'Aucun design'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Aucun design ne correspond à votre recherche.'
                : 'Commencez par télécharger votre premier design.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/creator/upload" className="btn btn-primary">
                Télécharger un design
              </Link>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn btn-secondary"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
                <img
                  src={design.thumbnail_url || design.image_url}
                  alt={design.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(design.status)}
                </div>

                {/* Availability Overlay */}
                {!design.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2">
                      <span className="font-semibold text-gray-900 text-sm">Indisponible</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <Link
                      to={`/designs/${design.id}`}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors duration-200"
                      title="Voir le design"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Description */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{design.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {design.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">{design.views}</div>
                    <div className="text-blue-500 text-xs">Vues</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <div className="font-bold text-purple-600 text-sm">{design.favorites}</div>
                    <div className="text-purple-500 text-xs">Favoris</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="font-bold text-green-600 text-sm">{design.sales}</div>
                    <div className="text-green-500 text-xs">Ventes</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <div className="font-bold text-orange-600 text-sm">{getRevenue(design)}€</div>
                    <div className="text-orange-500 text-xs">Revenus</div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">
                      {design.price.toFixed(2)} €
                    </span>
                    <div className="text-xs text-gray-500">Prix de vente</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(design.id, design.available)}
                      disabled={updatingDesign === design.id}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        design.available
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingDesign === design.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : design.available ? (
                        <>
                          <span>👁️</span>
                          Masquer
                        </>
                      ) : (
                        <>
                          <span>👁️</span>
                          Afficher
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="w-10 h-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                      title="Supprimer le design"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Créé le {new Date(design.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Summary */}
      {filteredDesigns.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Performance globale</p>
                <p className="text-sm text-gray-600">
                  {filteredDesigns.length} design{filteredDesigns.length > 1 ? 's' : ''} • 
                  {filteredDesigns.reduce((sum, d) => sum + d.sales, 0)} ventes totales
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Revenus estimés: <span className="font-semibold text-primary-600">
                  {filteredDesigns.reduce((sum, d) => sum + (d.sales * d.price * 0.7), 0).toFixed(2)} €
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}