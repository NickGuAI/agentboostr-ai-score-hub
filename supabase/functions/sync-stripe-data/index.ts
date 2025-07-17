import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from 'https://esm.sh/stripe@13.0.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 获取Stripe连接信息
    const { data: connection, error: connError } = await supabase
      .from('stripe_connections')
      .select('*')
      .eq('project_id', projectId)
      .single()

    if (connError || !connection) {
      throw new Error('Stripe not connected')
    }

    // 初始化Stripe客户端
    const stripe = new Stripe(connection.access_token, {
      apiVersion: '2023-10-16',
      stripeAccount: connection.stripe_account_id,
    })

    // 获取当前日期
    const now = new Date()
    const currentMonth = now.toISOString().slice(0, 7)
    
    // 1. 获取所有活跃订阅计算MRR
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
    })

    let mrr = 0
    const monthlySubscriptions = subscriptions.data.filter(sub => {
      const interval = sub.items.data[0]?.price?.recurring?.interval
      return interval === 'month'
    })

    monthlySubscriptions.forEach(sub => {
      mrr += (sub.items.data[0]?.price?.unit_amount || 0) / 100
    })

    // 处理年付订阅
    const yearlySubscriptions = subscriptions.data.filter(sub => {
      const interval = sub.items.data[0]?.price?.recurring?.interval
      return interval === 'year'
    })

    yearlySubscriptions.forEach(sub => {
      const yearlyAmount = (sub.items.data[0]?.price?.unit_amount || 0) / 100
      mrr += yearlyAmount / 12
    })

    // 2. 获取客户数据
    const customers = await stripe.customers.list({
      limit: 100,
    })

    const activeCustomers = customers.data.filter(c => 
      c.subscriptions?.data?.some(s => s.status === 'active')
    ).length

    // 3. 计算增长率（需要历史数据）
    const { data: lastMonthMetrics } = await supabase
      .from('financial_metrics')
      .select('mrr, active_customers')
      .eq('project_id', projectId)
      .order('metric_date', { ascending: false })
      .limit(1)
      .single()

    const mrrGrowthRate = lastMonthMetrics?.mrr 
      ? ((mrr - lastMonthMetrics.mrr) / lastMonthMetrics.mrr) * 100
      : 0

    // 4. 计算流失率
    const churnedCount = lastMonthMetrics?.active_customers 
      ? Math.max(0, lastMonthMetrics.active_customers - activeCustomers)
      : 0
    
    const churnRate = lastMonthMetrics?.active_customers
      ? (churnedCount / lastMonthMetrics.active_customers) * 100
      : 0

    // 5. 保存财务指标
    const { error: metricsError } = await supabase
      .from('financial_metrics')
      .upsert({
        project_id: projectId,
        metric_date: now.toISOString().slice(0, 10),
        mrr,
        arr: mrr * 12,
        total_revenue: mrr, // 简化处理
        total_customers: customers.data.length,
        active_customers: activeCustomers,
        new_customers: Math.max(0, activeCustomers - (lastMonthMetrics?.active_customers || 0)),
        churned_customers: churnedCount,
        mrr_growth_rate: mrrGrowthRate,
        customer_growth_rate: lastMonthMetrics?.active_customers 
          ? ((activeCustomers - lastMonthMetrics.active_customers) / lastMonthMetrics.active_customers) * 100
          : 0,
        churn_rate: churnRate,
        arpu: activeCustomers > 0 ? mrr / activeCustomers : 0,
        ltv: churnRate > 0 ? (mrr / activeCustomers) / (churnRate / 100) : 0,
        cac: 50, // 暂时硬编码，实际需要从广告数据获取
      })

    if (metricsError) throw metricsError

    // 6. 更新同步状态
    await supabase
      .from('stripe_connections')
      .update({ 
        last_sync_at: now.toISOString(),
        sync_status: 'success'
      })
      .eq('project_id', projectId)

    // 7. 触发评分计算
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-score`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId }),
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        metrics: { mrr, activeCustomers, mrrGrowthRate, churnRate }
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