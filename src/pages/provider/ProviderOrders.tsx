import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/LoadingSpinner'

interface Order {
  id: string
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
  profiles: {
    email: string
    full_name?: string
  }
}

export default function ProviderOrders() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_production' | 'completed'>('all')

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
          profiles:client_id (email, full_name)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .eq('provider_id', user?.id)

      if (error) throw error

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_production: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
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

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
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
          En production
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
          <p className="text-gray-600">
            Les nouvelles commandes apparaîtront ici
          </p>
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
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Client:</span>
                      <p className="font-medium text-gray-900">
                        {order.profiles.full_name || order.profiles.email}
                      </p>
                    </div>
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
                  </div>

                  {/* Customization */}
                  {order.customization && (
                    <div className="text-sm mb-3">
                      <span className="text-gray-500">Personnalisation: </span>
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
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'in_production')}
                        className="btn btn-primary text-sm"
                      >
                        Commencer la production
                      </button>
                    )}
                    {order.status === 'in_production' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="btn btn-primary text-sm"
                      >
                        Marquer comme prêt
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="btn btn-primary text-sm"
                      >
                        Marquer comme expédié
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="btn btn-primary text-sm"
                      >
                        Marquer comme livré
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
