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
    avatar_url?: string
    rating?: number
  } | null
  order_status_history: Array<{
    status: string
    created_at: string
    notes?: string
  }>
}

const STATUS_STEPS = [
  { 
    key: 'pending', 
    label: 'En attente', 
    description: 'Commande reçue et en attente de traitement',
    icon: '📥',
    color: 'from-yellow-500 to-yellow-600'
  },
  { 
    key: 'assigned', 
    label: 'Assignée', 
    description: 'Prestataire local sélectionné',
    icon: '👨‍🎨',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    key: 'in_production', 
    label: 'En production', 
    description: 'Fabrication de votre produit en cours',
    icon: '🏭',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    key: 'shipped', 
    label: 'Expédiée', 
    description: 'Votre commande est en route',
    icon: '🚚',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    key: 'delivered', 
    label: 'Livrée', 
    description: 'Commande livrée avec succès',
    icon: '🎉',
    color: 'from-green-500 to-green-600'
  },
]

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('')

  useEffect(() => {
    if (id) {
      fetchOrder()
      calculateEstimatedDelivery()
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
          providers(business_name, avatar_url, rating),
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

  const calculateEstimatedDelivery = () => {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7) // 7 jours estimés
    setEstimatedDelivery(deliveryDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Chargement du suivi...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Commande non trouvée
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Nous n'avons pas pu retrouver les détails de suivi de cette commande.
          </p>
          <Link 
            to="/orders" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="mr-2">📋</span>
            Retour aux commandes
          </Link>
        </div>
      </div>
    )
  }

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === order.status)
  const progressPercentage = (currentStepIndex / (STATUS_STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">📍</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Suivi en Temps Réel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suivez chaque étape de la création de votre commande personnalisée
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Tracking Panel */}
          <div className="xl:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-8 h-8">🚀</span>
                  Progression de la commande
                </h2>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progression globale</div>
                  <div className="text-2xl font-bold text-primary-600">{Math.round(progressPercentage)}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Commande passée</span>
                  <span>Livraison estimée: {estimatedDelivery}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full">
                  <div
                    className="bg-gradient-to-b from-primary-500 to-primary-600 w-full rounded-full transition-all duration-1000"
                    style={{ height: `${progressPercentage}%` }}
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
                      <div key={step.key} className="flex items-start gap-6 relative group">
                        {/* Step Indicator */}
                        <div className="flex-shrink-0 relative">
                          <div
                            className={`w-24 h-24 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 transform group-hover:scale-110 ${
                              isCompleted
                                ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                            } ${isCurrent ? 'ring-4 ring-primary-200 animate-pulse' : ''}`}
                          >
                            {step.icon}
                          </div>
                          
                          {/* Connection Line */}
                          {index < STATUS_STEPS.length - 1 && (
                            <div className={`absolute left-1/2 top-full w-0.5 h-8 -translate-x-1/2 ${
                              isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3
                                className={`text-xl font-bold mb-2 transition-colors ${
                                  isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                }`}
                              >
                                {step.label}
                              </h3>
                              <p className={`text-lg ${
                                isCompleted ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {step.description}
                              </p>
                            </div>
                            
                            {/* Status Badge */}
                            {isCurrent && (
                              <span className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold border border-primary-200">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                                En cours
                              </span>
                            )}
                          </div>

                          {/* History Details */}
                          {historyItem && (
                            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">
                                  Mise à jour le {new Date(historyItem.created_at).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(historyItem.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {historyItem.notes && (
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {historyItem.notes}
                                </p>
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">📋</span>
                  Historique détaillé
                </h2>
                <div className="space-y-4">
                  {order.order_status_history
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((history, index) => {
                      const step = STATUS_STEPS.find(s => s.key === history.status)
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                            step ? `bg-gradient-to-r ${step.color} text-white` : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step?.icon || '📝'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900 capitalize">
                                {history.status.replace('_', ' ')}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(history.created_at).toLocaleString('fr-FR')}
                              </span>
                            </div>
                            {history.notes && (
                              <p className="text-gray-700 leading-relaxed">{history.notes}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-6 h-6">📦</span>
                Détails de la commande
              </h3>
              
              <div className="space-y-4">
                {/* Product Preview */}
                <div className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0">
                    <img
                      src={order.designs.image_url}
                      alt={order.designs.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{order.designs.title}</h4>
                    <p className="text-gray-600 text-xs">{order.supports.name}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">N° de commande</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-lg text-primary-600">
                      {order.total_price.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Date de commande</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="w-4 h-4">🏠</span>
                    Adresse de livraison
                  </h5>
                  <p className="text-blue-800 text-sm leading-relaxed">{order.delivery_address}</p>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            {order.providers && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-6 h-6">👨‍🎨</span>
                  Votre Artisan
                </h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    {order.providers.business_name.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{order.providers.business_name}</h4>
                  <p className="text-gray-600 text-sm mb-3">Prestataire certifié</p>
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-4">
                    {'★'.repeat(5)}
                    <span className="text-gray-600 text-sm ml-1">(4.8)</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Contacter l'artisan
                  </button>
                </div>
              </div>
            )}

            {/* Support Card */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-xl p-6 text-white">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl mb-3 mx-auto">
                  💬
                </div>
                <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
                <p className="text-primary-100 text-sm mb-4">
                  Notre équipe support est disponible pour vous accompagner
                </p>
                <button className="w-full py-2 bg-white text-primary-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Contacter le support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}