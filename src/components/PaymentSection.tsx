import { useState } from 'react'

interface PaymentSectionProps {
  totalAmount: number
  paidAmount: number
  role?: 'creator' | 'provider'
}

export default function PaymentSection({ totalAmount, paidAmount }: PaymentSectionProps) {
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestAmount, setRequestAmount] = useState('')

  const balance = totalAmount - paidAmount
  const balancePercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0

  const handleRequestPayment = async () => {
    const amount = parseFloat(requestAmount)
    if (amount > 0 && amount <= balance) {
      alert(`Demande de paiement de ${amount}€ envoyée avec succès`)
      setShowRequestDialog(false)
      setRequestAmount('')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Finances</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          Vue d'ensemble
        </span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-blue-700 font-medium mb-1">Montant Total</div>
            <div className="text-2xl font-bold text-blue-900">{totalAmount.toFixed(2)} €</div>
            <div className="text-xs text-blue-600 mt-1">Revenus générés</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="text-sm text-green-700 font-medium mb-1">Montant Payé</div>
            <div className="text-2xl font-bold text-green-900">{paidAmount.toFixed(2)} €</div>
            <div className="text-xs text-green-600 mt-1">Déjà versé</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="text-sm text-orange-700 font-medium mb-1">Solde Restant</div>
            <div className="text-2xl font-bold text-orange-900">{balance.toFixed(2)} €</div>
            <div className="text-xs text-orange-600 mt-1">À recevoir</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progression des paiements</span>
            <span className="font-semibold text-gray-900">{balancePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-green-600"
              style={{ width: `${balancePercentage}%` }}
            />
          </div>
        </div>

        {balance > 0 && (
          <button
            onClick={() => setShowRequestDialog(true)}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>Demander un Paiement</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        )}
      </div>

      {showRequestDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Demande de Paiement</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant à demander
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  max={balance}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Solde disponible: <span className="font-semibold text-gray-900">{balance.toFixed(2)} €</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRequestDialog(false)
                  setRequestAmount('')
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRequestPayment}
                disabled={!requestAmount || parseFloat(requestAmount) <= 0 || parseFloat(requestAmount) > balance}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
