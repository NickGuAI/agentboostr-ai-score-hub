import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { projectId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 获取最新的财务数据
    const { data: metrics, error: metricsError } = await supabase
      .from('financial_metrics')
      .select('*')
      .eq('project_id', projectId)
      .order('metric_date', { ascending: false })
      .limit(1)
      .single()

    if (metricsError || !metrics) {
      throw new Error('No metrics found')
    }

    // 获取项目信息
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    // 获取GA4数据
    const { data: ga4Data } = await supabase
      .from('ga4_analytics_data')
      .select('*')
      .eq('project_id', projectId)
      .order('data_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 2C Agent投资评估框架评分算法
    let scores = {
      user_value_realization: 0,      // 用户价值实现 (30分)
      product_market_fit: 0,          // 产品市场契合度 (25分)
      technical_moat: 0,              // 技术护城河 (20分)
      business_model_health: 0,       // 商业模式健康度 (10分)
      execution_risk: 0,              // 执行风险评估 (15分)
    }

    // 1. 用户价值实现 (30分)
    // 1.1 用户留存率 & 使用频次 (10分)
    const retention_rate = metrics.churn_rate ? (100 - metrics.churn_rate) : 0
    if (retention_rate >= 95) scores.user_value_realization += 10
    else if (retention_rate >= 90) scores.user_value_realization += 8
    else if (retention_rate >= 80) scores.user_value_realization += 6
    else if (retention_rate >= 70) scores.user_value_realization += 4
    else if (retention_rate >= 60) scores.user_value_realization += 2
    else scores.user_value_realization += 0

    // 1.2 付费转化率 & ARPU增长 (10分)
    const arpu_growth = metrics.arpu || 0
    if (arpu_growth >= 200) scores.user_value_realization += 10
    else if (arpu_growth >= 100) scores.user_value_realization += 8
    else if (arpu_growth >= 50) scores.user_value_realization += 6
    else if (arpu_growth >= 20) scores.user_value_realization += 4
    else if (arpu_growth >= 10) scores.user_value_realization += 2
    else scores.user_value_realization += 0

    // 1.3 用户生命周期价值 (10分)
    const ltvCacRatio = metrics.cac > 0 ? metrics.ltv / metrics.cac : 0
    if (ltvCacRatio >= 5) scores.user_value_realization += 10
    else if (ltvCacRatio >= 3) scores.user_value_realization += 8
    else if (ltvCacRatio >= 2) scores.user_value_realization += 6
    else if (ltvCacRatio >= 1.5) scores.user_value_realization += 4
    else if (ltvCacRatio >= 1) scores.user_value_realization += 2
    else scores.user_value_realization += 0

    // 2. 产品市场契合度 (25分)
    // 2.1 有机增长率 (10分)
    if (metrics.mrr_growth_rate >= 50) scores.product_market_fit += 10
    else if (metrics.mrr_growth_rate >= 30) scores.product_market_fit += 8
    else if (metrics.mrr_growth_rate >= 20) scores.product_market_fit += 6
    else if (metrics.mrr_growth_rate >= 10) scores.product_market_fit += 4
    else if (metrics.mrr_growth_rate >= 5) scores.product_market_fit += 2
    else scores.product_market_fit += 0

    // 2.2 用户推荐意愿 (5分) - 基于用户增长和活跃度
    const customer_growth = metrics.customer_growth_rate || 0
    if (customer_growth >= 30) scores.product_market_fit += 5
    else if (customer_growth >= 20) scores.product_market_fit += 4
    else if (customer_growth >= 10) scores.product_market_fit += 3
    else if (customer_growth >= 5) scores.product_market_fit += 2
    else scores.product_market_fit += 0

    // 2.3 市场渗透率 (10分) - 基于收入规模
    if (metrics.mrr >= 100000) scores.product_market_fit += 10
    else if (metrics.mrr >= 50000) scores.product_market_fit += 8
    else if (metrics.mrr >= 20000) scores.product_market_fit += 6
    else if (metrics.mrr >= 10000) scores.product_market_fit += 4
    else if (metrics.mrr >= 5000) scores.product_market_fit += 2
    else scores.product_market_fit += 0

    // 3. 技术护城河 (20分)
    // 3.1 AI能力差异化 (8分) - 基于转化率和用户留存
    const conversion_rate = ga4Data?.conversion_rate || 0
    if (conversion_rate >= 10) scores.technical_moat += 8
    else if (conversion_rate >= 5) scores.technical_moat += 6
    else if (conversion_rate >= 3) scores.technical_moat += 4
    else if (conversion_rate >= 1) scores.technical_moat += 2
    else scores.technical_moat += 0

    // 3.2 数据飞轮效应 (8分) - 基于活跃用户规模
    const active_users = ga4Data?.active_users || 0
    if (active_users >= 10000) scores.technical_moat += 8
    else if (active_users >= 5000) scores.technical_moat += 6
    else if (active_users >= 1000) scores.technical_moat += 4
    else if (active_users >= 500) scores.technical_moat += 2
    else scores.technical_moat += 0

    // 3.3 技术栈可扩展性 (4分) - 基于系统稳定性指标
    const sessions = ga4Data?.sessions || 0
    if (sessions >= 50000) scores.technical_moat += 4
    else if (sessions >= 20000) scores.technical_moat += 3
    else if (sessions >= 10000) scores.technical_moat += 2
    else if (sessions >= 1000) scores.technical_moat += 1
    else scores.technical_moat += 0

    // 4. 商业模式健康度 (10分)
    // 4.1 单位经济模型 (5分) - 基于ARPU
    const arpu = metrics.arpu || 0
    if (arpu >= 100) scores.business_model_health += 5
    else if (arpu >= 50) scores.business_model_health += 4
    else if (arpu >= 30) scores.business_model_health += 3
    else if (arpu >= 20) scores.business_model_health += 2
    else if (arpu >= 10) scores.business_model_health += 1
    else scores.business_model_health += 0

    // 4.2 现金流转正路径 (5分) - 基于MRR规模
    if (metrics.mrr >= 10000) scores.business_model_health += 5
    else if (metrics.mrr >= 5000) scores.business_model_health += 4
    else if (metrics.mrr >= 2000) scores.business_model_health += 3
    else if (metrics.mrr >= 1000) scores.business_model_health += 2
    else if (metrics.mrr >= 500) scores.business_model_health += 1
    else scores.business_model_health += 0

    // 5. 执行风险评估 (15分)
    // 5.1 团队执行力 (8分) - 基于增长稳定性
    const growth_stability = metrics.mrr_growth_rate >= 0 ? 1 : 0
    const has_customers = metrics.active_customers > 0 ? 1 : 0
    const has_revenue = metrics.mrr > 0 ? 1 : 0
    const execution_score = (growth_stability + has_customers + has_revenue) * 2.67
    scores.execution_risk += Math.round(execution_score)

    // 5.2 资源配置效率 (4分) - 基于CAC控制
    const cac = metrics.cac || 0
    if (cac > 0 && cac <= 100) scores.execution_risk += 4
    else if (cac <= 200) scores.execution_risk += 3
    else if (cac <= 500) scores.execution_risk += 2
    else if (cac <= 1000) scores.execution_risk += 1
    else scores.execution_risk += 0

    // 5.3 技术依赖风险 (3分) - 基于数据多样性
    const has_stripe = metrics.mrr > 0 ? 1 : 0
    const has_ga4 = ga4Data ? 1 : 0
    const has_multiple_metrics = metrics.active_customers > 0 && metrics.new_customers > 0 ? 1 : 0
    const diversification_score = (has_stripe + has_ga4 + has_multiple_metrics)
    scores.execution_risk += diversification_score

    // 计算总分
    const totalScore = scores.user_value_realization + scores.product_market_fit + 
                      scores.technical_moat + scores.business_model_health + scores.execution_risk

    // 确定等级
    let grade = 'D'
    if (totalScore >= 90) grade = 'S'
    else if (totalScore >= 80) grade = 'A'
    else if (totalScore >= 70) grade = 'B'
    else if (totalScore >= 60) grade = 'C'

    // 生成优缺点分析
    const strengths = []
    const weaknesses = []
    const recommendations = []

    // 分析优势
    if (scores.user_value_realization >= 25) strengths.push('用户价值实现度高，留存率和ARPU表现优异')
    if (scores.product_market_fit >= 20) strengths.push('产品市场契合度强，增长势头良好')
    if (scores.technical_moat >= 15) strengths.push('技术护城河稳固，AI能力差异化明显')
    if (scores.business_model_health >= 8) strengths.push('商业模式健康，单位经济模型清晰')
    if (scores.execution_risk >= 12) strengths.push('执行风险较低，团队执行力强')

    // 分析劣势
    if (scores.user_value_realization < 15) weaknesses.push('用户价值实现不足，需要提升留存率和付费转化')
    if (scores.product_market_fit < 12) weaknesses.push('产品市场契合度有待提升，增长缓慢')
    if (scores.technical_moat < 10) weaknesses.push('技术护城河薄弱，缺乏差异化竞争优势')
    if (scores.business_model_health < 5) weaknesses.push('商业模式健康度低，盈利能力不足')
    if (scores.execution_risk < 8) weaknesses.push('执行风险高，需要加强团队建设和资源配置')

    // 生成建议
    if (scores.user_value_realization < 20) {
      recommendations.push('深入分析用户使用路径，优化产品核心功能')
      recommendations.push('建立用户成功体系，提高用户留存和付费转化')
    }
    if (scores.product_market_fit < 15) {
      recommendations.push('加强市场调研，明确目标用户群体')
      recommendations.push('优化产品定位，提升用户推荐意愿')
    }
    if (scores.technical_moat < 12) {
      recommendations.push('加大AI技术投入，构建数据飞轮效应')
      recommendations.push('优化算法模型，提升产品智能化水平')
    }
    if (scores.business_model_health < 6) {
      recommendations.push('优化定价策略，提升ARPU和单位经济效益')
      recommendations.push('多元化收入来源，加速现金流转正')
    }
    if (scores.execution_risk < 10) {
      recommendations.push('加强团队AI/产品背景建设')
      recommendations.push('优化资源配置，降低技术依赖风险')
    }

    // 计算百分位（简化处理）
    const { data: allScores } = await supabase
      .from('evaluation_results')
      .select('total_score')
      .order('total_score', { ascending: false })

    const percentile = allScores?.length 
      ? Math.round((allScores.filter(s => s.total_score < totalScore).length / allScores.length) * 100)
      : 50

    // 保存评估结果
    const { error: evalError } = await supabase
      .from('evaluation_results')
      .upsert({
        project_id: projectId,
        business_health_score: scores.business_model_health,
        user_engagement_score: scores.user_value_realization,
        market_validation_score: scores.product_market_fit,
        growth_potential_score: scores.technical_moat,
        total_score: totalScore,
        grade,
        percentile,
        strengths,
        weaknesses,
        recommendations,
        report_data: {
          metrics,
          ga4Data,
          scores,
          weights: {
            user_value_realization: 30,
            product_market_fit: 25,
            technical_moat: 20,
            business_model_health: 10,
            execution_risk: 15
          },
          analysis: {
            ltv_cac_ratio: ltvCacRatio,
            retention_rate: retention_rate,
            conversion_rate: conversion_rate,
            arpu: arpu,
            active_users: active_users,
            customer_growth: customer_growth,
            execution_score: execution_score,
            diversification_score: diversification_score
          }
        }
      })

    if (evalError) throw evalError

    return new Response(
      JSON.stringify({ 
        success: true,
        score: totalScore,
        grade,
        percentile,
        strengths,
        weaknesses,
        recommendations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

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