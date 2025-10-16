import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import ReviewForm from '../components/ReviewForm'

interface Order {
  id: string
  design_id: string
  quantity: number
  unit_price: number
  total_price: number
  status: string
  customization: any
  created_at: string
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
}

export default function Orders() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_production' | 'completed'>('all')
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          designs (title, image_url),
          supports (name),
          providers (business_name)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        if (filter === 'completed') {
          query = query.in('status', ['completed', 'delivered'])
        } else {
          query = query.eq('status', filter)
        }
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string, currentStatus: string) => {
    if (currentStatus !== 'pending') {
      alert('Seules les commandes en attente peuvent être annulées')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('client_id', user?.id)

      if (error) throw error

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      )
      alert('Commande annulée avec succès')
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Erreur lors de l\'annulation de la commande')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_production: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    const labels: Record<string, string> = {
      pending: 'En attente',
      in_production: 'En production',
      ready: 'Prêt',
      shipped: 'Expédié',
      delivered: 'Livré',
      completed: 'Terminé',
      cancelled: 'Annulé',
    }

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getStatusMessage = (status: string, provider: any) => {
    const messages: Record<string, string> = {
      pending: provider
        ? `Votre commande a été attribuée à ${provider.business_name}`
        : 'Votre commande est en attente d\'attribution',
      in_production: 'Votre produit est en cours de fabrication',
      ready: 'Votre produit est prêt',
      shipped: 'Votre commande a été expédiée',
      delivered: 'Votre commande a été livrée',
      completed: 'Commande terminée',
      cancelled: 'Cette commande a été annulée',
    }

    return messages[status] || status
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Commandes</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('in_production')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'in_production'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Terminées
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune commande
          </h3>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore passé de commande
          </p>
          <Link to="/designs" className="btn btn-primary inline-block">
            Parcourir les designs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={order.designs.image_url}
                    alt={order.designs.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.designs.title}
                      </h3>
                      <p className="text-sm text-gray-600">{order.supports.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Status Message */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      {getStatusMessage(order.status, order.providers)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Quantité:</span>
                      <p className="font-medium text-gray-900">{order.quantity}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p className="font-medium text-gray-900">
                        {order.total_price.toFixed(2)} €
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {order.providers && (
                      <div>
                        <span className="text-gray-500">Prestataire:</span>
                        <p className="font-medium text-gray-900">
                          {order.providers.business_name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Customization */}
                  {order.customization && (
                    <div className="text-sm mb-3 text-gray-600">
                      <span className="font-medium">Personnalisation: </span>
                      {order.customization.size && (
                        <span className="mr-2">Taille: {order.customization.size}</span>
                      )}
                      {order.customization.color && (
                        <span className="mr-2 capitalize">
                          Couleur: {order.customization.color}
                        </span>
                      )}
                      {order.customization.text && (
                        <span>Texte: "{order.customization.text}"</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/designs/${order.design_id}`}
                      className="btn btn-secondary text-sm"
                    >
                      Voir le design
                    </Link>
                    <Link
                      to={`/orders/${order.id}/track`}
                      className="btn btn-secondary text-sm"
                    >
                      Suivre la commande
                    </Link>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id, order.status)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        Annuler
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => setReviewingOrder(order)}
                        className="btn btn-primary text-sm"
                      >
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Laisser un avis
              </h3>
              <button
                onClick={() => setReviewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Comment s'est passée votre expérience avec {reviewingOrder.designs.title} ?
            </p>
            <ReviewForm
              orderId={reviewingOrder.id}
              designId={reviewingOrder.design_id}
              providerId={reviewingOrder.providers?.business_name}
              onSuccess={() => {
                setReviewingOrder(null)
                fetchOrders()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
