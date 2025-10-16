import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

interface OrderTracking {
  id: string
  status: string
  created_at: string
  updated_at: string
  total_price: number
  delivery_address: string
  designs: {
    title: string
    image_url: string
  }
  supports: {
    name: string
  }
  providers: {
    business_name: string
  } | null
  order_status_history: Array<{
    status: string
    created_at: string
    notes?: string
  }>
}

const STATUS_STEPS = [
  { key: 'pending', label: 'En attente', description: 'Commande reçue' },
  { key: 'assigned', label: 'Assignée', description: 'Prestataire trouvé' },
  { key: 'in_production', label: 'En production', description: 'Fabrication en cours' },
  { key: 'shipped', label: 'Expédiée', description: 'En cours de livraison' },
  { key: 'delivered', label: 'Livrée', description: 'Commande reçue' },
]

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderTracking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
  }, [id])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          designs(title, image_url),
          supports(name),
          providers(business_name),
          order_status_history(status, created_at, notes)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h2>
        <Link to="/orders" className="btn btn-primary">
          Retour aux commandes
        </Link>
      </div>
    )
  }

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === order.status)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/orders" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Retour aux commandes
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Suivi de commande
        </h1>
        <p className="text-gray-600">
          Commande #{order.id.slice(0, 8)}
        </p>
      </div>

      {/* Order Summary */}
      <div className="card mb-8">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={order.designs.image_url}
              alt={order.designs.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {order.designs.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Support: {order.supports.name}
            </p>
            {order.providers && (
              <p className="text-sm text-gray-600 mb-2">
                Prestataire: {order.providers.business_name}
              </p>
            )}
            <p className="text-sm text-gray-600">
              Adresse de livraison: {order.delivery_address}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              {order.total_price.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Statut de la commande
        </h2>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200">
            <div
              className="bg-primary-600 w-full transition-all duration-500"
              style={{
                height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-8 relative">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const historyItem = order.order_status_history?.find(
                h => h.status === step.key
              )

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {/* Circle */}
                  <div
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                      isCompleted
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-8 h-8 text-white"
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
                    ) : (
                      <span className="text-gray-400 font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-3">
                    <h3
                      className={`font-semibold mb-1 ${
                        isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {step.description}
                    </p>
                    {historyItem && (
                      <div className="text-xs text-gray-500">
                        <p>{new Date(historyItem.created_at).toLocaleString('fr-FR')}</p>
                        {historyItem.notes && (
                          <p className="mt-1 text-gray-600">{historyItem.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Status History */}
      {order.order_status_history && order.order_status_history.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Historique
          </h2>
          <div className="space-y-3">
            {order.order_status_history
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((history, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 capitalize">
                        {history.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(history.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    {history.notes && (
                      <p className="text-sm text-gray-600">{history.notes}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
