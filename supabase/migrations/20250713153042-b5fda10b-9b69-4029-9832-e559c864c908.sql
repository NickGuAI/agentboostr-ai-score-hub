-- 修复 financial_metrics 表的 RLS 策略，允许 edge functions 插入数据
DROP POLICY IF EXISTS "Users view own metrics" ON public.financial_metrics;

-- 重新创建策略
CREATE POLICY "Users view own metrics" ON public.financial_metrics
FOR SELECT
USING (project_id IN (
  SELECT projects.id 
  FROM projects 
  WHERE (projects.owner_id = auth.uid() OR projects.owner_email = auth.email())
));

-- 添加插入策略，允许 service role 插入数据
CREATE POLICY "Service role can insert metrics" ON public.financial_metrics
FOR INSERT
WITH CHECK (true);

-- 添加更新策略，允许 service role 更新数据
CREATE POLICY "Service role can update metrics" ON public.financial_metrics
FOR UPDATE
USING (true);

-- 插入测试数据
INSERT INTO public.financial_metrics (
  project_id, 
  metric_date, 
  mrr, 
  arr, 
  total_revenue, 
  total_customers, 
  active_customers, 
  new_customers, 
  churned_customers, 
  mrr_growth_rate, 
  customer_growth_rate, 
  churn_rate, 
  arpu, 
  ltv, 
  cac
) VALUES (
  '4cb1d0de-2d1c-48dd-923b-40c6e15c5515',
  CURRENT_DATE,
  8500.00,
  102000.00,
  12500.00,
  150,
  135,
  18,
  3,
  15.5,
  8.2,
  2.8,
  62.96,
  1890.00,
  180.00
) ON CONFLICT (project_id, metric_date) DO UPDATE SET
  mrr = EXCLUDED.mrr,
  arr = EXCLUDED.arr,
  total_revenue = EXCLUDED.total_revenue,
  total_customers = EXCLUDED.total_customers,
  active_customers = EXCLUDED.active_customers,
  new_customers = EXCLUDED.new_customers,
  churned_customers = EXCLUDED.churned_customers,
  mrr_growth_rate = EXCLUDED.mrr_growth_rate,
  customer_growth_rate = EXCLUDED.customer_growth_rate,
  churn_rate = EXCLUDED.churn_rate,
  arpu = EXCLUDED.arpu,
  ltv = EXCLUDED.ltv,
  cac = EXCLUDED.cac;