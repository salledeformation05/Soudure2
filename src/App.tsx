import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layout
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Designs from './pages/Designs'
import DesignDetail from './pages/DesignDetail'
import OrderCustomize from './pages/OrderCustomize'
import OrderConfirm from './pages/OrderConfirm'
import CreatorDashboard from './pages/CreatorDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import Orders from './pages/Orders'

// Placeholder components for remaining pages
const Supports = () => <div className="p-8">Supports Page (Coming Soon)</div>
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-gray-600 mb-4">Vous n'avez pas accès à cette page</p>
      <a href="/" className="btn btn-primary">Retour à l'accueil</a>
    </div>
  </div>
)
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page non trouvée</p>
      <a href="/" className="btn btn-primary">Retour à l'accueil</a>
    </div>
  </div>
)

function App() {
  const { initialize, initialized } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/designs/:id" element={<DesignDetail />} />
          <Route path="/supports" element={<Supports />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/customize"
            element={
              <ProtectedRoute>
                <OrderCustomize />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/confirm"
            element={
              <ProtectedRoute>
                <OrderConfirm />
              </ProtectedRoute>
            }
          />

          {/* Creator routes */}
          <Route
            path="/creator/*"
            element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <CreatorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Provider routes */}
          <Route
            path="/provider/*"
            element={
              <ProtectedRoute allowedRoles={['provider', 'admin']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
