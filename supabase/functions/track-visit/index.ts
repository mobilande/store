import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

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
    const { page, device_type, browser } = payload

    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const country = req.headers.get('cf-ipcountry') || 'unknown';

    // Hash the IP to maintain anonymity
    const encoder = new TextEncoder();
    const data = encoder.encode(clientIp + "SALT_FOR_ANONYMITY");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const ipHash = encodeHex(new Uint8Array(hashBuffer));

    const { error } = await supabase
      .from('visits')
      .insert([
        {
          page,
          device_type,
          browser,
          country,
          ip_hash: ipHash
        }
      ])

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
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
