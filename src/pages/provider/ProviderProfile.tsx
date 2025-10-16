import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/LoadingSpinner'

interface ProviderProfile {
  business_name: string
  location: string
  capabilities: string[]
  capacity_per_week: number
  active: boolean
}

export default function ProviderProfile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<ProviderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    business_name: '',
    location: '',
    capabilities: [] as string[],
    capacity_per_week: 50,
    active: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfile(data)
        setFormData({
          business_name: data.business_name,
          location: data.location,
          capabilities: data.capabilities,
          capacity_per_week: data.capacity_per_week,
          active: data.active,
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const profileData = {
        user_id: user.id,
        business_name: formData.business_name,
        location: formData.location,
        capabilities: formData.capabilities,
        capacity_per_week: formData.capacity_per_week,
        active: formData.active,
      }

      if (profile) {
        const { error } = await supabase
          .from('providers')
          .update(profileData)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('providers').insert(profileData)

        if (error) throw error
      }

      alert('Profil mis à jour avec succès')
      fetchProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const toggleCapability = (capability: string) => {
    if (formData.capabilities.includes(capability)) {
      setFormData({
        ...formData,
        capabilities: formData.capabilities.filter((c) => c !== capability),
      })
    } else {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, capability],
      })
    }
  }

  const availableCapabilities = [
    { id: 't-shirt', label: 'T-shirts' },
    { id: 'mug', label: 'Mugs' },
    { id: 'bag', label: 'Sacs' },
    { id: 'poster', label: 'Posters' },
    { id: 'phone-case', label: 'Coques téléphone' },
    { id: 'keychain', label: 'Porte-clés' },
  ]

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Profil Prestataire
        </h2>

        {!profile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              Complétez votre profil pour commencer à recevoir des commandes
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              required
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mon Atelier d'Impression"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Paris, France"
            />
          </div>

          {/* Capabilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Capacités de production *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCapabilities.map((capability) => (
                <button
                  key={capability.id}
                  type="button"
                  onClick={() => toggleCapability(capability.id)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.capabilities.includes(capability.id)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {capability.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Sélectionnez les types de produits que vous pouvez fabriquer
            </p>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacité hebdomadaire *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.capacity_per_week}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity_per_week: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre de commandes que vous pouvez traiter par semaine
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Profil actif (recevoir de nouvelles commandes)
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              À propos du système d'attribution
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • Les commandes sont automatiquement attribuées aux prestataires
              </li>
              <li>• L'attribution se base sur la localisation et les capacités</li>
              <li>
                • Vous pouvez mettre votre profil en pause en désactivant le statut actif
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <button
              type="submit"
              disabled={saving}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
