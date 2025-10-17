import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

interface Category {
  id: string
  name: string
}

export default function CreatorUpload() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    category_id: '',
    tags: '',
    price: '4.99',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setLoading(true)
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const { error } = await supabase.from('designs').insert({
        creator_id: user.id,
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        thumbnail_url: formData.thumbnail_url || formData.image_url,
        category_id: formData.category_id,
        tags: tagsArray,
        price: parseFloat(formData.price),
        status: 'pending',
        available: true,
      })

      if (error) throw error

      alert('Design téléchargé avec succès ! Il sera examiné par notre équipe.')
      navigate('/creator/designs')
    } catch (error) {
      console.error('Error uploading design:', error)
      alert('Erreur lors du téléchargement du design')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.image_url
      case 2:
        return formData.category_id
      case 3:
        return parseFloat(formData.price) >= 0.99
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Publier un nouveau design
        </h1>
        <p className="text-gray-600 text-lg">
          Partagez votre créativité avec la communauté AlphaCadeau
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-1 bg-primary-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
          
          {[
            { number: 1, label: 'Informations', icon: '📝' },
            { number: 2, label: 'Catégorisation', icon: '🏷️' },
            { number: 3, label: 'Prix & Validation', icon: '💰' }
          ].map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep >= step.number 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.number ? '✓' : step.icon}
              </div>
              <span className={`text-sm font-medium mt-2 ${
                currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Informations du design
                </h2>
                <p className="text-gray-600">
                  Décrivez votre design et ajoutez les images principales
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form */}
                <div className="space-y-6">
                  {/* Title */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Titre du design *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="Ex: Design Géométrique Moderne"
                    />
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                      placeholder="Décrivez votre design en détail, son inspiration, son style..."
                    />
                  </div>

                  {/* Image URL */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      URL de l'image principale *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value })
                        setImageError(false)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="https://example.com/design-image.png"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      Utilisez une image PNG avec fond transparent (min. 2000x2000px)
                    </p>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 text-center">
                      Aperçu en temps réel
                    </h3>
                    
                    {formData.image_url ? (
                      <div className="aspect-square bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden shadow-sm">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            setImageError(true)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        {imageError && (
                          <div className="w-full h-full flex items-center justify-center flex-col">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                              <span className="text-2xl">❌</span>
                            </div>
                            <p className="text-red-600 font-medium text-sm">Erreur de chargement</p>
                            <p className="text-red-500 text-xs mt-1">Vérifiez l'URL de l'image</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-square bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-gray-400">🖼️</span>
                          </div>
                          <p className="text-gray-500 text-sm">Aperçu du design</p>
                          <p className="text-gray-400 text-xs mt-1">L'image apparaîtra ici</p>
                        </div>
                      </div>
                    )}

                    {formData.title && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          {formData.title}
                        </h4>
                        {formData.description && (
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {formData.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Categorization */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Catégorisation
                </h2>
                <p className="text-gray-600">
                  Aidez les utilisateurs à découvrir votre design
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Selection */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Catégorie principale *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="">Choisissez une catégorie</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Mots-clés
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="géométrique, moderne, abstrait, minimaliste..."
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="text-blue-500">💡</span>
                      Séparez les tags par des virgules pour améliorer la découvrabilité
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    Conseils de catégorisation
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <span className="text-green-500 text-xs mt-0.5">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Catégorie précise</p>
                        <p className="text-gray-600 text-xs">Choisissez la catégorie la plus pertinente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <span className="text-green-500 text-xs mt-0.5">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Tags spécifiques</p>
                        <p className="text-gray-600 text-xs">Utilisez 5-10 tags descriptifs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <span className="text-green-500 text-xs mt-0.5">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Tendances</p>
                        <p className="text-gray-600 text-xs">Incluez des tags populaires</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Validation */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Prix & Validation
                </h2>
                <p className="text-gray-600">
                  Fixez votre prix et validez les informations
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pricing */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Prix du design (€) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0.99"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        €
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="text-purple-500">💰</span>
                      Prix minimum: 0.99 € • Ce prix s'ajoute au prix du produit physique
                    </p>
                  </div>

                  {/* Revenue Calculator */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">
                      Estimation des revenus
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Prix de vente:</span>
                        <span className="font-semibold text-gray-900">{formData.price} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Votre part (70%):</span>
                        <span className="font-semibold text-green-600">
                          {(parseFloat(formData.price) * 0.7).toFixed(2)} €
                        </span>
                      </div>
                      <div className="pt-3 border-t border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Par 10 ventes:</span>
                          <span className="font-bold text-green-700">
                            {(parseFloat(formData.price) * 0.7 * 10).toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation & Guidelines */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-orange-600">📋</span>
                      Consignes de publication
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✓</span>
                        </div>
                        <span>Vous possédez les droits sur ce design</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✓</span>
                        </div>
                        <span>L'image est en haute résolution (PNG transparent)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✓</span>
                        </div>
                        <span>Le design respecte nos conditions d'utilisation</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">⏱️</span>
                        </div>
                        <span>Validation sous 24-48h par notre équipe</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={currentStep === 1 ? () => navigate('/creator/designs') : prevStep}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {currentStep === 1 ? 'Annuler' : 'Retour'}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Continuer
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepValid()}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publication...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Publier le design
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}