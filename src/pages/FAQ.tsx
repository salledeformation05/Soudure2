import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
  icon: string
}

const faqData: FAQItem[] = [
  {
    category: 'Commandes',
    question: 'Comment passer une commande ?',
    answer: 'Choisissez un design dans notre catalogue, sélectionnez un support, personnalisez-le si souhaité, puis ajoutez-le au panier. Suivez ensuite les étapes de paiement.',
    icon: '🛒'
  },
  {
    category: 'Commandes',
    question: 'Puis-je modifier ma commande après validation ?',
    answer: 'Vous pouvez annuler une commande tant qu\'elle est en statut "En attente". Une fois assignée à un prestataire, contactez notre support.',
    icon: '✏️'
  },
  {
    category: 'Livraison',
    question: 'Quels sont les délais de livraison ?',
    answer: 'Les délais varient selon le support et le prestataire local. En moyenne, comptez 5-10 jours ouvrés.',
    icon: '🚚'
  },
  {
    category: 'Livraison',
    question: 'Comment suivre ma commande ?',
    answer: 'Accédez à "Mes commandes" dans votre compte, puis cliquez sur "Suivre la commande" pour voir le statut en temps réel.',
    icon: '📱'
  },
  {
    category: 'Paiement',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) et PayPal.',
    icon: '💳'
  },
  {
    category: 'Paiement',
    question: 'Mes données de paiement sont-elles sécurisées ?',
    answer: 'Oui, nous utilisons un système de paiement sécurisé conforme PCI-DSS. Vos données ne sont jamais stockées sur nos serveurs.',
    icon: '🔒'
  },
  {
    category: 'Créateurs',
    question: 'Comment devenir créateur ?',
    answer: 'Inscrivez-vous en tant que créateur, téléchargez vos designs, et une fois approuvés par notre équipe, ils seront disponibles dans le catalogue.',
    icon: '🎨'
  },
  {
    category: 'Créateurs',
    question: 'Quelle est la commission sur les ventes ?',
    answer: 'Les créateurs reçoivent 40% du prix de vente de chaque design vendu.',
    icon: '💰'
  },
  {
    category: 'Prestataires',
    question: 'Comment devenir prestataire ?',
    answer: 'Créez un compte prestataire et complétez votre profil avec vos zones de service, capacités de production et certifications.',
    icon: '🏭'
  },
  {
    category: 'Prestataires',
    question: 'Comment sont assignées les commandes ?',
    answer: 'Les commandes sont automatiquement assignées aux prestataires les plus proches du client, selon leur disponibilité et leurs compétences.',
    icon: '⚡'
  },
]

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))]

  const filteredFAQ = (selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)
  ).filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header élégant */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-2xl mb-8">
            <span className="text-4xl text-white">❓</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Centre d'Aide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trouvez rapidement des réponses à vos questions. 
            Notre équipe est également disponible pour vous accompagner.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Barre de recherche */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">🔍</span>
                Rechercher une question
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tapez votre question ici..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="w-6 h-6">💬</span>
                </div>
              </div>
            </div>

            {/* Filtres par catégorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5">📂</span>
                Filtrer par catégorie
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    {category === 'all' ? (
                      <>
                        <span className="mr-2">🌟</span>
                        Toutes
                      </>
                    ) : (
                      <>
                        <span className="mr-2">
                          {category === 'Commandes' && '📦'}
                          {category === 'Livraison' && '🚚'}
                          {category === 'Paiement' && '💳'}
                          {category === 'Créateurs' && '🎨'}
                          {category === 'Prestataires' && '🏭'}
                        </span>
                        {category}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">{faqData.length}</div>
            <div className="text-sm text-gray-600">Questions répondues</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Catégories</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">24h/24</div>
            <div className="text-sm text-gray-600">Support disponible</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/60 shadow-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Satisfaction client</div>
          </div>
        </div>

        {/* Liste des FAQ */}
        <div className="space-y-6">
          {filteredFAQ.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/60 overflow-hidden transition-all duration-500 hover:shadow-xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between text-left p-8 hover:bg-gray-50/50 transition-colors duration-300"
              >
                <div className="flex items-start space-x-6 flex-1">
                  {/* Icône */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-3 border border-primary-200">
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-relaxed">
                      {item.question}
                    </h3>
                    
                    {/* Réponse avec animation */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-4 border-t border-gray-200/60">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flèche animée */}
                <div className="flex-shrink-0 ml-6">
                  <div className={`w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center transition-transform duration-500 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Indicateur de progression */}
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* État vide pour recherche */}
        {filteredFAQ.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous n'avons trouvé aucune question correspondant à votre recherche.
                Essayez d'autres termes ou contactez notre support.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Réinitialiser la recherche
              </button>
            </div>
          </div>
        )}

        {/* Section de contact améliorée */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Contenu texte */}
            <div className="p-12 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Besoin d'aide personnalisée ?
              </h3>
              <p className="text-primary-100 text-lg mb-6 leading-relaxed">
                Notre équipe support est disponible 24h/24 pour répondre 
                à toutes vos questions et vous accompagner dans votre projet.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-primary-100">
                  <span className="w-6 h-6 mr-3">⏰</span>
                  <span>Réponse sous 2 heures en moyenne</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <span className="w-6 h-6 mr-3">👨‍💻</span>
                  <span>Équipe d'experts dédiée</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <span className="w-6 h-6 mr-3">🎯</span>
                  <span>Solutions personnalisées</span>
                </div>
              </div>
            </div>
            
            {/* Actions de contact */}
            <div className="bg-white p-12 flex flex-col justify-center">
              <div className="space-y-4">
                <a 
                  href="/contact" 
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">📧</span>
                  Nous contacter
                </a>
                <a 
                  href="mailto:support@example.com" 
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">✉️</span>
                  support@example.com
                </a>
                <div className="text-center text-gray-500 text-sm mt-4">
                  Disponible 24h/24, 7j/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}