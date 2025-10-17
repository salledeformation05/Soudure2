import { createClient } from 'npm:@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface EmailRequest {
  recipientEmail: string
  subject: string
  message: string
  orderId?: string
  orderStatus?: string
  template?: 'order_confirmation' | 'order_update' | 'delivery' | 'payment' | 'welcome' | 'custom'
  templateData?: Record<string, any>
}

function getEmailTemplate(template: string, data: Record<string, any>): { subject: string; html: string } {
  const baseStyle = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
      .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
      .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      .order-details { background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
    </style>
  `

  switch (template) {
    case 'order_confirmation':
      return {
        subject: `✅ Commande confirmée #${data.orderId?.slice(0, 8)}`,
        html: `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>🎉 Commande Confirmée !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${data.customerName || 'cher client'},</p>
              <p>Merci pour votre commande ! Nous avons bien reçu votre commande et nous la préparons avec soin.</p>
              <div class="order-details">
                <strong>Numéro de commande:</strong> #${data.orderId?.slice(0, 8)}<br>
                <strong>Montant total:</strong> ${data.amount}€<br>
                <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}
              </div>
              <p>Vous recevrez une notification dès que votre produit personnalisé sera prêt à être expédié.</p>
              <a href="${data.orderUrl}" class="button">Voir ma commande</a>
            </div>
            <div class="footer">
              <p>© 2024 AlphaCadeau - Plateforme de designs personnalisés</p>
              <p>Pour toute question, contactez-nous à support@alphacadeau.fr</p>
            </div>
          </div>
        `
      }

    case 'order_update':
      return {
        subject: `📦 Mise à jour de votre commande #${data.orderId?.slice(0, 8)}`,
        html: `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>📦 Mise à jour de commande</h1>
            </div>
            <div class="content">
              <p>Bonjour ${data.customerName || 'cher client'},</p>
              <p>Votre commande #${data.orderId?.slice(0, 8)} a été mise à jour.</p>
              <div class="order-details">
                <strong>Nouveau statut:</strong> ${data.status}<br>
                ${data.details ? `<strong>Détails:</strong> ${data.details}<br>` : ''}
                <strong>Date de mise à jour:</strong> ${new Date().toLocaleDateString('fr-FR')}
              </div>
              <a href="${data.orderUrl}" class="button">Suivre ma commande</a>
            </div>
            <div class="footer">
              <p>© 2024 AlphaCadeau</p>
            </div>
          </div>
        `
      }

    case 'delivery':
      return {
        subject: `🚚 Votre commande #${data.orderId?.slice(0, 8)} est en cours de livraison`,
        html: `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>🚚 En cours de livraison !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${data.customerName || 'cher client'},</p>
              <p>Bonne nouvelle ! Votre commande est maintenant en cours de livraison.</p>
              <div class="order-details">
                <strong>Numéro de commande:</strong> #${data.orderId?.slice(0, 8)}<br>
                ${data.trackingNumber ? `<strong>Numéro de suivi:</strong> ${data.trackingNumber}<br>` : ''}
                <strong>Livraison estimée:</strong> ${data.estimatedDelivery || 'Sous 2-3 jours'}
              </div>
              <p>Restez disponible pour réceptionner votre colis !</p>
              <a href="${data.trackingUrl || data.orderUrl}" class="button">Suivre ma livraison</a>
            </div>
            <div class="footer">
              <p>© 2024 AlphaCadeau</p>
            </div>
          </div>
        `
      }

    case 'payment':
      return {
        subject: `✅ Paiement confirmé - Commande #${data.orderId?.slice(0, 8)}`,
        html: `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>✅ Paiement Confirmé</h1>
            </div>
            <div class="content">
              <p>Bonjour ${data.customerName || 'cher client'},</p>
              <p>Nous avons bien reçu votre paiement. Merci pour votre confiance !</p>
              <div class="order-details">
                <strong>Montant payé:</strong> ${data.amount}€<br>
                <strong>Commande:</strong> #${data.orderId?.slice(0, 8)}<br>
                <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}
              </div>
              <p>Votre commande est maintenant en traitement.</p>
              <a href="${data.orderUrl}" class="button">Voir ma commande</a>
            </div>
            <div class="footer">
              <p>© 2024 AlphaCadeau</p>
            </div>
          </div>
        `
      }

    case 'welcome':
      return {
        subject: '🎉 Bienvenue sur AlphaCadeau !',
        html: `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${data.name || 'cher client'},</p>
              <p>Bienvenue sur AlphaCadeau, la plateforme qui révolutionne la création de produits personnalisés !</p>
              <p>Avec AlphaCadeau, vous pouvez :</p>
              <ul>
                <li>🎨 Explorer des milliers de designs créés par des artistes talentueux</li>
                <li>✨ Personnaliser vos produits favoris</li>
                <li>🚀 Recevoir vos créations livrées par des producteurs locaux</li>
              </ul>
              <a href="${data.catalogUrl}" class="button">Découvrir le catalogue</a>
            </div>
            <div class="footer">
              <p>© 2024 AlphaCadeau</p>
            </div>
          </div>
        `
      }

    default:
      return {
        subject: data.subject || 'Notification AlphaCadeau',
        html: `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>AlphaCadeau</h1>
            </div>
            <div class="content">
              ${data.message || '<p>Vous avez reçu une notification.</p>'}
            </div>
            <div class="footer">
              <p>© 2024 AlphaCadeau</p>
            </div>
          </div>
        `
      }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { recipientEmail, subject, message, orderId, orderStatus, template, templateData }: EmailRequest = await req.json()

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: recipientEmail' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    let finalSubject = subject
    let finalMessage = message

    if (template && templateData) {
      const emailContent = getEmailTemplate(template, templateData)
      finalSubject = emailContent.subject
      finalMessage = emailContent.html
    }

    if (!finalSubject || !finalMessage) {
      return new Response(
        JSON.stringify({ error: 'Missing subject or message. Provide either subject+message or template+templateData' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const emailData = {
      recipient_email: recipientEmail,
      subject: finalSubject,
      message: finalMessage,
      order_id: orderId || null,
      order_status: orderStatus || null,
      sent_at: new Date().toISOString(),
      status: 'sent',
    }

    const { data, error } = await supabase
      .from('email_notifications')
      .insert(emailData)
      .select()
      .single()

    if (error) {
      console.error('Error logging email notification:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email notification' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Email notification sent to ${recipientEmail}: ${subject}`)

    return new Response(
      JSON.stringify({ success: true, email: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
