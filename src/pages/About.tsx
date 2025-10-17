export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section avec animation */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Animation de particules */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-12 group hover:bg-white/15 transition-all duration-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-white/90 text-sm font-semibold tracking-wide">PLATEFORME INNOVANTE 2024</span>
            </div>

            {/* Main Title avec animation */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 leading-none">
                <span className="bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-transparent animate-gradient-x">
                  Alpha
                </span>
              </h1>
              <h2 className="text-5xl md:text-7xl font-black text-white">
                <span className="bg-gradient-to-r from-primary-200 via-white to-primary-100 bg-clip-text text-transparent animate-gradient-x-reverse">
                  Cadeau
                </span>
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              La révolution des{' '}
              <span className="text-white font-semibold bg-white/10 px-2 py-1 rounded-lg">cadeaux personnalisés</span>{' '}
              qui connecte l'innovation et la passion
            </p>

            {/* Stats Grid améliorée */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { number: '10K+', label: 'Créateurs Talentueux', icon: '🎨' },
                { number: '50K+', label: 'Designs Exclusifs', icon: '💎' },
                { number: '100+', label: 'Villes Actives', icon: '🌍' },
                { number: '4.9/5', label: 'Satisfaction Client', icon: '⭐' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                    <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section avec effet parallax */}
      <div className="relative py-24 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-2xl mb-6">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-700 text-sm font-semibold">NOTRE MISSION</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Redéfinir{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800">
                l'art du cadeau
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Nous créons des expériences uniques où chaque cadeau raconte une histoire, 
              en connectant la créativité des artistes avec l'expertise des artisans locaux.
            </p>
          </div>

          {/* Values Grid avec effet 3D */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: '✨',
                title: 'Innovation Créative',
                description: 'Une plateforme qui repousse les limites de la personnalisation avec des technologies avancées et une vision artistique.',
                color: 'from-purple-500 to-pink-500',
                features: ['IA de personnalisation', 'Rendu 3D temps réel', 'Bibliothèque exclusive']
              },
              {
                icon: '🌱',
                title: 'Impact Local Positif',
                description: 'Nous soutenons les économies locales et réduisons notre empreinte écologique grâce à une production responsable.',
                color: 'from-emerald-500 to-green-500',
                features: ['Circuit court', 'Matériaux durables', 'Empreinte carbone réduite']
              },
              {
                icon: '⚡',
                title: 'Excellence Opérationnelle',
                description: 'Un processus optimisé de la commande à la livraison, garantissant qualité et rapidité exceptionnelles.',
                color: 'from-orange-500 to-amber-500',
                features: ['Livraison express', 'Qualité certifiée', 'Support premium']
              }
            ].map((value, index) => (
              <div key={index} className="group perspective-1000">
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 group-hover:shadow-3xl group-hover:scale-105 transition-all duration-700 transform-style-3d h-full">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5 rounded-3xl`}></div>
                  
                  {/* Icon Container */}
                  <div className="relative mb-8">
                    <div className={`w-24 h-24 bg-gradient-to-r ${value.color} rounded-3xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <span className="text-4xl">{value.icon}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-4 relative">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed mb-6 font-light">
                    {value.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {value.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3 text-sm text-gray-500">
                        <div className={`w-2 h-2 bg-gradient-to-r ${value.color} rounded-full`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Section avec timeline animée */}
          <div className="bg-white/80 backdrop-blur-sm rounded-4xl shadow-2xl shadow-gray-200/30 border border-gray-100/50 overflow-hidden">
            <div className="p-12 lg:p-16">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-2xl mb-6">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 text-sm font-semibold">PROCESSUS INNOVANT</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  L'excellence en{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                    4 étapes
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                  Un parcours fluide et transparent, de l'inspiration à la réception de votre cadeau unique
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
                {/* Steps Timeline */}
                <div className="space-y-8 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200"></div>
                  
                  {[
                    {
                      step: '01',
                      title: 'Inspiration & Découverte',
                      description: 'Explorez notre galerie curatoriale de designs exclusifs ou importez votre création personnelle.',
                      icon: '🔮',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      step: '02',
                      title: 'Personnalisation Avancée',
                      description: 'Utilisez nos outils IA pour visualiser et ajuster chaque détail en temps réel.',
                      icon: '🎛️',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      step: '03',
                      title: 'Fabrication Locale Maîtrisée',
                      description: 'Notre réseau d artisans experts transforme votre vision en réalité avec un savoir-faire exceptionnel.',
                      icon: '⚒️',
                      color: 'from-green-500 to-emerald-500'
                    },
                    {
                      step: '04',
                      title: 'Livraison & Expérience Client',
                      description: 'Réceptionnez votre œuvre soigneusement emballée, avec un suivi transparent et un service premium.',
                      icon: '📬',
                      color: 'from-orange-500 to-amber-500'
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex gap-6 group relative">
                      {/* Step Number */}
                      <div className="flex-shrink-0 relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 group-hover:rotate-5 transition-all duration-500`}>
                          {step.step}
                        </div>
                        {/* Floating Icon */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-125 transition-transform duration-300">
                          <span className="text-sm">{step.icon}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-light">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Showcase */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    {/* Main Card */}
                    <div className="w-96 h-96 bg-gradient-to-br from-primary-500 to-primary-600 rounded-4xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-700">
                      <div className="text-center text-white p-8">
                        <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">🎁</div>
                        <div className="text-2xl font-bold mb-4">Expérience Unique</div>
                        <div className="space-y-1 text-primary-100 font-light">
                          <div>Design Personnalisé</div>
                          <div>Qualité Artisanale</div>
                          <div>Livraison Premium</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-400 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div className="absolute top-1/2 -left-8 w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                      <span className="text-xl">🚀</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section avec effet glassmorphisme */}
      <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-500/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Section Header */}
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
            Prêt à{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-primary-200 animate-gradient-x">
              créer l'extraordinaire
            </span>
            ?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Rejoignez une communauté qui transforme la créativité en moments inoubliables. 
            Ensemble, redéfinissons l'art du cadeau.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="/register"
              className="group relative bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-bold px-14 py-5 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25"
            >
              <span className="relative z-10 flex items-center gap-3">
                Commencer l'Aventure
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
            
            <a
              href="/contact"
              className="group relative bg-white/10 backdrop-blur-md border-2 border-white/20 text-white text-lg font-semibold px-14 py-5 rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/40"
            >
              <span className="relative z-10 flex items-center gap-3">
                Découvrir Notre Histoire
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-gray-400">
            {[
              { value: '100%', label: 'Écoresponsable', icon: '🌍' },
              { value: '24/7', label: 'Support Expert', icon: '💬' },
              { value: '30j', label: 'Garantie Bonheur', icon: '✅' },
              { value: '10K+', label: 'Sourires Créés', icon: '😊' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-x-reverse {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-gradient-x-reverse {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite reverse;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}