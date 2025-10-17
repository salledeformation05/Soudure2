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
    avatar_url?: string
  } | null
}

export default function Orders() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_production' | 'completed'>('all')
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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
          providers (business_name, avatar_url)
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
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      pending: { 
        bg: 'bg-yellow-100 border-yellow-200', 
        text: 'text-yellow-800', 
        icon: '⏳' 
      },
      in_production: { 
        bg: 'bg-blue-100 border-blue-200', 
        text: 'text-blue-800', 
        icon: '🏭' 
      },
      ready: { 
        bg: 'bg-green-100 border-green-200', 
        text: 'text-green-800', 
        icon: '✅' 
      },
      shipped: { 
        bg: 'bg-orange-100 border-orange-200', 
        text: 'text-orange-800', 
        icon: '🚚' 
      },
      delivered: { 
        bg: 'bg-green-100 border-green-200', 
        text: 'text-green-800', 
        icon: '📦' 
      },
      completed: { 
        bg: 'bg-gray-100 border-gray-200', 
        text: 'text-gray-800', 
        icon: '🎉' 
      },
      cancelled: { 
        bg: 'bg-red-100 border-red-200', 
        text: 'text-red-800', 
        icon: '❌' 
      },
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

    const style = styles[status] || styles.pending

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${style.bg} ${style.text}`}>
        <span>{style.icon}</span>
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

  const getProgressPercentage = (status: string) => {
    const progress: Record<string, number> = {
      pending: 20,
      in_production: 50,
      ready: 80,
      shipped: 90,
      delivered: 100,
      completed: 100,
      cancelled: 0,
    }
    return progress[status] || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">📦</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Mes Commandes
          </h1>
          <p className="text-xl text-gray-600">
            Suivez l'avancement de toutes vos créations
          </p>
        </div>

        {/* Stats Overview */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">{orders.length}</div>
              <div className="text-sm text-gray-600">Total commandes</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {orders.filter(o => ['pending', 'in_production'].includes(o.status)).length}
              </div>
              <div className="text-sm text-gray-600">En cours</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {orders.filter(o => ['delivered', 'completed'].includes(o.status)).length}
              </div>
              <div className="text-sm text-gray-600">Terminées</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {orders.reduce((acc, order) => acc + order.total_price, 0).toFixed(0)}€
              </div>
              <div className="text-sm text-gray-600">Dépensé au total</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all' as const, label: 'Toutes les commandes', icon: '📋' },
              { key: 'pending' as const, label: 'En attente', icon: '⏳' },
              { key: 'in_production' as const, label: 'En production', icon: '🏭' },
              { key: 'completed' as const, label: 'Terminées', icon: '✅' },
            ].map((filterItem) => (
              <button
                key={filterItem.key}
                onClick={() => setFilter(filterItem.key)}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filter === filterItem.key
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:shadow-md'
                }`}
              >
                <span className="text-lg">{filterItem.icon}</span>
                {filterItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">📦</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Aucune commande
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Vous n'avez pas encore passé de commande. 
                Découvrez nos designs uniques et créez votre première commande personnalisée.
              </p>
              <Link 
                to="/designs" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-3">🎨</span>
                Explorer les designs
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden transition-all duration-500 hover:shadow-2xl"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    <div className="flex items-start gap-6 flex-1">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                        <img
                          src={order.designs.image_url}
                          alt={order.designs.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {order.designs.title}
                            </h3>
                            <p className="text-gray-600">{order.supports.name}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progression de la commande</span>
                            <span>{getProgressPercentage(order.status)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${getProgressPercentage(order.status)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Status Message */}
                        <p className="text-gray-700 bg-blue-50/50 rounded-xl p-3 border border-blue-200">
                          <span className="font-semibold">📢 </span>
                          {getStatusMessage(order.status, order.providers)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Quantité</div>
                      <div className="font-semibold text-gray-900">{order.quantity}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Total</div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {order.total_price.toFixed(2)} €
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Date</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    {order.providers && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Prestataire</div>
                        <div className="font-semibold text-gray-900">
                          {order.providers.business_name}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customization */}
                  {order.customization && Object.keys(order.customization).length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5">⚙️</span>
                        Personnalisation
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(order.customization).map(([key, value]) => (
                          value && (
                            <span 
                              key={key} 
                              className="inline-flex items-center px-3 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium border border-primary-200"
                            >
                              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                              {key}: {String(value)}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/designs/${order.design_id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <span>👁️</span>
                      Voir le design
                    </Link>
                    <Link
                      to={`/orders/${order.id}/track`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <span>📍</span>
                      Suivre la commande
                    </Link>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id, order.status)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 font-semibold rounded-2xl border border-red-200 hover:bg-red-100 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <span>❌</span>
                        Annuler
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => setReviewingOrder(order)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 font-semibold rounded-2xl border border-green-200 hover:bg-green-100 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <span>⭐</span>
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>

                {/* Order ID Footer */}
                <div className="bg-gray-50/80 border-t border-gray-200 px-8 py-4">
                  <div className="text-sm text-gray-500 font-mono">
                    N° de commande: #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewingOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 max-w-lg w-full transform animate-fadeIn">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-8 h-8">⭐</span>
                    Laisser un avis
                  </h3>
                  <button
                    onClick={() => setReviewingOrder(null)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <p className="text-gray-700">
                    Partagez votre expérience avec <strong>{reviewingOrder.designs.title}</strong>
                  </p>
                </div>
                
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
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}