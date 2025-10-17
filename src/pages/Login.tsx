import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTestAccounts, setShowTestAccounts] = useState(false)

  const { signIn } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleTestAccount = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg mb-6">
              <span className="text-3xl text-white font-bold">🎁</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Bon retour !
            </h2>
            <p className="text-gray-600 text-lg">
              Connectez-vous à votre compte AlphaCadeau
            </p>
          </div>

          {/* Test accounts accordion */}
          <div className="mb-8">
            <button
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🧪</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Comptes de test</div>
                  <div className="text-sm text-blue-600">Cliquez pour révéler</div>
                </div>
              </div>
              <div className={`transform transition-transform duration-300 ${showTestAccounts ? 'rotate-180' : ''}`}>
                <span className="text-blue-600 text-2xl">⌄</span>
              </div>
            </button>

            {showTestAccounts && (
              <div className="mt-4 space-y-3 animate-fadeIn">
                {[
                  { role: '👑 Admin', email: 'admin@alphacadeau.fr', password: 'Admin123!', color: 'from-purple-500 to-purple-600' },
                  { role: '🎨 Créateur', email: 'creator@alphacadeau.fr', password: 'Creator123!', color: 'from-green-500 to-green-600' },
                  { role: '🏭 Prestataire', email: 'provider@alphacadeau.fr', password: 'Provider123!', color: 'from-orange-500 to-orange-600' }
                ].map((account, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestAccount(account.email, account.password)}
                    className={`w-full p-4 bg-gradient-to-r ${account.color} text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left`}
                  >
                    <div className="font-semibold mb-1">{account.role}</div>
                    <div className="text-sm opacity-90">{account.email}</div>
                    <div className="text-xs opacity-75 mt-1">Cliquez pour remplir</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-shake">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">⚠️</span>
                  </div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-5 h-5 mr-2">📧</span>
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="votre@email.com"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="w-6 h-6">✉️</span>
                  </div>
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-5 h-5 mr-2">🔒</span>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Votre mot de passe"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="w-6 h-6">🗝️</span>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    Oublié ?
                  </Link>
                </div>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-5 h-5 bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200 peer-checked:bg-primary-600">
                    <span className="text-white text-sm opacity-0 peer-checked:opacity-100 transition-opacity">✓</span>
                  </div>
                </div>
                <span className="text-gray-700 font-medium">Se souvenir de moi</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <span className="group-hover:scale-110 transition-transform">🚀</span>
                  <span>Se connecter</span>
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Nouveau sur AlphaCadeau ?</span>
              </div>
            </div>

            {/* Register link */}
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">✨</span>
                Créer un nouveau compte
              </Link>
            </div>
          </div>
        </div>

        {/* Security notice */}
        <div className="text-center">
          <p className="text-white/80 text-sm flex items-center justify-center space-x-2">
            <span>🔒</span>
            <span>Vos données sont sécurisées et chiffrées</span>
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}