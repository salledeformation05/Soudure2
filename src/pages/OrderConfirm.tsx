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
  const [progressStep, setProgressStep] = useState(1)

  useEffect(() => {
    if (!orderId) {
      navigate('/designs')
      return
    }
    fetchOrder()
    
    // Animation de progression
    const timer = setTimeout(() => setProgressStep(2), 1000)
    return () => clearTimeout(timer)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Préparation de votre confirmation...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Commande non trouvée
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Nous n'avons pas pu retrouver les détails de votre commande.
          </p>
          <Link 
            to="/designs" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="mr-2">🎨</span>
            Explorer les designs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header with Animation */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-2xl mb-8 animate-bounce">
            <span className="text-5xl text-white">🎉</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Commande Confirmée !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Votre création personnalisée est en cours de préparation. 
            Vous recevrez des mises à jour à chaque étape.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Card */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8">📦</span>
                Suivi de commande
              </h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2"></div>
                
                {/* Steps */}
                <div className="space-y-8 relative z-10">
                  {[
                    { step: 1, icon: '✅', title: 'Commande confirmée', description: 'Votre paiement a été accepté', active: true },
                    { step: 2, icon: '👨‍🎨', title: 'Assignation en cours', description: 'Recherche du meilleur prestataire', active: progressStep >= 2 },
                    { step: 3, icon: '🏭', title: 'Production', description: 'Fabrication de votre produit', active: false },
                    { step: 4, icon: '🚚', title: 'Expédition', description: 'Envoi vers votre adresse', active: false },
                    { step: 5, icon: '🏠', title: 'Livraison', description: 'Réception de votre commande', active: false }
                  ].map((step) => (
                    <div key={step.step} className="flex items-start space-x-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                        step.active 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-semibold text-lg transition-colors ${
                          step.active ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`mt-1 transition-colors ${
                          step.active ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8">📋</span>
                Détails de la commande
              </h2>

              {/* Product Info */}
              <div className="flex gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
                  <img
                    src={order.designs.image_url}
                    alt={order.designs.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {order.designs.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{order.supports.name}</p>
                  
                  {/* Customization Badges */}
                  {order.customization && Object.keys(order.customization).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(order.customization).map(([key, value]) => (
                        value && (
                          <span key={key} className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
                            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                            {key}: {value}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600">N° de commande</span>
                    <span className="font-mono font-bold text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600">Statut</span>
                    <span className="font-semibold text-green-600 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600">Quantité</span>
                    <span className="font-semibold text-gray-900">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600">Prix unitaire</span>
                    <span className="font-semibold text-gray-900">
                      {order.unit_price.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  {order.total_price.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Support Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">💬</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Besoin d'aide ?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Notre équipe est là pour vous accompagner
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="mr-2">📞</span>
                  Nous contacter
                </a>
              </div>
            </div>

            {/* Next Actions */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl border border-green-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6">⚡</span>
                Prochaines étapes
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5 flex-shrink-0">1</span>
                  <span>Attribution à un prestataire local (24-48h)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5 flex-shrink-0">2</span>
                  <span>Production artisanale de votre produit</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5 flex-shrink-0">3</span>
                  <span>Contrôle qualité et expédition</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Link 
                to="/designs" 
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-white text-gray-900 font-semibold rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-3">🛍️</span>
                Continuer mes achats
              </Link>
              <Link 
                to="/orders" 
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-3">📋</span>
                Voir mes commandes
              </Link>
            </div>
          </div>
        </div>

        {/* Confirmation Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-green-600">📧</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">E-mail de confirmation envoyé</h3>
                <p className="text-gray-600">
                  Conservez-le pour suivre votre commande
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Temps de production estimé : 5-10 jours ouvrés • Livraison express disponible
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}