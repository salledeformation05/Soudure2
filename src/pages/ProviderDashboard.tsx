import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import ProviderOrders from './provider/ProviderOrders'
import ProviderStats from './provider/ProviderStats'
import ProviderProfile from './provider/ProviderProfile'

export default function ProviderDashboard() {
  const { user } = useAuthStore()
  const location = useLocation()

  const tabs = [
    { id: 'stats', label: 'Statistiques', path: '/provider/stats', icon: '📊', description: 'Analyses de performance' },
    { id: 'orders', label: 'Commandes', path: '/provider/orders', icon: '📦', description: 'Gestion des productions' },
    { id: 'profile', label: 'Profil Entreprise', path: '/provider/profile', icon: '🏢', description: 'Informations professionnelles' },
  ]

  const isActive = (path: string) => location.pathname === path

  const quickStats = [
    { label: 'Commandes en cours', value: '12', change: '+2', trend: 'up' },
    { label: 'Taux de satisfaction', value: '98%', change: '+3%', trend: 'up' },
    { label: 'Revenus du mois', value: '2.4k€', change: '+15%', trend: 'up' },
    { label: 'Délai moyen', value: '2.3j', change: '-0.5j', trend: 'down' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-3xl text-white">🏭</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  Tableau de Bord Artisan
                </h1>
                <p className="text-gray-600 text-lg flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Bienvenue, {user?.full_name || user?.email}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="mt-4 lg:mt-0">
              <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Prestataire Actif
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/80 rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className={`text-xs font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-2 mb-8">
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive(tab.path)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className={`text-sm ${
                    isActive(tab.path) ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
                {isActive(tab.path) && (
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Content Area with Enhanced Background */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div className="p-8">
            <Routes>
              <Route index element={<ProviderStats />} />
              <Route path="stats" element={<ProviderStats />} />
              <Route path="orders" element={<ProviderOrders />} />
              <Route path="profile" element={<ProviderProfile />} />
            </Routes>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl mb-3 mx-auto">
              💬
            </div>
            <h3 className="font-bold text-lg mb-2">Support Client</h3>
            <p className="text-blue-100 text-sm mb-4">Assistance 24h/24</p>
            <button className="w-full py-2 bg-white text-blue-600 font-semibold rounded-2xl hover:shadow-lg transition-all duration-200">
              Contacter
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-6 text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl mb-3 mx-auto">
              📚
            </div>
            <h3 className="font-bold text-lg mb-2">Ressources</h3>
            <p className="text-purple-100 text-sm mb-4">Guides et formations</p>
            <button className="w-full py-2 bg-white text-purple-600 font-semibold rounded-2xl hover:shadow-lg transition-all duration-200">
              Explorer
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-6 text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl mb-3 mx-auto">
              ⚡
            </div>
            <h3 className="font-bold text-lg mb-2">Performance</h3>
            <p className="text-orange-100 text-sm mb-4">Optimisez votre activité</p>
            <button className="w-full py-2 bg-white text-orange-600 font-semibold rounded-2xl hover:shadow-lg transition-all duration-200">
              Analyser
            </button>
          </div>
        </div>

        {/* Provider Status */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                ✅
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Statut Prestataire</h3>
                <p className="text-gray-600 text-sm">Tous les systèmes sont opérationnels</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}