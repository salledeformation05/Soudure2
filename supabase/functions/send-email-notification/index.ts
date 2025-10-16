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

    const { recipientEmail, subject, message, orderId, orderStatus }: EmailRequest = await req.json()

    if (!recipientEmail || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: recipientEmail, subject, message' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const emailData = {
      recipient_email: recipientEmail,
      subject,
      message,
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
