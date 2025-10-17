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
    { id: 't-shirt', label: 'T-shirts', icon: '👕', color: 'blue' },
    { id: 'mug', label: 'Mugs', icon: '☕', color: 'orange' },
    { id: 'bag', label: 'Sacs', icon: '👜', color: 'green' },
    { id: 'poster', label: 'Posters', icon: '🖼️', color: 'purple' },
    { id: 'phone-case', label: 'Coques téléphone', icon: '📱', color: 'pink' },
    { id: 'keychain', label: 'Porte-clés', icon: '🔑', color: 'yellow' },
    { id: 'hat', label: 'Casquettes', icon: '🧢', color: 'red' },
    { id: 'notebook', label: 'Carnets', icon: '📓', color: 'indigo' },
    { id: 'sticker', label: 'Autocollants', icon: '🏷️', color: 'teal' },
  ]

  const getCapacityLevel = (capacity: number) => {
    if (capacity <= 25) return { level: 'Débutant', color: 'green' }
    if (capacity <= 50) return { level: 'Intermédiaire', color: 'blue' }
    if (capacity <= 100) return { level: 'Avancé', color: 'orange' }
    return { level: 'Professionnel', color: 'purple' }
  }

  const capacityLevel = getCapacityLevel(formData.capacity_per_week)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Profil Prestataire
        </h1>
        <p className="text-gray-600 text-lg">
          Configurez votre activité et maximisez vos opportunités
        </p>
      </div>

      {!profile && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Bienvenue sur AlphaCadeau !</h3>
              <p className="text-blue-100">
                Complétez votre profil pour commencer à recevoir des commandes et développer votre activité.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <span className="text-primary-600 text-lg">🏢</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Informations Entreprise</h3>
                      <p className="text-gray-600 text-sm">Identifiez votre activité</p>
                    </div>
                  </div>

                  {/* Business Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.business_name}
                      onChange={(e) =>
                        setFormData({ ...formData, business_name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="Ex: Mon Atelier d'Impression Créative"
                    />
                  </div>

                  {/* Location */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Localisation *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="Ex: Paris, Île-de-France, France"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="text-blue-500">📍</span>
                      Utilisé pour l'attribution locale des commandes
                    </p>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-green-600 text-lg">⚙️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Capacités de Production</h3>
                      <p className="text-gray-600 text-sm">Sélectionnez vos spécialités</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableCapabilities.map((capability) => {
                      const isSelected = formData.capabilities.includes(capability.id)
                      const colorClasses = {
                        blue: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300',
                        orange: isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-300',
                        green: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300',
                        purple: isSelected ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300',
                        pink: isSelected ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 hover:border-pink-300',
                        yellow: isSelected ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-yellow-300',
                        red: isSelected ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-300',
                        indigo: isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300',
                        teal: isSelected ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-teal-300',
                      }

                      return (
                        <button
                          key={capability.id}
                          type="button"
                          onClick={() => toggleCapability(capability.id)}
                          className={`group relative p-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            colorClasses[capability.color as keyof typeof colorClasses]
                          } hover:scale-105 hover:shadow-md`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xl">{capability.icon}</span>
                            <span className="font-semibold">{capability.label}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {formData.capabilities.length} spécialité{formData.capabilities.length > 1 ? 's' : ''} sélectionnée{formData.capabilities.length > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Capacity & Status */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-purple-600 text-lg">📊</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Capacité & Statut</h3>
                      <p className="text-gray-600 text-sm">Définissez votre rythme de production</p>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Capacité de production hebdomadaire *
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="1"
                        max="200"
                        value={formData.capacity_per_week}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacity_per_week: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary-600">
                            {formData.capacity_per_week}
                          </div>
                          <div className="text-sm text-gray-600">commandes/semaine</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            capacityLevel.color === 'green' ? 'bg-green-100 text-green-800' :
                            capacityLevel.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            capacityLevel.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            Niveau: {capacityLevel.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.active ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <span className={`text-lg ${formData.active ? 'text-green-600' : 'text-gray-400'}`}>
                          {formData.active ? '✅' : '⏸️'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {formData.active ? 'Profil Actif' : 'Profil en Pause'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formData.active 
                            ? 'Vous recevez de nouvelles commandes' 
                            : 'Aucune nouvelle commande ne vous sera attribuée'
                          }
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) =>
                          setFormData({ ...formData, active: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white py-4 px-6 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enregistrement en cours...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      {profile ? 'Mettre à jour le profil' : 'Créer mon profil prestataire'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar - Information & Stats */}
        <div className="space-y-6">
          {/* Profile Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Statut du Profil</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Complétion</span>
                <span className="font-semibold text-primary-600">
                  {(() => {
                    const fields = [formData.business_name, formData.location, formData.capabilities.length]
                    const completed = fields.filter(field =>
                      Array.isArray(field) ? field.length > 0 : (typeof field === 'string' && field.length > 0) || (typeof field === 'number' && field > 0)
                    ).length
                    return Math.round((completed / fields.length) * 100)
                  })()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(() => {
                      const fields = [formData.business_name, formData.location, formData.capabilities.length]
                      const completed = fields.filter(field =>
                        Array.isArray(field) ? field.length > 0 : (typeof field === 'string' && field.length > 0) || (typeof field === 'number' && field > 0)
                      ).length
                      return Math.round((completed / fields.length) * 100)
                    })()}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">💡</span>
              Comment ça marche ?
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-blue-500 text-xs mt-0.5">📍</span>
                <div>
                  <p className="font-medium text-gray-900">Attribution locale</p>
                  <p className="text-gray-600 text-xs">Les commandes sont attribuées par proximité géographique</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-green-500 text-xs mt-0.5">⚡</span>
                <div>
                  <p className="font-medium text-gray-900">Matching intelligent</p>
                  <p className="text-gray-600 text-xs">Basé sur vos capacités et votre disponibilité</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-purple-500 text-xs mt-0.5">🔄</span>
                <div>
                  <p className="font-medium text-gray-900">Flexibilité totale</p>
                  <p className="text-gray-600 text-xs">Activez/désactivez votre profil à tout moment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Tips */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">Conseils de capacité</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                <span>Débutant: 1-25 commandes/semaine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">•</span>
                <span>Intermédiaire: 26-50 commandes/semaine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">•</span>
                <span>Avancé: 51-100 commandes/semaine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">•</span>
                <span>Professionnel: 100+ commandes/semaine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}