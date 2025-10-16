import { supabase } from './supabase'

interface EmailNotification {
  recipientEmail: string
  subject: string
  message: string
  orderId?: string
  orderStatus?: string
}

export async function sendEmailNotification(params: EmailNotification): Promise<boolean> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email-notification`

    const { data: { session } } = await supabase.auth.getSession()

    const headers = {
      'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to send email notification')
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error sending email notification:', error)
    return false
  }
}

export async function sendOrderStatusEmail(
  userEmail: string,
  orderId: string,
  status: string,
  designTitle: string
) {
  const statusMessages: Record<string, { subject: string; message: string }> = {
    pending: {
      subject: 'Commande reçue',
      message: `Votre commande pour "${designTitle}" a été reçue. Nous recherchons le meilleur prestataire local pour vous.`,
    },
    assigned: {
      subject: 'Commande assignée',
      message: `Votre commande pour "${designTitle}" a été assignée à un prestataire local. La production va bientôt commencer.`,
    },
    in_production: {
      subject: 'Commande en production',
      message: `Votre commande pour "${designTitle}" est maintenant en cours de fabrication.`,
    },
    shipped: {
      subject: 'Commande expédiée',
      message: `Votre commande pour "${designTitle}" a été expédiée et est en route vers vous.`,
    },
    delivered: {
      subject: 'Commande livrée',
      message: `Votre commande pour "${designTitle}" a été livrée. Nous espérons que vous en êtes satisfait. N'hésitez pas à laisser un avis.`,
    },
    cancelled: {
      subject: 'Commande annulée',
      message: `Votre commande pour "${designTitle}" a été annulée.`,
    },
  }

  const emailContent = statusMessages[status] || {
    subject: 'Mise à jour de commande',
    message: `Le statut de votre commande pour "${designTitle}" a été mis à jour.`,
  }

  return sendEmailNotification({
    recipientEmail: userEmail,
    subject: emailContent.subject,
    message: emailContent.message,
    orderId,
    orderStatus: status,
  })
}
