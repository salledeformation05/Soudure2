import { supabase } from './supabase'

export interface WhatsAppNotificationOptions {
  phone: string
  message: string
  userId?: string
  type?: 'order_confirmation' | 'order_update' | 'delivery' | 'payment' | 'general'
}

export async function sendWhatsAppNotification(options: WhatsAppNotificationOptions) {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('WhatsApp notification failed:', result)
      return { success: false, error: result.error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendOrderConfirmationWhatsApp(orderId: string, phone: string) {
  const message = `🎉 Votre commande #${orderId.slice(0, 8)} a été confirmée ! Nous préparons votre produit personnalisé avec soin. Vous recevrez une notification dès qu'il sera prêt. Merci de votre confiance ! - AlphaCadeau`

  return sendWhatsAppNotification({
    phone,
    message,
    type: 'order_confirmation',
  })
}

export async function sendOrderUpdateWhatsApp(orderId: string, phone: string, status: string, details?: string) {
  let message = `📦 Mise à jour de votre commande #${orderId.slice(0, 8)}\n\n`

  switch (status) {
    case 'in_production':
      message += '🎨 Votre produit est en cours de fabrication par notre partenaire local !'
      break
    case 'ready_for_delivery':
      message += '✅ Votre produit est prêt et sera bientôt livré !'
      break
    case 'in_delivery':
      message += '🚚 Votre commande est en cours de livraison !'
      break
    case 'delivered':
      message += '🎁 Votre commande a été livrée ! Nous espérons que vous l\'adorez !'
      break
    default:
      message += `Statut: ${status}`
  }

  if (details) {
    message += `\n\n${details}`
  }

  message += '\n\n- AlphaCadeau'

  return sendWhatsAppNotification({
    phone,
    message,
    type: 'order_update',
  })
}

export async function sendDeliveryNotificationWhatsApp(orderId: string, phone: string, trackingInfo?: string) {
  let message = `🚚 Votre commande #${orderId.slice(0, 8)} est en route !\n\n`

  if (trackingInfo) {
    message += `Code de suivi: ${trackingInfo}\n\n`
  }

  message += 'Vous la recevrez bientôt. Restez disponible pour la réception !\n\n- AlphaCadeau'

  return sendWhatsAppNotification({
    phone,
    message,
    type: 'delivery',
  })
}

export async function sendPaymentConfirmationWhatsApp(orderId: string, phone: string, amount: number) {
  const message = `✅ Paiement confirmé !\n\n💰 Montant: ${amount.toFixed(2)}€\nCommande: #${orderId.slice(0, 8)}\n\nMerci pour votre achat ! Votre commande est maintenant en traitement.\n\n- AlphaCadeau`

  return sendWhatsAppNotification({
    phone,
    message,
    type: 'payment',
  })
}

export async function getUserWhatsAppPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('notification_whatsapp, whatsapp_number')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching WhatsApp preferences:', error)
    return null
  }

  return data
}
