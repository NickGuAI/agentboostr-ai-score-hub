import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-AGENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role key to bypass RLS for secure writes
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { projectId, agentUrl, agentDescription, projectName } = await req.json();
    
    if (!projectId || !agentUrl) {
      throw new Error("ProjectId and agentUrl are required");
    }

    logStep("Analyzing agent", { projectId, agentUrl, projectName });

    // Simulate AI analysis (in a real implementation, this would call external APIs)
    const analysisResult = await simulateAgentAnalysis(agentUrl, agentDescription, projectName);
    
    logStep("Analysis completed", { score: analysisResult.total_score });

    // Insert mock financial metrics
    await supabaseClient.from("financial_metrics").upsert({
      project_id: projectId,
      metric_date: new Date().toISOString().split('T')[0],
      mrr: analysisResult.mockMetrics.mrr,
      arr: analysisResult.mockMetrics.arr,
      total_revenue: analysisResult.mockMetrics.totalRevenue,
      total_customers: analysisResult.mockMetrics.totalCustomers,
      active_customers: analysisResult.mockMetrics.activeCustomers,
      new_customers: analysisResult.mockMetrics.newCustomers,
      churned_customers: analysisResult.mockMetrics.churnedCustomers,
      mrr_growth_rate: analysisResult.mockMetrics.mrrGrowthRate,
      customer_growth_rate: analysisResult.mockMetrics.customerGrowthRate,
      churn_rate: analysisResult.mockMetrics.churnRate,
      arpu: analysisResult.mockMetrics.arpu,
      ltv: analysisResult.mockMetrics.ltv,
      cac: analysisResult.mockMetrics.cac,
    }, { onConflict: 'project_id,metric_date' });

    // Insert mock GA4 analytics data
    await supabaseClient.from("ga4_analytics_data").upsert({
      project_id: projectId,
      data_date: new Date().toISOString().split('T')[0],
      active_users: analysisResult.mockGA4.activeUsers,
      new_users: analysisResult.mockGA4.newUsers,
      sessions: analysisResult.mockGA4.sessions,
      page_views: analysisResult.mockGA4.pageViews,
      bounce_rate: analysisResult.mockGA4.bounceRate,
      session_duration: analysisResult.mockGA4.sessionDuration,
      conversion_rate: analysisResult.mockGA4.conversionRate,
      top_pages: analysisResult.mockGA4.topPages,
      traffic_sources: analysisResult.mockGA4.trafficSources,
      device_breakdown: analysisResult.mockGA4.deviceBreakdown,
    }, { onConflict: 'project_id,data_date' });

    // Insert evaluation results
    await supabaseClient.from("evaluation_results").insert({
      project_id: projectId,
      evaluation_date: new Date().toISOString().split('T')[0],
      business_health_score: analysisResult.business_health_score,
      user_engagement_score: analysisResult.user_engagement_score,
      market_validation_score: analysisResult.market_validation_score,
      growth_potential_score: analysisResult.growth_potential_score,
      total_score: analysisResult.total_score,
      grade: analysisResult.grade,
      percentile: analysisResult.percentile,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      recommendations: analysisResult.recommendations,
      report_data: {
        analysis_type: "ai_automated",
        agent_url: agentUrl,
        agent_description: agentDescription,
        analysis_timestamp: new Date().toISOString()
      }
    });

    logStep("Data inserted successfully");

    return new Response(JSON.stringify({
      success: true,
      total_score: analysisResult.total_score,
      grade: analysisResult.grade,
      percentile: analysisResult.percentile
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in analyze-agent", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Simulate AI analysis based on agent URL and description
async function simulateAgentAnalysis(agentUrl: string, agentDescription?: string, projectName?: string) {
  // Generate realistic but randomized scores based on URL characteristics
  const urlLower = agentUrl.toLowerCase();
  const hasHTTPS = agentUrl.startsWith('https://');
  const hasCustomDomain = !urlLower.includes('localhost') && !urlLower.includes('127.0.0.1');
  const hasDescription = Boolean(agentDescription && agentDescription.length > 10);

  // Base score calculation
  let baseScore = 60;
  if (hasHTTPS) baseScore += 10;
  if (hasCustomDomain) baseScore += 10;
  if (hasDescription) baseScore += 5;

  // Add some randomization
  const randomFactor = Math.random() * 20 - 10; // -10 to +10
  const totalScore = Math.max(40, Math.min(95, baseScore + randomFactor));

  // Calculate sub-scores
  const businessHealthScore = Math.max(30, Math.min(100, totalScore + Math.random() * 20 - 10));
  const userEngagementScore = Math.max(30, Math.min(100, totalScore + Math.random() * 20 - 10));
  const marketValidationScore = Math.max(30, Math.min(100, totalScore + Math.random() * 20 - 10));
  const growthPotentialScore = Math.max(30, Math.min(100, totalScore + Math.random() * 20 - 10));

  // Determine grade
  let grade = 'D';
  if (totalScore >= 90) grade = 'S';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 60) grade = 'C';

  // Calculate percentile
  const percentile = Math.round(totalScore * 0.8 + Math.random() * 20);

  // Generate insights based on score
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  if (hasHTTPS) {
    strengths.push("使用HTTPS加密，保障用户数据安全");
  } else {
    weaknesses.push("未使用HTTPS加密，存在安全风险");
    recommendations.push("建议启用HTTPS加密以提升用户信任度");
  }

  if (hasCustomDomain) {
    strengths.push("使用自定义域名，品牌形象专业");
  } else {
    recommendations.push("建议使用自定义域名提升品牌专业度");
  }

  if (totalScore >= 80) {
    strengths.push("整体用户体验优秀");
    strengths.push("具备良好的商业化潜力");
  } else if (totalScore >= 60) {
    strengths.push("基础功能完备");
    recommendations.push("优化用户界面和交互体验");
  } else {
    weaknesses.push("用户体验有待提升");
    recommendations.push("需要重新设计核心功能流程");
  }

  // Generate mock metrics based on score
  const mockMetrics = {
    mrr: Math.round((totalScore / 100) * 5000 + Math.random() * 3000),
    arr: 0,
    totalRevenue: Math.round((totalScore / 100) * 25000 + Math.random() * 15000),
    totalCustomers: Math.round((totalScore / 100) * 200 + Math.random() * 100),
    activeCustomers: Math.round((totalScore / 100) * 180 + Math.random() * 90),
    newCustomers: Math.round((totalScore / 100) * 25 + Math.random() * 15),
    churnedCustomers: Math.round((totalScore / 100) * 5 + Math.random() * 8),
    mrrGrowthRate: (totalScore / 100) * 15 + Math.random() * 10 - 5,
    customerGrowthRate: (totalScore / 100) * 12 + Math.random() * 8,
    churnRate: Math.max(1, 10 - (totalScore / 100) * 8 + Math.random() * 4),
    arpu: Math.round((totalScore / 100) * 80 + Math.random() * 40),
    ltv: Math.round((totalScore / 100) * 1500 + Math.random() * 800),
    cac: Math.round(200 - (totalScore / 100) * 100 + Math.random() * 100),
  };

  mockMetrics.arr = mockMetrics.mrr * 12;

  const mockGA4 = {
    activeUsers: Math.round((totalScore / 100) * 2000 + Math.random() * 1000),
    newUsers: Math.round((totalScore / 100) * 500 + Math.random() * 300),
    sessions: Math.round((totalScore / 100) * 3000 + Math.random() * 1500),
    pageViews: Math.round((totalScore / 100) * 8000 + Math.random() * 4000),
    bounceRate: Math.max(20, 80 - (totalScore / 100) * 40 + Math.random() * 20),
    sessionDuration: (totalScore / 100) * 180 + Math.random() * 120,
    conversionRate: (totalScore / 100) * 5 + Math.random() * 3,
    topPages: [
      { page: "/", views: Math.round(1000 + Math.random() * 500) },
      { page: "/features", views: Math.round(500 + Math.random() * 300) },
      { page: "/pricing", views: Math.round(300 + Math.random() * 200) }
    ],
    trafficSources: [
      { source: "direct", percentage: 40 + Math.random() * 20 },
      { source: "organic", percentage: 30 + Math.random() * 15 },
      { source: "social", percentage: 20 + Math.random() * 10 }
    ],
    deviceBreakdown: [
      { device: "desktop", percentage: 60 + Math.random() * 20 },
      { device: "mobile", percentage: 35 + Math.random() * 15 },
      { device: "tablet", percentage: 5 + Math.random() * 5 }
    ]
  };

  return {
    total_score: Math.round(totalScore),
    business_health_score: Math.round(businessHealthScore),
    user_engagement_score: Math.round(userEngagementScore),
    market_validation_score: Math.round(marketValidationScore),
    growth_potential_score: Math.round(growthPotentialScore),
    grade,
    percentile,
    strengths,
    weaknesses,
    recommendations,
    mockMetrics,
    mockGA4
  };
}