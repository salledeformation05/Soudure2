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
  const [activeTab, setActiveTab] = useState('customization')

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

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assign-provider`
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }

      try {
        await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ orderId: order.id }),
        })
      } catch (assignError) {
        console.error('Provider assignment failed:', assignError)
      }

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Chargement de la personnalisation...</p>
        </div>
      </div>
    )
  }

  if (!design || !support) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Configuration non valide
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Impossible de charger les détails de personnalisation.
          </p>
          <Link 
            to="/designs" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="mr-2">🎨</span>
            Retour aux designs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-3 text-sm">
            <li>
              <Link 
                to="/" 
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200 flex items-center"
              >
                <span className="w-5 h-5">🏠</span>
                <span className="ml-1">Accueil</span>
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li>
              <Link 
                to="/designs" 
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                Designs
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li>
              <Link 
                to={`/designs/${design.id}`}
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                {design.title}
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li className="text-primary-600 font-medium">Personnalisation</li>
          </ol>
        </nav>

        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Personnalisez votre création
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Donnez vie à votre design avec nos options de personnalisation avancées
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8">👁️</span>
                Aperçu en direct
              </h2>
              
              {/* Product Preview */}
              <div className="relative mb-6">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={design.image_url}
                    alt={design.title}
                    className="w-full h-full object-contain p-4 transition-all duration-500"
                  />
                </div>
                
                {/* Customization Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {options.text && (
                    <div className={`absolute bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      options.placement === 'center' && 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    } ${options.placement === 'top' && 'top-4 left-1/2 transform -translate-x-1/2'}
                    ${options.placement === 'left' && 'top-1/2 left-4 transform -translate-y-1/2'}`}>
                      {options.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{design.title}</h3>
                  <p className="text-gray-600">{support.name}</p>
                </div>

                {/* Customization Summary */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-5 h-5">⚙️</span>
                    Votre configuration
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Taille</span>
                      <span className="font-semibold">{options.size}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Couleur</span>
                      <span className="font-semibold capitalize">{options.color}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Placement</span>
                      <span className="font-semibold capitalize">{options.placement}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Quantité</span>
                      <span className="font-semibold">{options.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'customization', label: 'Personnalisation', icon: '🎨' },
                    { id: 'summary', label: 'Récapitulatif', icon: '📋' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-8 py-4 font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'customization' && (
                  <div className="space-y-8">
                    {/* Size Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span className="w-6 h-6">📏</span>
                        Taille du produit
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                          <button
                            key={size}
                            onClick={() => setOptions({ ...options, size })}
                            className={`p-4 border-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                              options.size === size
                                ? 'border-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-lg'
                                : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span className="w-6 h-6">🎨</span>
                        Couleur du produit
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { name: 'white', label: 'Blanc', hex: '#FFFFFF', textColor: 'text-gray-900' },
                          { name: 'black', label: 'Noir', hex: '#000000', textColor: 'text-white' },
                          { name: 'navy', label: 'Marine', hex: '#001F3F', textColor: 'text-white' },
                          { name: 'gray', label: 'Gris', hex: '#6B7280', textColor: 'text-white' },
                        ].map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setOptions({ ...options, color: color.name })}
                            className={`p-4 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                              options.color === color.name
                                ? 'border-primary-600 ring-2 ring-primary-200 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="w-full h-16 rounded-xl mb-3 border-2 border-gray-200 shadow-inner"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className={`text-center font-medium ${color.textColor}`}>
                              {color.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Placement Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span className="w-6 h-6">📍</span>
                        Placement du design
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'center', label: 'Centre', icon: '🎯' },
                          { value: 'top', label: 'Haut', icon: '⬆️' },
                          { value: 'left', label: 'Gauche', icon: '⬅️' },
                        ].map((placement) => (
                          <button
                            key={placement.value}
                            onClick={() => setOptions({ ...options, placement: placement.value })}
                            className={`p-6 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                              options.placement === placement.value
                                ? 'border-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-lg'
                                : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-3xl mb-2">{placement.icon}</div>
                            <div className="font-semibold">{placement.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Text */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span className="w-6 h-6">💬</span>
                        Texte personnalisé
                        <span className="text-sm font-normal text-gray-500">(optionnel)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={options.text}
                          onChange={(e) => setOptions({ ...options, text: e.target.value })}
                          placeholder="Ajoutez votre texte personnalisé..."
                          maxLength={50}
                          className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          {(options.text || '').length}/50
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span className="w-6 h-6">📦</span>
                        Quantité
                      </label>
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => setOptions({ ...options, quantity: Math.max(1, options.quantity - 1) })}
                          className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-2xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 text-2xl font-bold text-gray-600 hover:text-primary-600"
                        >
                          −
                        </button>
                        <span className="text-3xl font-bold text-gray-900 min-w-12 text-center">
                          {options.quantity}
                        </span>
                        <button
                          onClick={() => setOptions({ ...options, quantity: options.quantity + 1 })}
                          className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-2xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 text-2xl font-bold text-gray-600 hover:text-primary-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    {/* Price Breakdown */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-6 h-6">💰</span>
                        Détails du prix
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600">Design "{design.title}"</span>
                          <span className="font-semibold">{design.price.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600">Support "{support.name}"</span>
                          <span className="font-semibold">{support.base_price.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600">Quantité</span>
                          <span className="font-semibold">× {options.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="text-xl font-bold text-gray-900">Total</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            {calculateTotal().toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Guarantees */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                        <div className="text-2xl mb-2">🚚</div>
                        <div className="font-semibold text-green-900">Livraison rapide</div>
                        <div className="text-sm text-green-700">5-10 jours</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                        <div className="text-2xl mb-2">🏭</div>
                        <div className="font-semibold text-blue-900">Production locale</div>
                        <div className="text-sm text-blue-700">Artisans français</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200">
                        <div className="text-2xl mb-2">✅</div>
                        <div className="font-semibold text-purple-900">Qualité garantie</div>
                        <div className="text-sm text-purple-700">Satisfait ou remboursé</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-4 px-6 bg-white text-gray-900 font-semibold rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <span>←</span>
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Traitement...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Valider la commande
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}