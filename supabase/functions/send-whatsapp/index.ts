import { createClient } from 'npm:@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface WhatsAppRequest {
  phone: string
  message: string
  userId?: string
  type?: string
}

async function sendWhatsAppMessage(phone: string, message: string) {
  const url = 'https://cloudmksender.com/api/send'

  const payload = {
    number: phone,
    type: 'text',
    message: message,
    instance_id: '67AFD73EDD2B4',
    access_token: '67af62a5cb1e3'
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return { success: false, error: error.message }
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

    const { phone, message, userId, type }: WhatsAppRequest = await req.json()

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: 'Phone and message are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const result = await sendWhatsAppMessage(phone, message)

    if (userId) {
      await supabase.from('whatsapp_notifications').insert({
        user_id: userId,
        phone,
        message,
        type: type || 'general',
        status: result.success ? 'sent' : 'failed',
        response: result.data || result.error,
      })
    }

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Failed to send WhatsApp message', details: result.error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, result: result.data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
