import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const { user } = useAuthStore()

  return (
    <div className="bg-white">
      {/* Hero Section - Version améliorée */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">Plateforme n°1 en France</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                Créez.
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-200 to-white bg-clip-text text-transparent">
                Personnalisez.
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                Inspirez.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              La plateforme qui révolutionne la création de produits personnalisés en connectant 
              <span className="text-white font-medium"> artistes talentueux</span>, 
              <span className="text-white font-medium"> clients exigeants</span> et 
              <span className="text-white font-medium"> producteurs locaux</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                to="/designs"
                className="group relative bg-white text-primary-600 hover:bg-gray-50 text-lg font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <span className="relative z-10">Explorer la Galerie</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {!user && (
                <Link
                  to="/register"
                  className="group relative bg-transparent border-2 border-white/80 text-white hover:bg-white/10 text-lg font-semibold px-10 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white"
                >
                  <span className="relative z-10">Commencer Gratuitement</span>
                </Link>
              )}
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">+10k créateurs</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-sm">4.9/5 (2k+ avis)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-primary-400/40 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-20 w-3 h-3 bg-white/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Features Section - Version améliorée */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Processus Simplifié
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment ça <span className="text-primary-600">fonctionne</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une expérience fluide en trois étapes simples pour transformer vos idées en produits exceptionnels
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
            
            {[
              {
                step: "01",
                icon: "🎨",
                title: "Choisissez un Design",
                description: "Parcourez notre galerie exclusive de designs créés par des artistes talentueux ou soumettez votre création personnelle.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02",
                icon: "✨",
                title: "Personnalisez",
                description: "Sélectionnez le support, les couleurs, la taille et ajoutez vos textes. Visualisez en temps réel votre création.",
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                icon: "🚀",
                title: "Recevez chez vous",
                description: "Un producteur local fabrique votre commande avec soin et vous la livre rapidement dans un emballage premium.",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center z-10">
                  <span className="text-primary-700 font-bold text-lg">{feature.step}</span>
                </div>
                
                {/* Feature card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500 h-full">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section - Version améliorée */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="relative">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                Pour les Créateurs
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Transformez votre <span className="text-primary-600">Passion</span> en Réussite
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Rejoignez une communauté d'artistes qui vivent de leur créativité grâce à notre plateforme innovante.
              </p>

              <div className="space-y-6">
                {[
                  "Monétisez vos créations avec des royalties attractives",
                  "Touchez une audience internationale sans effort",
                  "Libérez-vous de la logistique et de la production",
                  "Bénéficiez de statistiques détaillées et d'analyses avancées",
                  "Protégez vos droits d'auteur automatiquement"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-100 transition-colors duration-300">
                      <span className="text-primary-600 text-lg">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg pt-2 group-hover:text-gray-900 transition-colors duration-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Link 
                to="/become-creator" 
                className="group inline-flex items-center mt-10 bg-primary-600 text-white text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Devenir Créateur
                <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👨‍🎨</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Thomas, Designer</div>
                      <div className="text-primary-200 text-sm">+15k€ de revenus</div>
                    </div>
                  </div>
                  <div className="text-white/90 leading-relaxed">
                    "Cette plateforme a transformé ma carrière. Je me concentre sur la création tandis qu'ils gèrent tout le reste. Une véritable révolution !"
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-primary-600">+89%</div>
                  <div className="text-xs text-gray-600">Revenus créateurs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Version améliorée */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Prêt à <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">Inspirer</span> ?
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Rejoignez la révolution créative avec des milliers d'artistes, 
            entrepreneurs et passionnés qui transforment leurs idées en réalité.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to={user ? "/designs" : "/register"}
              className="group relative bg-white text-primary-600 hover:bg-gray-50 text-lg font-bold px-12 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <span className="relative z-10">
                {user ? "Explorer la Galerie" : "Commencer Maintenant"}
              </span>
            </Link>
            
            <Link
              to="/demo"
              className="group relative bg-transparent border-2 border-white/80 text-white hover:bg-white/10 text-lg font-semibold px-12 py-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white"
            >
              <span className="relative z-10">Voir la Démo</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white/70">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm">Créateurs Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm">Produits Livrés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-sm">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24h</div>
              <div className="text-sm">Livraison Express</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}