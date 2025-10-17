import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation d'envoi
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      description: 'contact@alphacadeau.fr',
      subtitle: 'Réponse sous 24h',
      color: 'from-blue-500 to-blue-600',
      badge: 'Rapide'
    },
    {
      icon: '📞',
      title: 'Téléphone',
      description: '+33 1 23 45 67 89',
      subtitle: 'Lun-Ven, 9h-18h',
      color: 'from-green-500 to-green-600',
      badge: 'Direct'
    },
    {
      icon: '📍',
      title: 'Adresse',
      description: '123 Avenue des Champs-Élysées, 75008 Paris',
      subtitle: 'Siège social',
      color: 'from-purple-500 to-purple-600',
      badge: 'Visite'
    }
  ]

  const subjects = [
    { value: 'order', label: 'Question sur une commande', icon: '📦' },
    { value: 'product', label: 'Information produit', icon: '🎨' },
    { value: 'creator', label: 'Devenir créateur', icon: '👨‍🎨' },
    { value: 'provider', label: 'Devenir prestataire', icon: '🏭' },
    { value: 'partnership', label: 'Partenariat', icon: '🤝' },
    { value: 'technical', label: 'Support technique', icon: '⚙️' },
    { value: 'other', label: 'Autre demande', icon: '💬' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl mb-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-primary-700 text-sm font-semibold">SUPPORT 7J/7</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Parlons de votre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              projet
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Notre équipe d'experts est à votre écoute pour transformer vos idées en réalité
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl text-white">✉️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Remplissez le formulaire ci-dessous
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl text-white">✅</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 text-lg">Message envoyé !</h3>
                      <p className="text-green-700">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="Jean Dupont"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
                        👤
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="jean@exemple.fr"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
                        📧
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Sujet de votre message *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 appearance-none"
                    >
                      <option value="">Choisissez un sujet</option>
                      {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.icon} {subject.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      🔽
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Votre message *
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 placeholder-gray-400 resize-none"
                      placeholder="Décrivez-nous votre projet, vos questions ou vos besoins..."
                    />
                    <div className="absolute right-4 top-4 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
                      💬
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-5 px-8 rounded-2xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Envoyer mon message
                      <span className="text-xl">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Background Decoration */}
            <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-primary-200/20 rounded-full blur-xl"></div>
            <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl text-white">{method.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{method.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                          {method.description}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {method.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200/60 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <span className="text-xl text-white">🕒</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Horaires d'ouverture</h3>
                  <p className="text-blue-700 text-sm">Notre équipe est à votre écoute</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { days: 'Lundi - Vendredi', hours: '9h - 18h', status: 'ouvert' },
                  { days: 'Samedi', hours: '10h - 16h', status: 'ouvert' },
                  { days: 'Dimanche', hours: 'Fermé', status: 'closed' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                    <span className="font-medium text-gray-900">{schedule.days}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${
                        schedule.status === 'closed' ? 'text-gray-500' : 'text-blue-700'
                      }`}>
                        {schedule.hours}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        schedule.status === 'closed' ? 'bg-gray-400' : 'bg-green-500 animate-pulse'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200/60">
                <div className="text-2xl font-bold text-primary-600 mb-1">24h</div>
                <div className="text-sm text-gray-600">Délai de réponse</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200/60">
                <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Questions fréquentes ? Consultez notre{' '}
            <a href="/faq" className="text-primary-600 hover:text-primary-700 font-semibold underline">
              centre d'aide
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Livraison', 'Paiement', 'Retours', 'Créateurs', 'Prestataires'].map((topic) => (
              <a
                key={topic}
                href={`/faq#${topic.toLowerCase()}`}
                className="px-4 py-2 bg-white/50 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all duration-300 text-gray-700 hover:text-gray-900"
              >
                {topic}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}