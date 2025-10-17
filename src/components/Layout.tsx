import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const getDashboardPath = () => {
    if (!user) return '/profile'
    switch (user.role) {
      case 'creator': return '/creator'
      case 'provider': return '/provider'
      case 'admin': return '/admin'
      default: return '/profile'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-xl">AC</span>
              </div>
              <span className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">AlphaCadeau</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/designs"
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive('/designs')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Catalogue
              </Link>
              <Link
                to="/supports"
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive('/supports')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Produits
              </Link>
              {user && user.role !== 'client' && (
                <Link
                  to={getDashboardPath()}
                  className={`px-4 py-2 rounded-lg transition-all font-semibold ${
                    isActive(getDashboardPath())
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  Tableau de bord
                </Link>
              )}
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive('/about')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive('/contact')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link
                    to="/favorites"
                    className={`p-2 rounded-lg transition-all ${
                      isActive('/favorites')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    title="Favoris"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>
                  <Link
                    to="/cart"
                    className={`p-2 rounded-lg transition-all relative ${
                      isActive('/cart')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    title="Panier"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </Link>
                  <Link
                    to="/orders"
                    className={`px-4 py-2 rounded-lg transition-all font-medium ${
                      isActive('/orders')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    Commandes
                  </Link>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      isActive('/profile')
                        ? 'bg-primary-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{user.email?.charAt(0).toUpperCase()}</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium text-sm"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Connexion
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">AlphaCadeau</h3>
              <p className="text-sm text-gray-600">
                Plateforme de designs personnalisés sur mesure avec production locale.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link to="/designs" className="text-sm text-gray-600 hover:text-primary-600">Catalogue</Link></li>
                <li><Link to="/supports" className="text-sm text-gray-600 hover:text-primary-600">Produits</Link></li>
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary-600">À propos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Compte</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-sm text-gray-600 hover:text-primary-600">Créer un compte</Link></li>
                <li><Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">Se connecter</Link></li>
                <li><Link to="/orders" className="text-sm text-gray-600 hover:text-primary-600">Mes commandes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">Contact</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-primary-600">CGU</Link></li>
                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-primary-600">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; 2024 AlphaCadeau. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
