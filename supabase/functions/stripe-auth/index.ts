import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const STRIPE_CLIENT_ID = Deno.env.get('STRIPE_CLIENT_ID')!
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    // 生成OAuth URL
    if (action === 'connect') {
      const { projectId, redirectUrl } = await req.json()
      
      const state = btoa(JSON.stringify({ projectId, redirectUrl }))
      const oauthUrl = `https://connect.stripe.com/oauth/authorize?` +
        `response_type=code&` +
        `client_id=${STRIPE_CLIENT_ID}&` +
        `scope=read_only&` +
        `state=${state}&` +
        `redirect_uri=${redirectUrl}/api/stripe/callback`

      return new Response(
        JSON.stringify({ url: oauthUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 处理OAuth回调
    if (action === 'callback') {
      const { code, state } = await req.json()
      const { projectId } = JSON.parse(atob(state))

      // 交换token
      const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_secret: STRIPE_SECRET_KEY,
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange token')
      }

      const tokenData = await tokenResponse.json()
      
      // 保存到数据库
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
      
      const { error } = await supabase
        .from('stripe_connections')
        .upsert({
          project_id: projectId,
          stripe_account_id: tokenData.stripe_user_id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          scope: tokenData.scope,
        })

      if (error) throw error

      // 立即触发数据同步
      await fetch(`${SUPABASE_URL}/functions/v1/sync-stripe-data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      })

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})