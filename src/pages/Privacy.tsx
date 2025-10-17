export default function Privacy() {
  const lastUpdate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">🔒</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chez AlphaCadeau, la protection de vos données personnelles est notre priorité absolue
          </p>
        </div>

        {/* Last Update Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl shadow-lg p-6 mb-12 text-white text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <p className="font-semibold text-lg">Dernière mise à jour</p>
              <p className="text-blue-100">{lastUpdate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-2xl text-blue-600">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8">👋</span>
                  Introduction
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  AlphaCadeau s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité
                  décrit comment nous collectons, utilisons et protégeons vos données personnelles conformément au
                  Règlement Général sur la Protection des Données (RGPD) et à la législation française.
                </p>
              </div>
            </div>
          </section>

          {/* Données collectées */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-2xl text-green-600">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">📊</span>
                  Données collectées
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: '👤',
                      title: 'Données d\'identification',
                      items: ['Nom, prénom', 'Adresse email', 'Numéro de téléphone']
                    },
                    {
                      icon: '🌐',
                      title: 'Données de connexion',
                      items: ['Adresse IP', 'Logs de connexion', 'Cookies essentiels']
                    },
                    {
                      icon: '💳',
                      title: 'Données de paiement',
                      items: ['Informations de facturation', 'Via prestataires sécurisés']
                    },
                    {
                      icon: '📈',
                      title: 'Données de navigation',
                      items: ['Pages visitées', 'Designs consultés', 'Favoris']
                    },
                    {
                      icon: '📦',
                      title: 'Données de commande',
                      items: ['Historique d\'achats', 'Adresses de livraison', 'Personnalisations']
                    },
                    {
                      icon: '⭐',
                      title: 'Données de contenu',
                      items: ['Avis clients', 'Notes et commentaires', 'Évaluations']
                    }
                  ].map((category, index) => (
                    <div key={index} className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-2xl text-purple-600">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">🎯</span>
                  Utilisation des données
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: '👤', title: 'Gestion de compte', desc: 'Création et maintenance de votre espace personnel' },
                    { icon: '🛒', title: 'Traitement des commandes', desc: 'Gestion complète de vos achats et livraisons' },
                    { icon: '💳', title: 'Paiements sécurisés', desc: 'Traitement des transactions via partenaires certifiés' },
                    { icon: '🚀', title: 'Amélioration des services', desc: 'Optimisation continue de votre expérience' },
                    { icon: '📱', title: 'Notifications', desc: 'Informations relatives à vos commandes et comptes' },
                    { icon: '⚖️', title: 'Obligations légales', desc: 'Respect des réglementations en vigueur' }
                  ].map((use, index) => (
                    <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-lg mx-auto mb-4">
                        {use.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{use.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{use.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Partage des données */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-2xl text-orange-600">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">🤝</span>
                  Partage des données
                </h2>
                <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-200 mb-6">
                  <p className="text-lg text-blue-800 text-center font-semibold">
                    Nous ne vendons ni ne louons vos données personnelles à des tiers
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: '🏭',
                      title: 'Prestataires de production',
                      desc: 'Artisans locaux pour la réalisation de vos commandes',
                      necessity: 'Nécessaire au service'
                    },
                    {
                      icon: '💳',
                      title: 'Prestataires de paiement',
                      desc: 'Stripe, PayPal pour le traitement sécurisé des transactions',
                      necessity: 'Nécessaire au paiement'
                    },
                    {
                      icon: '🚚',
                      title: 'Services de livraison',
                      desc: 'Transporteurs pour l\'acheminement de vos commandes',
                      necessity: 'Nécessaire à la livraison'
                    },
                    {
                      icon: '⚖️',
                      title: 'Autorités légales',
                      desc: 'Sur réquisition judiciaire dans le cadre légal',
                      necessity: 'Obligation légale'
                    }
                  ].map((partner, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-xl">
                          {partner.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{partner.title}</h3>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-1">
                            {partner.necessity}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{partner.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sécurité des données */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-2xl text-red-600">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">🛡️</span>
                  Sécurité des données
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {[
                    { icon: '🔐', title: 'Chiffrement SSL', desc: 'Toutes les données transitent de manière sécurisée' },
                    { icon: '🏢', title: 'Infrastructure certifiée', desc: 'Hébergement conforme aux normes de sécurité' },
                    { icon: '📝', title: 'Audits réguliers', desc: 'Contrôles périodiques de notre système' }
                  ].map((security, index) => (
                    <div key={index} className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-200">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-lg mx-auto mb-3">
                        {security.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{security.title}</h3>
                      <p className="text-sm text-gray-600">{security.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50/80 rounded-2xl p-6 border border-green-200">
                  <p className="text-green-800 text-lg leading-relaxed">
                    <strong>💳 Protection des paiements :</strong> Les données de paiement sont traitées exclusivement 
                    par des prestataires certifiés PCI-DSS et ne sont jamais stockées sur nos serveurs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Vos droits RGPD */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center text-2xl text-indigo-600">
                7
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">⚖️</span>
                  Vos droits RGPD
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: '👁️', title: 'Droit d\'accès', desc: 'Obtenir une copie de vos données personnelles' },
                    { icon: '✏️', title: 'Droit de rectification', desc: 'Corriger des données inexactes ou incomplètes' },
                    { icon: '🗑️', title: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données' },
                    { icon: '⏸️', title: 'Droit à la limitation', desc: 'Demander la limitation du traitement' },
                    { icon: '📤', title: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format structuré' },
                    { icon: '🚫', title: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos données' }
                  ].map((right, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-lg shadow-lg flex-shrink-0">
                        {right.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{right.title}</h3>
                        <p className="text-gray-600 text-sm">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white text-center">
                  <p className="text-lg font-semibold mb-2">Pour exercer vos droits</p>
                  <p className="text-blue-100">Contactez notre Délégué à la Protection des Données</p>
                  <p className="text-xl font-bold mt-2">privacy@alphacadeau.fr</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-2xl text-gray-600">
                10
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">📞</span>
                  Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-5 h-5">👨‍💼</span>
                      Délégué à la Protection des Données
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4">📧</span>
                        privacy@alphacadeau.fr
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4">🏢</span>
                        123 Avenue des Champs-Élysées
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4">📍</span>
                        75008 Paris, France
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-5 h-5">⏰</span>
                      Délais de réponse
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>• Réponse sous 48h maximum</p>
                      <p>• Traitement des demandes sous 30 jours</p>
                      <p>• Service disponible en français et anglais</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Notice */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-6 text-center">
            <p className="text-gray-700 font-medium">
              Cette politique de confidentialité est soumise au droit français. 
              Toute modification sera publiée sur cette page avec indication de la date de mise à jour.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}