import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const { user } = useAuthStore()

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Créez et Commandez des Designs Uniques
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Découvrez une plateforme innovante qui connecte créateurs de designs,
            clients et producteurs locaux pour des produits personnalisés de qualité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/designs"
              className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Explorer les Designs
            </Link>
            {!user && (
              <Link
                to="/register"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
              >
                Commencer Gratuitement
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Comment ça fonctionne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. Choisissez un Design
              </h3>
              <p className="text-gray-600">
                Parcourez notre galerie de designs créés par des artistes talentueux
                ou soumettez le vôtre.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Personnalisez
              </h3>
              <p className="text-gray-600">
                Sélectionnez le support (t-shirt, mug, sac...), les couleurs,
                la taille et ajoutez votre texte personnalisé.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Recevez chez vous
              </h3>
              <p className="text-gray-600">
                Un producteur local fabrique votre commande et vous la livre
                rapidement à domicile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Pour les Créateurs
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Monétisez vos créations facilement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Touchez une audience internationale</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Pas de gestion de production ou de livraison</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Statistiques détaillées de vos ventes</span>
                </li>
              </ul>
              <Link to="/become-creator" className="btn btn-primary mt-6 inline-block">
                Devenir Créateur
              </Link>
            </div>

            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <span className="text-6xl">👨‍🎨</span>
            </div>
          </div>
        </div>
      </div>

      {/* For Providers */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-2 md:order-1">
              <span className="text-6xl">🏭</span>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Pour les Producteurs
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Développez votre activité locale</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Recevez des commandes automatiquement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Gestion simplifiée des commandes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Paiements sécurisés et rapides</span>
                </li>
              </ul>
              <Link to="/become-provider" className="btn btn-primary mt-6 inline-block">
                Devenir Prestataire
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Prêt à commencer?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui créent et commandent
            des produits personnalisés chaque jour.
          </p>
          <Link
            to={user ? "/designs" : "/register"}
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 inline-block"
          >
            {user ? "Explorer les Designs" : "Créer un Compte Gratuit"}
          </Link>
        </div>
      </div>
    </div>
  )
}
