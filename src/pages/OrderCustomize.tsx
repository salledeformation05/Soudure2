import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { Design, Support } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

interface CustomizationOptions {
  size?: string
  color?: string
  quantity: number
  text?: string
  placement?: string
}

export default function OrderCustomize() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { designId, supportId } = location.state || {}

  const [design, setDesign] = useState<Design | null>(null)
  const [support, setSupport] = useState<Support | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [options, setOptions] = useState<CustomizationOptions>({
    quantity: 1,
    size: 'M',
    color: 'white',
    placement: 'center',
    text: '',
  })

  useEffect(() => {
    if (!designId || !supportId) {
      navigate('/designs')
      return
    }
    fetchData()
  }, [designId, supportId])

  const fetchData = async () => {
    try {
      const [designResult, supportResult] = await Promise.all([
        supabase.from('designs').select('*').eq('id', designId).single(),
        supabase.from('supports').select('*').eq('id', supportId).single(),
      ])

      if (designResult.error) throw designResult.error
      if (supportResult.error) throw supportResult.error

      setDesign(designResult.data)
      setSupport(supportResult.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      navigate('/designs')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!design || !support) return 0
    const unitPrice = design.price + support.base_price
    return unitPrice * options.quantity
  }

  const handleSubmit = async () => {
    if (!user || !design || !support) return

    setSubmitting(true)
    try {
      const unitPrice = design.price + support.base_price
      const totalPrice = calculateTotal()

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          client_id: user.id,
          design_id: design.id,
          support_id: support.id,
          quantity: options.quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          status: 'pending',
          customization: {
            size: options.size,
            color: options.color,
            placement: options.placement,
            text: options.text,
          },
        })
        .select()
        .single()

      if (error) throw error

      navigate('/order/confirm', {
        state: { orderId: order.id },
      })
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!design || !support) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Configuration non valide
        </h2>
        <Link to="/designs" className="btn btn-primary">
          Retour aux designs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500">
          <li>
            <Link to="/" className="hover:text-primary-600">
              Accueil
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/designs" className="hover:text-primary-600">
              Designs
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to={`/designs/${design.id}`}
              className="hover:text-primary-600"
            >
              {design.title}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">Personnalisation</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Personnalisez votre produit
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <div className="card sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Aperçu du produit
            </h2>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={design.image_url}
                alt={design.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Design:</span>
                <span className="font-medium">{design.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Produit:</span>
                <span className="font-medium">{support.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Taille:</span>
                <span className="font-medium">{options.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Couleur:</span>
                <span className="font-medium capitalize">{options.color}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantité:</span>
                <span className="font-medium">{options.quantity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Form */}
        <div className="space-y-6">
          {/* Size Selection */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Taille
            </label>
            <div className="grid grid-cols-5 gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setOptions({ ...options, size })}
                  className={`py-2 px-4 border-2 rounded-lg font-medium transition-colors ${
                    options.size === size
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Couleur du produit
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'white', label: 'Blanc', hex: '#FFFFFF' },
                { name: 'black', label: 'Noir', hex: '#000000' },
                { name: 'navy', label: 'Marine', hex: '#001F3F' },
                { name: 'gray', label: 'Gris', hex: '#808080' },
              ].map((color) => (
                <button
                  key={color.name}
                  onClick={() => setOptions({ ...options, color: color.name })}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    options.color === color.name
                      ? 'border-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded mb-1"
                    style={{
                      backgroundColor: color.hex,
                      border: '1px solid #e5e7eb',
                    }}
                  />
                  <div className="text-xs text-center">{color.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Placement */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Placement du design
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'center', label: 'Centre' },
                { value: 'top', label: 'Haut' },
                { value: 'left', label: 'Gauche' },
              ].map((placement) => (
                <button
                  key={placement.value}
                  onClick={() =>
                    setOptions({ ...options, placement: placement.value })
                  }
                  className={`py-2 px-4 border-2 rounded-lg transition-colors ${
                    options.placement === placement.value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {placement.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Texte personnalisé (optionnel)
            </label>
            <input
              type="text"
              value={options.text}
              onChange={(e) => setOptions({ ...options, text: e.target.value })}
              placeholder="Ajoutez votre texte..."
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-2 text-xs text-gray-500">
              Maximum 50 caractères
            </p>
          </div>

          {/* Quantity */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quantité
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  setOptions({
                    ...options,
                    quantity: Math.max(1, options.quantity - 1),
                  })
                }
                className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold">{options.quantity}</span>
              <button
                onClick={() =>
                  setOptions({ ...options, quantity: options.quantity + 1 })
                }
                className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="card bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Design</span>
                <span>{design.price.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Produit ({support.name})</span>
                <span>{support.base_price.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Quantité</span>
                <span>× {options.quantity}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 btn btn-secondary"
            >
              Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {submitting ? 'Traitement...' : 'Valider la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
