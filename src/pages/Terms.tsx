export default function Terms() {
  const lastUpdate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-blue-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">⚖️</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Les règles qui encadrent notre relation pour une expérience AlphaCadeau transparente et sécurisée
          </p>
        </div>

        {/* Last Update Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-lg p-6 mb-12 text-white text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <p className="font-semibold text-lg">Dernière mise à jour</p>
              <p className="text-indigo-100">{lastUpdate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Article 1: Objet */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-2xl text-blue-600">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8">🎯</span>
                  Objet
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme AlphaCadeau
                  accessible à l'adresse alphacadeau.fr. L'utilisation de la plateforme implique l'acceptation pleine et
                  entière des présentes CGU.
                </p>
              </div>
            </div>
          </section>

          {/* Article 2: Inscription */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-2xl text-green-600">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">👤</span>
                  Inscription
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Pour utiliser les services de la plateforme, l'utilisateur doit créer un compte en fournissant des
                  informations exactes et à jour.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: '🔐',
                      title: 'Confidentialité',
                      description: 'L\'utilisateur est responsable de la confidentialité de ses identifiants'
                    },
                    {
                      icon: '👥',
                      title: 'Responsabilité',
                      description: 'Toute utilisation du compte est présumée effectuée par son titulaire'
                    },
                    {
                      icon: '🚨',
                      title: 'Sécurité',
                      description: 'Notification immédiate requise en cas d\'utilisation non autorisée'
                    },
                    {
                      icon: '📝',
                      title: 'Exactitude',
                      description: 'Informations personnelles exactes et régulièrement mises à jour'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Article 3: Services proposés */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-2xl text-purple-600">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">🚀</span>
                  Services proposés
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  AlphaCadeau met à disposition une plateforme complète permettant à chaque acteur de valoriser ses compétences :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      role: 'Client',
                      icon: '🛒',
                      description: 'Acheter des produits personnalisés à partir de designs créés par des artistes',
                      color: 'from-blue-500 to-blue-600'
                    },
                    {
                      role: 'Créateur',
                      icon: '🎨',
                      description: 'Proposer vos designs et percevoir des royalties sur les ventes',
                      color: 'from-purple-500 to-purple-600'
                    },
                    {
                      role: 'Prestataire',
                      icon: '🏭',
                      description: 'Produire localement les commandes assignées selon vos spécialités',
                      color: 'from-green-500 to-green-600'
                    }
                  ].map((service, index) => (
                    <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg mx-auto mb-4`}>
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3">{service.role}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Article 4: Propriété intellectuelle */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-2xl text-orange-600">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">💡</span>
                  Propriété intellectuelle
                </h2>
                <div className="bg-yellow-50/80 rounded-2xl p-6 border border-yellow-200 mb-6">
                  <p className="text-yellow-800 text-lg leading-relaxed">
                    <strong>⚠️ Attention :</strong> Les designs proposés sur la plateforme sont la propriété exclusive de leurs créateurs. 
                    Toute reproduction, représentation ou utilisation non autorisée est strictement interdite.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50/80 rounded-2xl p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5">✅</span>
                      Garanties des créateurs
                    </h4>
                    <p className="text-green-800 text-sm">
                      Les créateurs garantissent détenir tous les droits nécessaires sur les designs qu'ils soumettent 
                      et qu'ils ne portent pas atteinte aux droits de tiers.
                    </p>
                  </div>
                  <div className="bg-red-50/80 rounded-2xl p-6 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5">❌</span>
                      Interdictions
                    </h4>
                    <p className="text-red-800 text-sm">
                      Reproduction, modification, distribution ou utilisation commerciale non autorisée des designs 
                      sans l'accord explicite du créateur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Article 5: Commandes et paiement */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-2xl text-red-600">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">💳</span>
                  Commandes et paiement
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Les commandes passées sur la plateforme font l'objet d'un contrat de vente entre le client et AlphaCadeau.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: '💰', title: 'Paiement sécurisé', description: 'Carte bancaire ou PayPal' },
                    { icon: '✅', title: 'Validation', description: 'Commande confirmée après paiement' },
                    { icon: '€', title: 'Devise', description: 'Prix en euros TTC' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50/80 rounded-2xl border border-gray-200">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-lg mx-auto mb-3">
                        {item.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-200">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <strong>🔒 Sécurité :</strong> Toutes les transactions sont chiffrées et conformes aux normes PCI-DSS. 
                    Aucune donnée bancaire n'est stockée sur nos serveurs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Article 7: Droit de rétractation */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center text-2xl text-indigo-600">
                7
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">↩️</span>
                  Droit de rétractation
                </h2>
                <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 mb-6">
                  <p className="text-green-800 text-lg leading-relaxed">
                    <strong>🛡️ Protection du consommateur :</strong> Conformément au Code de la consommation, 
                    le client dispose d'un délai de 14 jours pour exercer son droit de rétractation.
                  </p>
                </div>
                <div className="bg-orange-50/80 rounded-2xl p-6 border border-orange-200">
                  <p className="text-orange-800 text-sm leading-relaxed">
                    <strong>⚠️ Exception :</strong> Ce droit ne s'applique pas aux produits personnalisés conformément 
                    aux spécifications du client, conformément à l'article L221-28 du Code de la consommation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Article 10: Droit applicable */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-2xl text-gray-600">
                10
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8">🏛️</span>
                  Droit applicable
                </h2>
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300">
                  <p className="text-gray-800 text-lg text-center font-semibold">
                    Les présentes CGU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents de Paris.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8">📞</span>
              Questions légales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">👨‍💼</span>
                  Service juridique
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4">📧</span>
                    legal@alphacadeau.fr
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
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">⏰</span>
                  Délais de traitement
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>• Réponse sous 48h maximum</p>
                  <p>• Traitement des litiges sous 30 jours</p>
                  <p>• Service disponible en français et anglais</p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Notice */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-6 text-center">
            <p className="text-gray-700 font-medium">
              Cette politique de conditions générales est soumise au droit français. 
              Toute modification sera publiée sur cette page avec indication de la date de mise à jour.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}