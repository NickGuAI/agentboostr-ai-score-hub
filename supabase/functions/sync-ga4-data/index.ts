import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-GA4-DATA] ${step}${detailsStr}`);
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
    logStep("Function started");

    const { projectId } = await req.json();
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    logStep("Fetching GA4 connection", { projectId });

    // Get GA4 connection details
    const { data: connection, error: connectionError } = await supabaseClient
      .from("ga4_connections")
      .select("*")
      .eq("project_id", projectId)
      .single();

    if (connectionError || !connection) {
      throw new Error("GA4 connection not found");
    }

    logStep("Connection found", { propertyId: connection.property_id });

    // Refresh token if needed
    let accessToken = connection.access_token;
    if (await isTokenExpired(accessToken)) {
      logStep("Refreshing access token");
      accessToken = await refreshAccessToken(connection.refresh_token);
      
      // Update token in database
      await supabaseClient
        .from("ga4_connections")
        .update({ access_token: accessToken })
        .eq("id", connection.id);
    }

    // Fetch GA4 data for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    logStep("Fetching GA4 analytics data", { 
      propertyId: connection.property_id,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    const analyticsData = await fetchGA4Data(
      accessToken,
      connection.property_id,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    logStep("Analytics data fetched", { rowCount: analyticsData.length });

    // Save data to database
    for (const dayData of analyticsData) {
      await supabaseClient
        .from("ga4_analytics_data")
        .upsert({
          project_id: projectId,
          ...dayData,
        }, { onConflict: 'project_id,data_date' });
    }

    // Update last sync time
    await supabaseClient
      .from("ga4_connections")
      .update({ 
        last_sync_at: new Date().toISOString(),
        sync_status: "success"
      })
      .eq("id", connection.id);

    logStep("Sync completed successfully");

    return new Response(JSON.stringify({ 
      success: true,
      syncedDays: analyticsData.length,
      lastSyncAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Error occurred", { error: error.message });
    
    // Update sync status to error
    const { projectId } = await req.json().catch(() => ({}));
    if (projectId) {
      await supabaseClient
        .from("ga4_connections")
        .update({ sync_status: "error" })
        .eq("project_id", projectId);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function isTokenExpired(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + accessToken
    );
    return !response.ok;
  } catch {
    return true;
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchGA4Data(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.rows || data.rows.length === 0) {
    return [];
  }

  return data.rows.map((row: any) => {
    const date = row.dimensionValues[0].value;
    const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    
    return {
      data_date: formattedDate,
      active_users: parseInt(row.metricValues[0].value) || 0,
      new_users: parseInt(row.metricValues[1].value) || 0,
      sessions: parseInt(row.metricValues[2].value) || 0,
      page_views: parseInt(row.metricValues[3].value) || 0,
      bounce_rate: parseFloat(row.metricValues[4].value) || 0,
      session_duration: parseFloat(row.metricValues[5].value) || 0,
      conversion_rate: 0, // Will be calculated based on goals if available
    };
  });
}