import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (path === "connect") {
      return await handleConnect(req, supabaseClient);
    } else if (path === "callback") {
      return await handleCallback(req, supabaseClient);
    } else {
      throw new Error("Invalid endpoint");
    }
  } catch (error) {
    console.error("Error in ga4-auth function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleConnect(req: Request, supabaseClient: any) {
  const { projectId, redirectUrl } = await req.json();

  if (!projectId || !redirectUrl) {
    throw new Error("Missing projectId or redirectUrl");
  }

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  if (!clientId) {
    throw new Error("Google Client ID not configured");
  }

  // Create state parameter with project info
  const state = btoa(JSON.stringify({ projectId, redirectUrl }));

  // Google OAuth URL with Analytics scope
  const scope = "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/userinfo.email";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUrl + "/ga4-callback")}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent&` +
    `state=${state}`;

  return new Response(JSON.stringify({ url: authUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function handleCallback(req: Request, supabaseClient: any) {
  const { code, state } = await req.json();

  if (!code || !state) {
    throw new Error("Missing authorization code or state");
  }

  const { projectId, redirectUrl } = JSON.parse(atob(state));

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials not configured");
  }

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUrl + "/ga4-callback",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange code for tokens");
  }

  const tokens = await tokenResponse.json();

  // Get user info
  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );

  const userInfo = await userInfoResponse.json();

  // Get Analytics properties
  const propertiesResponse = await fetch(
    "https://analyticsadmin.googleapis.com/v1alpha/properties",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );

  if (!propertiesResponse.ok) {
    throw new Error("Failed to fetch Analytics properties");
  }

  const properties = await propertiesResponse.json();
  
  // Use the first property (in a real app, let user choose)
  const firstProperty = properties.properties?.[0];
  if (!firstProperty) {
    throw new Error("No Analytics properties found");
  }

  // Save connection to database
  const { error } = await supabaseClient
    .from("ga4_connections")
    .upsert({
      project_id: projectId,
      google_account_email: userInfo.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      property_id: firstProperty.name.split('/')[1], // Extract property ID
      property_name: firstProperty.displayName,
      sync_status: "connected",
      last_sync_at: new Date().toISOString(),
    }, { onConflict: 'project_id' });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Trigger data sync
  await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/sync-ga4-data`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });

  return new Response(JSON.stringify({ 
    success: true,
    property: {
      id: firstProperty.name.split('/')[1],
      name: firstProperty.displayName
    }
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}