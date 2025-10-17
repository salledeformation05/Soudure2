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
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

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
    setUpdatingOrder(orderId)
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
    } finally {
      setUpdatingOrder(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      in_production: 'bg-blue-100 text-blue-800 border border-blue-200',
      ready: 'bg-green-100 text-green-800 border border-green-200',
      shipped: 'bg-orange-100 text-orange-800 border border-orange-200',
      delivered: 'bg-gray-100 text-gray-800 border border-gray-200',
      completed: 'bg-green-100 text-green-800 border border-green-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200',
    }

    const labels: Record<string, string> = {
      pending: '⏳ En attente',
      in_production: '🏭 En production',
      ready: '✅ Prêt',
      shipped: '🚚 Expédié',
      delivered: '📦 Livré',
      completed: '🎉 Terminé',
      cancelled: '❌ Annulé',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { status: 'pending', label: 'En attente', icon: '⏳' },
      { status: 'in_production', label: 'Production', icon: '🏭' },
      { status: 'ready', label: 'Prêt', icon: '✅' },
      { status: 'shipped', label: 'Expédié', icon: '🚚' },
      { status: 'delivered', label: 'Livré', icon: '📦' },
    ]

    const currentIndex = steps.findIndex(step => step.status === currentStatus)
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }

  const getStats = () => {
    const total = orders.length
    const pending = orders.filter(o => o.status === 'pending').length
    const inProduction = orders.filter(o => o.status === 'in_production').length
    const completed = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length
    const revenue = orders.reduce((sum, o) => sum + o.total_price, 0)

    return { total, pending, inProduction, completed, revenue }
  }

  const stats = getStats()

  const getNextStatusAction = (currentStatus: string) => {
    const actions: Record<string, { label: string, nextStatus: string, color: string }> = {
      pending: { label: 'Commencer la production', nextStatus: 'in_production', color: 'blue' },
      in_production: { label: 'Marquer comme prêt', nextStatus: 'ready', color: 'green' },
      ready: { label: 'Marquer comme expédié', nextStatus: 'shipped', color: 'orange' },
      shipped: { label: 'Confirmer la livraison', nextStatus: 'delivered', color: 'gray' },
    }

    return actions[currentStatus]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2">Suivez et gérez la production des commandes qui vous sont assignées</p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Commandes actives</div>
          <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-blue-100 text-sm">Total</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-yellow-100 text-sm">En attente</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.inProduction}</div>
            <div className="text-blue-100 text-sm">En production</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-green-100 text-sm">Terminées</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtrer par statut</h3>
            <p className="text-gray-600 text-sm mt-1">Afficher les commandes par statut de production</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all' as const, label: 'Toutes les commandes', count: stats.total },
              { key: 'pending' as const, label: 'En attente', count: stats.pending },
              { key: 'in_production' as const, label: 'En production', count: stats.inProduction },
              { key: 'completed' as const, label: 'Terminées', count: stats.completed }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === key 
                    ? 'bg-white/20 text-white/90' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "Vous n'avez pas encore de commandes assignées."
                : `Aucune commande avec le statut "${filter}".`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const nextAction = getNextStatusAction(order.status)
            const statusSteps = getStatusSteps(order.status)

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Image & Basic Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={order.designs.image_url}
                        alt={order.designs.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
                            {order.designs.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <span className="bg-gray-100 px-2 py-1 rounded-lg font-medium">
                              {order.supports.name}
                            </span>
                            <span>•</span>
                            <span>Quantité: {order.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600 mb-1">
                            {order.total_price.toFixed(2)} €
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">👤</span>
                          <span>{order.profiles.full_name || order.profiles.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">📅</span>
                          <span>Commande du {new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      {/* Customization */}
                      {order.customization && (
                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Personnalisation:</div>
                          <div className="flex flex-wrap gap-3 text-sm">
                            {order.customization.size && (
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                                <span className="text-gray-500">📏</span>
                                <span className="font-medium">{order.customization.size}</span>
                              </div>
                            )}
                            {order.customization.color && (
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                                <span className="text-gray-500">🎨</span>
                                <span className="font-medium capitalize">{order.customization.color}</span>
                              </div>
                            )}
                            {order.customization.text && (
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                                <span className="text-gray-500">✏️</span>
                                <span className="font-medium">"{order.customization.text}"</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Progress & Actions */}
                  <div className="lg:w-80 space-y-4">
                    {/* Status Progress */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-semibold text-gray-900 mb-3">Progression</div>
                      <div className="space-y-2">
                        {statusSteps.map((step, index) => (
                          <div key={step.status} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              step.completed 
                                ? 'bg-green-500 text-white' 
                                : step.current
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              {step.completed ? '✓' : step.current ? step.icon : index + 1}
                            </div>
                            <span className={`text-sm ${
                              step.completed ? 'text-green-600 font-medium' : 
                              step.current ? 'text-blue-600 font-medium' : 
                              'text-gray-500'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {nextAction && (
                      <button
                        onClick={() => updateOrderStatus(order.id, nextAction.nextStatus)}
                        disabled={updatingOrder === order.id}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                          nextAction.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                          nextAction.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                          nextAction.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                          'bg-gray-600 hover:bg-gray-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                      >
                        {updatingOrder === order.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <span>⚡</span>
                            {nextAction.label}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Order ID */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>ID Commande:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono">{order.id.slice(0, 8)}...</code>
                    </div>
                    <div className="text-right">
                      <span>Prix unitaire: {order.unit_price.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Performance Summary */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Performance de production</p>
                <p className="text-sm text-gray-600">
                  {stats.inProduction} commande{stats.inProduction > 1 ? 's' : ''} en cours • 
                  {stats.completed} terminée{stats.completed > 1 ? 's' : ''} ce mois
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Chiffre d'affaires: <span className="font-semibold text-primary-600">
                  {stats.revenue.toFixed(2)} €
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}