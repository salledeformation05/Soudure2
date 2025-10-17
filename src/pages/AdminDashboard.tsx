import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AdminDesigns from './admin/AdminDesigns'
import AdminUsers from './admin/AdminUsers'
import AdminStats from './admin/AdminStats'
import AdminReports from './admin/AdminReports'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const location = useLocation()

  const tabs = [
    { 
      id: 'stats', 
      label: 'Tableau de Bord', 
      path: '/admin/stats',
      icon: '📊',
      description: 'Vue d\'ensemble des performances'
    },
    { 
      id: 'reports', 
      label: 'Analytics', 
      path: '/admin/reports',
      icon: '📈',
      description: 'Rapports détaillés et analyses'
    },
    { 
      id: 'designs', 
      label: 'Modération', 
      path: '/admin/designs',
      icon: '🎨',
      description: 'Gestion des designs et contenus'
    },
    { 
      id: 'users', 
      label: 'Utilisateurs', 
      path: '/admin/users',
      icon: '👥',
      description: 'Gestion des comptes et permissions'
    },
  ]

  const isActive = (path: string) => location.pathname === path

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100/50">
      {/* Header avec navigation améliorée */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo et Titre */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Administration
                </h1>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Plateforme en ligne
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">{getGreeting()},</p>
                <p className="font-semibold text-gray-900">
                  {user?.full_name || user?.email}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Navigation Tabs améliorée */}
          <div className="flex space-x-1 pb-0">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`group relative flex flex-col items-center p-4 min-w-32 transition-all duration-300 ${
                  isActive(tab.path)
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <div className={`flex items-center gap-3 mb-1 ${
                  isActive(tab.path) ? 'transform scale-110' : ''
                } transition-transform duration-300`}>
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-semibold text-sm">{tab.label}</span>
                </div>
                <p className={`text-xs text-center transition-all duration-300 ${
                  isActive(tab.path) 
                    ? 'text-primary-500 opacity-100' 
                    : 'text-gray-400 opacity-0 group-hover:opacity-100'
                }`}>
                  {tab.description}
                </p>
                
                {/* Indicator pour l'onglet actif */}
                {isActive(tab.path) && (
                  <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Utilisateurs Actifs', value: '2.4K', change: '+12%', icon: '👥', color: 'blue' },
            { label: 'Designs En Attente', value: '24', change: '+3', icon: '🎨', color: 'orange' },
            { label: 'Commandes Aujourd\'hui', value: '156', change: '+8%', icon: '📦', color: 'green' },
            { label: 'Revenus Journaliers', value: '2.4K€', change: '+15%', icon: '💰', color: 'purple' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  stat.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-purple-500 to-purple-600'
                } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area avec fond amélioré */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/40 shadow-sm overflow-hidden">
          <div className="p-8">
            <Routes>
              <Route index element={<AdminStats />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="designs" element={<AdminDesigns />} />
              <Route path="users" element={<AdminUsers />} />
            </Routes>
          </div>
        </div>

        {/* Footer avec informations système */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Système opérationnel</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span>🔄</span>
              <span>Dernière synchro: {new Date().toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Version 2.1.0</span>
            <span>•</span>
            <span>Support 24/7</span>
          </div>
        </div>
      </div>

      {/* Navigation Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/60 lg:hidden">
        <div className="flex justify-around items-center py-3">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center p-2 min-w-16 transition-all duration-300 ${
                isActive(tab.path)
                  ? 'text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className={`text-xs font-medium ${
                isActive(tab.path) ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {tab.label.split(' ')[0]}
              </span>
              {isActive(tab.path) && (
                <div className="w-1 h-1 bg-primary-600 rounded-full mt-1"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Ajout d'espace pour la barre mobile */}
      <div className="h-20 lg:h-0"></div>
    </div>
  )
}