import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'

interface User {
  id: string
  email: string
  full_name?: string
  role: string
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'client' | 'creator' | 'provider'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('role', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`Changer le rôle de cet utilisateur en ${newRole} ?`)) {
      return
    }

    setUpdatingUser(userId)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Erreur lors de la mise à jour du rôle')
    } finally {
      setUpdatingUser(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      client: 'bg-blue-100 text-blue-800 border border-blue-200',
      creator: 'bg-green-100 text-green-800 border border-green-200',
      provider: 'bg-orange-100 text-orange-800 border border-orange-200',
      admin: 'bg-red-100 text-red-800 border border-red-200',
    }

    const icons: Record<string, string> = {
      client: '👤',
      creator: '🎨',
      provider: '🏭',
      admin: '⚡',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${styles[role]}`}>
        {icons[role]}
        {role}
      </span>
    )
  }

  const getRoleStats = () => {
    const total = users.length
    const clients = users.filter(u => u.role === 'client').length
    const creators = users.filter(u => u.role === 'creator').length
    const providers = users.filter(u => u.role === 'provider').length
    const admins = users.filter(u => u.role === 'admin').length

    return { total, clients, creators, providers, admins }
  }

  const stats = getRoleStats()

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDaysSinceJoin = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">Gérez les rôles et permissions des utilisateurs de la plateforme</p>
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
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-lg shadow-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm font-semibold mb-1">Total</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-1">Clients</p>
              <p className="text-3xl font-bold">{stats.clients}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
          <div className="text-blue-200 text-xs mt-2">
            {stats.total > 0 ? Math.round((stats.clients / stats.total) * 100) : 0}% du total
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-semibold mb-1">Créateurs</p>
              <p className="text-3xl font-bold">{stats.creators}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
          </div>
          <div className="text-green-200 text-xs mt-2">
            {stats.total > 0 ? Math.round((stats.creators / stats.total) * 100) : 0}% du total
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-semibold mb-1">Prestataires</p>
              <p className="text-3xl font-bold">{stats.providers}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏭</span>
            </div>
          </div>
          <div className="text-orange-200 text-xs mt-2">
            {stats.total > 0 ? Math.round((stats.providers / stats.total) * 100) : 0}% du total
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm font-semibold mb-1">Admins</p>
              <p className="text-3xl font-bold">{stats.admins}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtrer par rôle</h3>
            <p className="text-gray-600 text-sm mt-1">Afficher les utilisateurs par type de compte</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all' as const, label: 'Tous les utilisateurs', count: stats.total },
              { key: 'client' as const, label: 'Clients', count: stats.clients },
              { key: 'creator' as const, label: 'Créateurs', count: stats.creators },
              { key: 'provider' as const, label: 'Prestataires', count: stats.providers }
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

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Aucun utilisateur ne correspond à votre recherche.'
                : 'Aucun utilisateur ne correspond aux filtres sélectionnés.'
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Liste des Utilisateurs
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Trié par: Date d'inscription
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-all duration-200 group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* User Avatar and Basic Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {user.full_name || 'Utilisateur sans nom'}
                        </h4>
                        {getRoleBadge(user.role)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{user.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Membre depuis {getDaysSinceJoin(user.created_at)} jour{getDaysSinceJoin(user.created_at) > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:w-80">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Modifier le rôle
                      </label>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={updatingUser === user.id}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="client">Client</option>
                        <option value="creator">Créateur</option>
                        <option value="provider">Prestataire</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => {/* Add view user details functionality */}}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Détails
                      </button>
                    </div>
                  </div>
                </div>

                {/* User ID */}
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span>ID:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">{user.id}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      {filteredUsers.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-primary-600 text-lg">💡</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Conseil de gestion</p>
                <p className="text-sm text-gray-600">
                  Modifiez les rôles avec précaution. Les changements sont immédiats.
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Affichage de <span className="font-semibold text-gray-900">{filteredUsers.length}</span> utilisateurs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}