-- 插入测试项目数据
INSERT INTO public.projects (id, name, description, website_url, category, stage, owner_email) VALUES
('11111111-1111-1111-1111-111111111111', 'AI写作助手', '基于GPT的智能写作工具，帮助用户快速生成高质量内容', 'https://aiwriter.com', 'AI工具', 'growth', 'test1@example.com'),
('22222222-2222-2222-2222-222222222222', '效率管理器', '团队协作和项目管理的一站式解决方案', 'https://efficiency.app', '效率工具', 'scale', 'test2@example.com'),
('33333333-3333-3333-3333-333333333333', '代码审查工具', '自动化代码质量检测和安全漏洞扫描', 'https://codecheck.dev', '开发工具', 'mvp', 'test3@example.com'),
('44444444-4444-4444-4444-444444444444', '内容创作平台', '一站式视频和图片编辑工具', 'https://creative.studio', '内容创作', 'growth', 'test4@example.com'),
('55555555-5555-5555-5555-555555555555', '智能客服机器人', 'AI驱动的客户服务自动化解决方案', 'https://smartbot.ai', 'AI工具', 'idea', 'test5@example.com');

-- 插入测试Stripe连接数据
INSERT INTO public.stripe_connections (id, project_id, stripe_account_id, access_token, connected_at, last_sync_at, sync_status) VALUES
('conn1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'acct_test1', 'sk_test_123456789', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 hour', 'success'),
('conn2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'acct_test2', 'sk_test_987654321', NOW() - INTERVAL '60 days', NOW() - INTERVAL '2 hours', 'success'),
('conn3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'acct_test3', 'sk_test_456789123', NOW() - INTERVAL '15 days', NOW() - INTERVAL '3 hours', 'success'),
('conn4444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'acct_test4', 'sk_test_789123456', NOW() - INTERVAL '45 days', NOW() - INTERVAL '1 hour', 'success');

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

-- 插入测试评估结果数据
INSERT INTO public.evaluation_results (
  project_id, 
  evaluation_date, 
  business_health_score, 
  user_engagement_score, 
  market_validation_score, 
  growth_potential_score, 
  total_score, 
  grade, 
  percentile,
  strengths,
  weaknesses,
  recommendations
) VALUES
-- AI写作助手 (A级项目)
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 28, 22, 14, 21, 85, 'A', 92,
ARRAY['月收入已达到$12500，商业模式得到验证', '增长势头强劲，月增长率超过20%', '用户留存良好，流失率控制在5%以内'],
ARRAY['需要进一步优化获客成本'],
ARRAY['建议加强品牌建设，提高市场占有率', '探索企业级客户，提高客单价']),

-- 效率管理器 (S级项目)
('22222222-2222-2222-2222-222222222222', CURRENT_DATE, 30, 25, 15, 25, 95, 'S', 98,
ARRAY['月收入已达到$28900，商业模式得到验证', '增长势头强劲，月增长率超过20%', '用户留存良好，流失率控制在5%以内', '单位经济模型健康，LTV/CAC比率大于3'],
ARRAY[],
ARRAY['考虑国际化扩张', '开发更多高价值功能模块']),

-- 代码审查工具 (B级项目)
('33333333-3333-3333-3333-333333333333', CURRENT_DATE, 18, 15, 10, 15, 73, 'B', 65,
ARRAY['产品市场适配度良好'],
ARRAY['增长缓慢，需要优化增长策略', '用户流失率偏高，需要改善产品体验'],
ARRAY['建议优化定价策略，测试不同价格点', '深入分析用户流失原因，改善产品体验']),

-- 内容创作平台 (A级项目)
('44444444-4444-4444-4444-444444444444', CURRENT_DATE, 25, 20, 13, 24, 82, 'A', 88,
ARRAY['增长势头强劲，月增长率超过20%', '客单价较高，ARPU达到$54'],
ARRAY['用户基数还需要扩大'],
ARRAY['加强营销投入，扩大获客渠道', '优化产品定价层级，满足不同用户需求']),

-- 智能客服机器人 (C级项目)
('55555555-5555-5555-5555-555555555555', CURRENT_DATE, 12, 8, 6, 18, 44, 'C', 25,
ARRAY['处于早期阶段，增长潜力巨大'],
ARRAY['收入规模偏小，需要加速增长', '用户基数较小，需要扩大获客', '用户流失率偏高，需要改善产品体验'],
ARRAY['建议优化定价策略，测试不同价格点', '加强营销投入，扩大获客渠道', '深入分析用户流失原因，改善产品体验', '建立用户成功体系，提高用户留存']);