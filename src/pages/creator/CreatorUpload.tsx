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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Télécharger un nouveau design
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du design *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Design Géométrique Moderne"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Décrivez votre design en détail..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image *
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Utilisez une image haute résolution (minimum 2000x2000px) avec fond transparent
            </p>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la miniature (optionnel)
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/thumbnail.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si vide, l'image principale sera utilisée
            </p>
          </div>

          {/* Preview */}
          {formData.image_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu
              </label>
              <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = ''
                    e.currentTarget.alt = 'Erreur de chargement'
                  }}
                />
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="géométrique, moderne, abstrait"
            />
            <p className="text-xs text-gray-500 mt-1">
              Séparez les tags par des virgules
            </p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (€) *
            </label>
            <input
              type="number"
              required
              min="0.99"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Prix minimum: 0.99 €. Ce prix s'ajoute au prix du produit.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Consignes importantes
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Utilisez des images de haute qualité (min. 2000x2000px)</li>
              <li>• Privilégiez les fonds transparents (PNG)</li>
              <li>• Assurez-vous d'avoir les droits sur le design</li>
              <li>• Le design sera vérifié avant publication</li>
              <li>• Vous serez notifié de l'approbation ou du rejet</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/creator/designs')}
              className="flex-1 btn btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Téléchargement...' : 'Télécharger le design'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
