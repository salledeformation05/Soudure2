import { createClient } from 'npm:@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface Provider {
  id: string
  user_id: string
  business_name: string
  location: string
  capabilities: string[]
  capacity_per_week: number
  active: boolean
}

interface Order {
  id: string
  support_id: string
  client_id: string
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

    const { orderId } = await req.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, support_id, client_id')
      .eq('id', orderId)
      .maybeSingle()

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: support } = await supabase
      .from('supports')
      .select('type')
      .eq('id', order.support_id)
      .maybeSingle()

    const { data: providers } = await supabase
      .from('providers')
      .select('*')
      .eq('active', true)

    if (!providers || providers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active providers available' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const eligibleProviders = providers.filter((p: Provider) => {
      if (support?.type && !p.capabilities.includes(support.type)) {
        return false
      }
      return true
    })

    if (eligibleProviders.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No eligible providers found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const randomProvider = eligibleProviders[
      Math.floor(Math.random() * eligibleProviders.length)
    ]

    const { error: updateError } = await supabase
      .from('orders')
      .update({ provider_id: randomProvider.user_id })
      .eq('id', orderId)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to assign provider' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        provider: {
          id: randomProvider.user_id,
          business_name: randomProvider.business_name,
        },
      }),
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
