import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRole)

    const payload = await req.json()
    const { orderNumber, customerName, phone, address, postalCode, cart, totalAmount } = payload

    if (!orderNumber || !cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_name: customerName,
          customer_phone: phone,
          customer_address: address,
          postal_code: postalCode,
          items: cart,
          total_amount: totalAmount,
          status: 'pending',
          whatsapp_sent: false
        }
      ])

    if (error) throw error

    return new Response(JSON.stringify({ success: true, orderNumber }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
