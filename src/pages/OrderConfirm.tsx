import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

interface Order {
  id: string
  design_id: string
  support_id: string
  quantity: number
  unit_price: number
  total_price: number
  status: string
  customization: {
    size?: string
    color?: string
    placement?: string
    text?: string
  }
  created_at: string
  designs: {
    title: string
    image_url: string
  }
  supports: {
    name: string
  }
}

export default function OrderConfirm() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId } = location.state || {}

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      navigate('/designs')
      return
    }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          designs (title, image_url),
          supports (name)
        `
        )
        .eq('id', orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      navigate('/designs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Commande non trouvée
        </h2>
        <Link to="/designs" className="btn btn-primary">
          Retour aux designs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Commande confirmée !
        </h1>
        <p className="text-gray-600">
          Votre commande a été enregistrée avec succès
        </p>
      </div>

      {/* Order Details */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Détails de la commande
        </h2>

        <div className="flex gap-4 mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={order.designs.image_url}
              alt={order.designs.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {order.designs.title}
            </h3>
            <p className="text-sm text-gray-600">{order.supports.name}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Numéro de commande</span>
              <p className="font-medium text-gray-900">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Statut</span>
              <p className="font-medium text-gray-900 capitalize">
                {order.status}
              </p>
            </div>
          </div>

          {order.customization && (
            <div>
              <span className="text-gray-500 text-sm">Personnalisation</span>
              <div className="mt-1 space-y-1">
                {order.customization.size && (
                  <p className="text-sm">
                    <span className="text-gray-600">Taille:</span>{' '}
                    {order.customization.size}
                  </p>
                )}
                {order.customization.color && (
                  <p className="text-sm">
                    <span className="text-gray-600">Couleur:</span>{' '}
                    <span className="capitalize">{order.customization.color}</span>
                  </p>
                )}
                {order.customization.placement && (
                  <p className="text-sm">
                    <span className="text-gray-600">Placement:</span>{' '}
                    {order.customization.placement}
                  </p>
                )}
                {order.customization.text && (
                  <p className="text-sm">
                    <span className="text-gray-600">Texte:</span>{' '}
                    "{order.customization.text}"
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Quantité</span>
              <p className="font-medium text-gray-900">{order.quantity}</p>
            </div>
            <div>
              <span className="text-gray-500">Prix unitaire</span>
              <p className="font-medium text-gray-900">
                {order.unit_price.toFixed(2)} €
              </p>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              {order.total_price.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card bg-blue-50 border-blue-200 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>
              Votre commande va être attribuée à un prestataire local proche de
              vous
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>
              Le prestataire préparera votre produit personnalisé avec soin
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>
              Vous recevrez des notifications à chaque étape de la production
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">4.</span>
            <span>
              Une fois prêt, le produit vous sera expédié rapidement
            </span>
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link to="/designs" className="flex-1 btn btn-secondary">
          Continuer mes achats
        </Link>
        <Link to="/" className="flex-1 btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Un e-mail de confirmation a été envoyé à votre adresse.
        </p>
        <p className="mt-2">
          Besoin d'aide ?{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Contactez notre support
          </a>
        </p>
      </div>
    </div>
  )
}
