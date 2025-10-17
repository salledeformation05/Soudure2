import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { signOut } from '../lib/auth'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
        })
        .eq('id', user.id)

      if (error) throw error

      setUser({
        ...user,
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
      })

      alert('Profil mis à jour avec succès')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const getRoleColor = (role: string) => {
    const colors = {
      client: 'from-blue-500 to-blue-600',
      creator: 'from-purple-500 to-purple-600',
      provider: 'from-green-500 to-green-600',
      admin: 'from-red-500 to-red-600'
    }
    return colors[role as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      client: '👤',
      creator: '🎨',
      provider: '🏭',
      admin: '👑'
    }
    return icons[role as keyof typeof icons] || '👤'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">👤</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Mon Profil
          </h1>
          <p className="text-xl text-gray-600">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6 sticky top-8">
              {/* User Card */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4 shadow-lg`}>
                  {getRoleIcon(user.role)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{user.full_name || 'Utilisateur'}</h3>
                <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                <span className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${getRoleColor(user.role)} text-white rounded-full text-sm font-semibold`}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profil', icon: '👤' },
                  { id: 'security', label: 'Sécurité', icon: '🔒' },
                  { id: 'preferences', label: 'Préférences', icon: '⚙️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Account Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8">📊</span>
                    Informations du compte
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl">
                          📧
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Email</h3>
                          <p className="text-gray-600 text-sm">Adresse principale</p>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-xl">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Rôle</h3>
                          <p className="text-gray-600 text-sm">Statut sur la plateforme</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getRoleColor(user.role)} text-white rounded-full font-semibold`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8">✏️</span>
                    Informations personnelles
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-5 h-5">👤</span>
                          Nom complet
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) =>
                              setFormData({ ...formData, full_name: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Jean Dupont"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <span className="w-6 h-6">👤</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-5 h-5">📞</span>
                          Téléphone
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="+33 6 12 34 56 78"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <span className="w-6 h-6">📞</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5">🏠</span>
                        Adresse de livraison
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          rows={3}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                          placeholder="123 Rue de la Paix, 75001 Paris, France"
                        />
                        <div className="absolute left-4 top-4 text-gray-400">
                          <span className="w-6 h-6">🏠</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Quick Access */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {user.role === 'creator' && (
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-6 text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                        🎨
                      </div>
                      <h3 className="font-bold text-lg mb-2">Espace Créateur</h3>
                      <p className="text-purple-100 text-sm mb-4">Gérez vos designs et statistiques</p>
                      <a
                        href="/creator/stats"
                        className="inline-block w-full py-2 bg-white text-purple-600 font-semibold rounded-2xl hover:shadow-lg transition-all duration-200"
                      >
                        Accéder
                      </a>
                    </div>
                  )}

                  {user.role === 'provider' && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                        🏭
                      </div>
                      <h3 className="font-bold text-lg mb-2">Espace Prestataire</h3>
                      <p className="text-green-100 text-sm mb-4">Gérez vos commandes et production</p>
                      <a
                        href="/provider/stats"
                        className="inline-block w-full py-2 bg-white text-green-600 font-semibold rounded-2xl hover:shadow-lg transition-all duration-200"
                      >
                        Accéder
                      </a>
                    </div>
                  )}

                  {user.role === 'admin' && (
                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                        👑
                      </div>
                      <h3 className="font-bold text-lg mb-2">Administration</h3>
                      <p className="text-red-100 text-sm mb-4">Panneau de gestion complet</p>
                      <a
                        href="/admin"
                        className="inline-block w-full py-2 bg-white text-red-600 font-semibold rounded-2xl hover:shadow-lg transition-all duration-200"
                      >
                        Accéder
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">🔒</span>
                  Sécurité du compte
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Authentification à deux facteurs</h3>
                    <p className="text-gray-600 mb-4">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-200">
                      Activer la 2FA
                    </button>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Sessions actives</h3>
                    <p className="text-gray-600 mb-2">Vous êtes actuellement connecté sur cet appareil</p>
                    <p className="text-sm text-gray-500">Dernière activité: {new Date().toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">⚙️</span>
                  Préférences
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                    <p className="text-gray-600 mb-4">Gérez vos préférences de notification</p>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors duration-200">
                      Configurer
                    </button>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Langue et région</h3>
                    <p className="text-gray-600">Français (France) • Fuseau horaire: Europe/Paris</p>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-3xl shadow-xl border border-red-200 p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8">⚠️</span>
                Zone de sécurité
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Ces actions sont irréversibles. Veuillez les utiliser avec précaution.
                </p>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <span>🚪</span>
                      Se déconnecter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}