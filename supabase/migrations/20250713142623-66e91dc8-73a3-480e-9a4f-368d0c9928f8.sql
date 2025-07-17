-- 插入测试财务指标数据
INSERT INTO public.financial_metrics (project_id, metric_date, mrr, arr, total_revenue, total_customers, active_customers, new_customers, churned_customers, mrr_growth_rate, customer_growth_rate, churn_rate, arpu, ltv, cac) VALUES
-- AI写作助手 (高表现项目)
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 12500, 150000, 12500, 320, 280, 45, 8, 25.5, 18.2, 2.8, 44.64, 1595, 35),
-- 效率管理器 (超高表现项目)
('22222222-2222-2222-2222-222222222222', CURRENT_DATE, 28900, 346800, 28900, 850, 780, 120, 15, 32.1, 15.4, 1.9, 37.05, 1950, 28),
-- 代码审查工具 (中等表现项目)
('33333333-3333-3333-3333-333333333333', CURRENT_DATE, 3200, 38400, 3200, 95, 85, 12, 5, 12.8, 14.1, 5.9, 37.65, 638, 55),
-- 内容创作平台 (高增长项目)
('44444444-4444-4444-4444-444444444444', CURRENT_DATE, 8750, 105000, 8750, 180, 160, 35, 8, 45.2, 28.0, 5.0, 54.69, 1094, 42),
-- 智能客服机器人 (早期项目)
('55555555-5555-5555-5555-555555555555', CURRENT_DATE, 450, 5400, 450, 25, 22, 8, 2, 80.0, 60.0, 9.1, 20.45, 225, 75);

-- 插入历史数据用于计算增长率
INSERT INTO public.financial_metrics (project_id, metric_date, mrr, active_customers) VALUES
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 month', 10000, 235),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 month', 21900, 675),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '1 month', 2840, 75),
('44444444-4444-4444-4444-444444444444', CURRENT_DATE - INTERVAL '1 month', 6020, 125),
('55555555-5555-5555-5555-555555555555', CURRENT_DATE - INTERVAL '1 month', 250, 14);