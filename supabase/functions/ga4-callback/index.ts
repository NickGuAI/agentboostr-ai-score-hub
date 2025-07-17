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
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    
    if (!code || !state) {
      throw new Error("Missing authorization code or state");
    }

    // Process the callback
    const { data, error } = await supabaseClient.functions.invoke('ga4-auth/callback', {
      body: { code, state }
    });

    if (error) throw error;

    // Parse state to get redirect URL
    const { redirectUrl, projectId } = JSON.parse(atob(state));

    // Redirect back to the project page with success message
    const redirectTo = `${redirectUrl}/projects/${projectId}?ga4=connected`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectTo,
      },
    });

  } catch (error) {
    console.error("GA4 callback error:", error);
    
    // Redirect with error
    const errorUrl = `${req.headers.get("origin") || "/"}/projects?ga4=error`;
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": errorUrl,
      },
    });
  }
});