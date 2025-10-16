import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AlphaCadeau</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/designs" className="text-gray-700 hover:text-primary-600 transition-colors">
                Designs
              </Link>
              <Link to="/supports" className="text-gray-700 hover:text-primary-600 transition-colors">
                Produits
              </Link>
              {user?.role === 'creator' && (
                <Link to="/creator" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Mes Créations
                </Link>
              )}
              {user?.role === 'provider' && (
                <Link to="/provider" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Mes Commandes
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Administration
                </Link>
              )}
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Mes Commandes
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-secondary text-sm"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn btn-primary text-sm">
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
                <li><Link to="/designs" className="text-sm text-gray-600 hover:text-primary-600">Designs</Link></li>
                <li><Link to="/supports" className="text-sm text-gray-600 hover:text-primary-600">Produits</Link></li>
                <li><Link to="/how-it-works" className="text-sm text-gray-600 hover:text-primary-600">Comment ça marche</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Pour les créateurs</h4>
              <ul className="space-y-2">
                <li><Link to="/become-creator" className="text-sm text-gray-600 hover:text-primary-600">Devenir créateur</Link></li>
                <li><Link to="/creator-guide" className="text-sm text-gray-600 hover:text-primary-600">Guide créateur</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">Contact</Link></li>
                <li><Link to="/faq" className="text-sm text-gray-600 hover:text-primary-600">FAQ</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-primary-600">CGV</Link></li>
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
