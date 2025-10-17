export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Plateforme Innovante</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                Alpha
              </span>
              <span className="bg-gradient-to-r from-primary-200 to-white bg-clip-text text-transparent">
                Cadeau
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              La révolution des cadeaux personnalisés qui connecte{' '}
              <span className="text-white font-semibold">créateurs talentueux</span>,{' '}
              <span className="text-white font-semibold">clients exigeants</span> et{' '}
              <span className="text-white font-semibold">producteurs locaux</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm">Créateurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm">Designs Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-sm">Villes Couvertes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Notre ADN
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Redéfinir l'expérience du{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                cadeau personnalisé
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chez AlphaCadeau, nous croyons que chaque cadeau devrait être aussi unique que la personne qui le reçoit. 
              Notre plateforme transforme cette vision en réalité grâce à une approche innovante et responsable.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: '🎨',
                title: 'Créativité Illimitée',
                description: 'Des milliers de designs exclusifs créés par des artistes talentueux du monde entier.',
                color: 'from-purple-500 to-pink-500',
                stats: '50K+ Designs'
              },
              {
                icon: '🏭',
                title: 'Production Locale',
                description: 'Fabrication assurée par des prestataires locaux, réduisant notre empreinte écologique.',
                color: 'from-green-500 to-emerald-500',
                stats: '100+ Villes'
              },
              {
                icon: '⭐',
                title: 'Qualité Premium',
                description: 'Contrôle qualité rigoureux et matériaux premium pour une satisfaction garantie.',
                color: 'from-orange-500 to-amber-500',
                stats: '4.9/5 Notes'
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500 h-full">
                  <div className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                    {value.description}
                  </p>

                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      {value.stats}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-12">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  Processus Simplifié
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Comment ça fonctionne ?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Une expérience fluide en 4 étapes simples pour transformer vos idées en cadeaux exceptionnels
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Steps */}
                <div className="space-y-8">
                  {[
                    {
                      step: '01',
                      title: 'Explorez & Choisissez',
                      description: 'Parcourez notre galerie de designs uniques créés par des artistes talentieux ou soumettez votre propre création.',
                      icon: '🔍'
                    },
                    {
                      step: '02',
                      title: 'Personnalisez',
                      description: 'Sélectionnez le support, les couleurs, la taille et ajoutez votre texte. Visualisez en temps réel votre création.',
                      icon: '✨'
                    },
                    {
                      step: '03',
                      title: 'Production Locale',
                      description: 'Un prestataire local qualifié fabrique votre commande avec soin et expertise près de chez vous.',
                      icon: '🏭'
                    },
                    {
                      step: '04',
                      title: 'Livraison Express',
                      description: 'Réceptionnez votre produit soigneusement emballé, avec une garantie satisfaction 100%.',
                      icon: '🚚'
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex-shrink-0 relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                          {step.step}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                          <span className="text-lg">{step.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-80 h-80 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <div className="text-center text-white p-8">
                        <div className="text-6xl mb-4">🎁</div>
                        <div className="text-2xl font-bold mb-2">Cadeau Unique</div>
                        <div className="text-primary-100">Créé avec passion</div>
                        <div className="text-primary-100">Produit localement</div>
                        <div className="text-primary-100">Livré avec soin</div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🌱</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Prêt à{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
              inspirer
            </span>
            ?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Rejoignez la révolution des cadeaux personnalisés et découvrez comment AlphaCadeau 
            transforme la créativité en expériences mémorables pour tous.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/register"
              className="group relative bg-primary-600 text-white hover:bg-primary-700 text-lg font-bold px-12 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <span className="relative z-10">Commencer Maintenant</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a
              href="/contact"
              className="group relative bg-transparent border-2 border-white/80 text-white hover:bg-white/10 text-lg font-semibold px-12 py-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white"
            >
              <span className="relative z-10">Nous Contacter</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-sm">Écoresponsable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24h</div>
              <div className="text-sm">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">30j</div>
              <div className="text-sm">Garantie</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm">Clients Heureux</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}