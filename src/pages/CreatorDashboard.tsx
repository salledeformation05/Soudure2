import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import CreatorDesigns from './creator/CreatorDesigns'
import CreatorStats from './creator/CreatorStats'
import CreatorUpload from './creator/CreatorUpload'

export default function CreatorDashboard() {
  const { user } = useAuthStore()
  const location = useLocation()

  const tabs = [
    { id: 'stats', label: 'Statistiques', path: '/creator/stats', icon: '📊' },
    { id: 'designs', label: 'Mes Designs', path: '/creator/designs', icon: '🎨' },
    { id: 'upload', label: 'Nouveau Design', path: '/creator/upload', icon: '⚡' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec carte élégante */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">👨‍🎨</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Tableau de bord Créateur
                </h1>
                <p className="text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Bienvenue, {user?.full_name || user?.email}
                </p>
              </div>
            </div>
            
            {/* Badge statut */}
            <div className="mt-4 lg:mt-0">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Créateur actif
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs améliorée */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8">
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive(tab.path)
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25 transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive(tab.path) && (
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Content avec fond élégant */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div className="p-8">
            <Routes>
              <Route index element={<CreatorStats />} />
              <Route path="stats" element={<CreatorStats />} />
              <Route path="designs" element={<CreatorDesigns />} />
              <Route path="upload" element={<CreatorUpload />} />
            </Routes>
          </div>
        </div>

        {/* Footer léger */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Besoin d'aide ? <a href="#" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">Contactez notre support</a>
          </p>
        </div>
      </div>
    </div>
  )
}