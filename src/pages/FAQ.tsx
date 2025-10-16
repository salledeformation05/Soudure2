import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: 'Commandes',
    question: 'Comment passer une commande ?',
    answer: 'Choisissez un design dans notre catalogue, sélectionnez un support, personnalisez-le si souhaité, puis ajoutez-le au panier. Suivez ensuite les étapes de paiement.',
  },
  {
    category: 'Commandes',
    question: 'Puis-je modifier ma commande après validation ?',
    answer: 'Vous pouvez annuler une commande tant qu\'elle est en statut "En attente". Une fois assignée à un prestataire, contactez notre support.',
  },
  {
    category: 'Livraison',
    question: 'Quels sont les délais de livraison ?',
    answer: 'Les délais varient selon le support et le prestataire local. En moyenne, comptez 5-10 jours ouvrés.',
  },
  {
    category: 'Livraison',
    question: 'Comment suivre ma commande ?',
    answer: 'Accédez à "Mes commandes" dans votre compte, puis cliquez sur "Suivre la commande" pour voir le statut en temps réel.',
  },
  {
    category: 'Paiement',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) et PayPal.',
  },
  {
    category: 'Paiement',
    question: 'Mes données de paiement sont-elles sécurisées ?',
    answer: 'Oui, nous utilisons un système de paiement sécurisé conforme PCI-DSS. Vos données ne sont jamais stockées sur nos serveurs.',
  },
  {
    category: 'Créateurs',
    question: 'Comment devenir créateur ?',
    answer: 'Inscrivez-vous en tant que créateur, téléchargez vos designs, et une fois approuvés par notre équipe, ils seront disponibles dans le catalogue.',
  },
  {
    category: 'Créateurs',
    question: 'Quelle est la commission sur les ventes ?',
    answer: 'Les créateurs reçoivent 40% du prix de vente de chaque design vendu.',
  },
  {
    category: 'Prestataires',
    question: 'Comment devenir prestataire ?',
    answer: 'Créez un compte prestataire et complétez votre profil avec vos zones de service, capacités de production et certifications.',
  },
  {
    category: 'Prestataires',
    question: 'Comment sont assignées les commandes ?',
    answer: 'Les commandes sont automatiquement assignées aux prestataires les plus proches du client, selon leur disponibilité et leurs compétences.',
  },
]

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))]

  const filteredFAQ = selectedCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === selectedCategory)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Questions Fréquentes
        </h1>
        <p className="text-lg text-gray-600">
          Trouvez des réponses aux questions les plus courantes
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Toutes' : category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFAQ.map((item, index) => (
          <div key={index} className="card">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex-1">
                <span className="text-sm text-primary-600 font-medium">
                  {item.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                  {item.question}
                </h3>
              </div>
              <svg
                className={`w-6 h-6 text-gray-400 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
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
            </button>
            {openIndex === index && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 card bg-blue-50 border-blue-200 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Vous ne trouvez pas votre réponse ?
        </h3>
        <p className="text-gray-700 mb-4">
          Notre équipe support est là pour vous aider
        </p>
        <a href="/contact" className="btn btn-primary">
          Nous contacter
        </a>
      </div>
    </div>
  )
}
