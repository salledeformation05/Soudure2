import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface CartItem {
  id: string
  designId: string
  designTitle: string
  designImage: string
  supportName: string
  quantity: number
  price: number
  customization?: {
    size?: string
    color?: string
    text?: string
  }
}

export default function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      designId: 'design-1',
      designTitle: 'Design Géométrique Moderne',
      designImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
      supportName: 'T-shirt Premium',
      quantity: 2,
      price: 24.99,
      customization: {
        size: 'L',
        color: 'noir',
        text: 'AlphaCadeau'
      }
    },
    {
      id: '2',
      designId: 'design-2',
      designTitle: 'Illustration Florale',
      designImage: 'https://images.unsplash.com/photo-1580995176441-92c8f0b94c77?w=400&h=400&fit=crop',
      supportName: 'Mug Céramique',
      quantity: 1,
      price: 14.99,
      customization: {
        color: 'blanc'
      }
    }
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping
  const freeShippingThreshold = 50
  const amountToFreeShipping = freeShippingThreshold - subtotal

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Découvrez nos designs exclusifs et créez des cadeaux uniques
            </p>
            <Link 
              to="/designs" 
              className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>🎨</span>
              Explorer la Galerie
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mon Panier
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>Total: {total.toFixed(2)} €</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/60 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary-200/50">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={item.designImage}
                          alt={item.designTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                            {item.designTitle}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <span className="bg-gray-100 px-3 py-1 rounded-lg font-medium">
                              {item.supportName}
                            </span>
                            <span className="text-lg font-bold text-primary-600">
                              {item.price.toFixed(2)} €
                            </span>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center hover:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Customization */}
                      {item.customization && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Personnalisation:</div>
                          <div className="flex flex-wrap gap-3">
                            {item.customization.size && (
                              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                                <span className="text-gray-500">📏</span>
                                <span className="font-medium">{item.customization.size}</span>
                              </div>
                            )}
                            {item.customization.color && (
                              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                                <span className="text-gray-500">🎨</span>
                                <span className="font-medium capitalize">{item.customization.color}</span>
                              </div>
                            )}
                            {item.customization.text && (
                              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                                <span className="text-gray-500">✏️</span>
                                <span className="font-medium">"{item.customization.text}"</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 font-medium">Quantité:</span>
                          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-300 hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-300 hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {(item.price * item.quantity).toFixed(2)} €
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} × {item.price.toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>📋</span>
                Récapitulatif
              </h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Livraison</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? (
                      <span className="flex items-center gap-1">
                        <span>🎉</span>
                        Gratuite
                      </span>
                    ) : (
                      `${shipping.toFixed(2)} €`
                    )}
                  </span>
                </div>
                
                {/* Progress Bar pour livraison gratuite */}
                {subtotal < freeShippingThreshold && (
                  <div className="pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Livraison gratuite à {freeShippingThreshold} €</span>
                      <span>{amountToFreeShipping.toFixed(2)} € restants</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-8">
                <span>Total TTC</span>
                <span className="text-2xl text-primary-600">{total.toFixed(2)} €</span>
              </div>

              {/* CTA Buttons */}
              <button
                onClick={() => navigate('/order/confirm')}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 mb-4"
              >
                <span>🚀</span>
                Finaliser ma commande
                <span className="text-xl">→</span>
              </button>

              <Link
                to="/designs"
                className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 border-2 border-gray-300 rounded-2xl hover:border-gray-400 transition-all duration-300 hover:scale-105"
              >
                <span>🛍️</span>
                Continuer mes achats
              </Link>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-6 text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="text-xs">Paiement sécurisé</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="text-xs">Livraison rapide</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">💎</div>
                    <div className="text-xs">Qualité premium</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}