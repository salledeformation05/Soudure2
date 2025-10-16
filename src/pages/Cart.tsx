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
  const [cartItems] = useState<CartItem[]>([])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <svg
            className="w-24 h-24 text-gray-400 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-8">
            Découvrez nos designs uniques et commencez vos achats
          </p>
          <Link to="/designs" className="btn btn-primary">
            Parcourir le catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Panier ({cartItems.length})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.designImage}
                    alt={item.designTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.designTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Support: {item.supportName}
                  </p>

                  {item.customization && (
                    <div className="text-sm text-gray-600 mb-2">
                      {item.customization.size && (
                        <span className="mr-3">Taille: {item.customization.size}</span>
                      )}
                      {item.customization.color && (
                        <span className="mr-3 capitalize">
                          Couleur: {item.customization.color}
                        </span>
                      )}
                      {item.customization.text && (
                        <span>Texte: "{item.customization.text}"</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                        -
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <button className="text-red-600 hover:text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Récapitulatif
            </h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <button
              onClick={() => navigate('/order/confirm')}
              className="w-full btn btn-primary mb-4"
            >
              Passer commande
            </button>

            <Link
              to="/designs"
              className="block text-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Continuer mes achats
            </Link>

            {subtotal < 50 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Ajoutez {(50 - subtotal).toFixed(2)} € pour bénéficier de la livraison gratuite
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
