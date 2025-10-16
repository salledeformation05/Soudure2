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
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

      <div className="space-y-6">
        {/* Account Info */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informations du compte
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="123 Rue de la Paix, 75001 Paris"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        {/* Quick Links */}
        {user.role === 'creator' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Espace Créateur
            </h2>
            <a
              href="/creator/stats"
              className="btn btn-secondary w-full"
            >
              Accéder au tableau de bord créateur
            </a>
          </div>
        )}

        {user.role === 'provider' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Espace Prestataire
            </h2>
            <a
              href="/provider/stats"
              className="btn btn-secondary w-full"
            >
              Accéder au tableau de bord prestataire
            </a>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Administration
            </h2>
            <a
              href="/admin"
              className="btn btn-secondary w-full"
            >
              Accéder au panneau d'administration
            </a>
          </div>
        )}

        {/* Danger Zone */}
        <div className="card border-red-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Zone de danger
          </h2>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      </div>
    </div>
  )
}
