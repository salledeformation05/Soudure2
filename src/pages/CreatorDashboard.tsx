import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import CreatorDesigns from './creator/CreatorDesigns'
import CreatorStats from './creator/CreatorStats'
import CreatorUpload from './creator/CreatorUpload'

export default function CreatorDashboard() {
  const { user } = useAuthStore()
  const location = useLocation()

  const tabs = [
    { id: 'stats', label: 'Statistiques', path: '/creator/stats' },
    { id: 'designs', label: 'Mes Designs', path: '/creator/designs' },
    { id: 'upload', label: 'Nouveau Design', path: '/creator/upload' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Créateur
        </h1>
        <p className="text-gray-600">
          Bienvenue, {user?.full_name || user?.email}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive(tab.path)
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<CreatorStats />} />
        <Route path="stats" element={<CreatorStats />} />
        <Route path="designs" element={<CreatorDesigns />} />
        <Route path="upload" element={<CreatorUpload />} />
      </Routes>
    </div>
  )
}
