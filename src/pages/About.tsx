export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          À propos d'AlphaCadeau
        </h1>
        <p className="text-xl text-gray-600">
          Une plateforme innovante de création et production locale
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-gray-700">
            AlphaCadeau révolutionne l'industrie du cadeau personnalisé en connectant des
            créateurs talentueux avec des clients à la recherche de produits uniques, tout en
            privilégiant une production locale et responsable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Créativité</h3>
            <p className="text-gray-600">
              Des milliers de designs uniques créés par des artistes du monde entier
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Local</h3>
            <p className="text-gray-600">
              Production assurée par des prestataires locaux proches de chez vous
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualité</h3>
            <p className="text-gray-600">
              Contrôle qualité systématique avant chaque expédition
            </p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choisissez un design</h3>
                <p className="text-gray-600">
                  Parcourez notre catalogue de designs créés par des artistes talentueux
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Personnalisez</h3>
                <p className="text-gray-600">
                  Sélectionnez le support, la taille, les couleurs et ajoutez votre texte
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Production locale</h3>
                <p className="text-gray-600">
                  Un prestataire local proche de vous fabrique votre produit
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Recevez votre commande</h3>
                <p className="text-gray-600">
                  Livraison rapide directement chez vous avec garantie qualité
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Rejoignez-nous</h2>
          <p className="text-lg mb-6 opacity-90">
            Que vous soyez créateur, prestataire ou client, AlphaCadeau vous offre une
            expérience unique
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Créer un compte
            </a>
            <a href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
