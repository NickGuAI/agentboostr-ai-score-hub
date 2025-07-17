-- 插入测试项目数据
INSERT INTO public.projects (id, name, description, website_url, category, stage, owner_email) VALUES
('11111111-1111-1111-1111-111111111111', 'AI写作助手', '基于GPT的智能写作工具，帮助用户快速生成高质量内容', 'https://aiwriter.com', 'AI工具', 'growth', 'test1@example.com'),
('22222222-2222-2222-2222-222222222222', '效率管理器', '团队协作和项目管理的一站式解决方案', 'https://efficiency.app', '效率工具', 'scale', 'test2@example.com'),
('33333333-3333-3333-3333-333333333333', '代码审查工具', '自动化代码质量检测和安全漏洞扫描', 'https://codecheck.dev', '开发工具', 'mvp', 'test3@example.com'),
('44444444-4444-4444-4444-444444444444', '内容创作平台', '一站式视频和图片编辑工具', 'https://creative.studio', '内容创作', 'growth', 'test4@example.com'),
('55555555-5555-5555-5555-555555555555', '智能客服机器人', 'AI驱动的客户服务自动化解决方案', 'https://smartbot.ai', 'AI工具', 'idea', 'test5@example.com');

-- 插入测试Stripe连接数据
INSERT INTO public.stripe_connections (project_id, stripe_account_id, access_token, connected_at, last_sync_at, sync_status) VALUES
('11111111-1111-1111-1111-111111111111', 'acct_test1', 'sk_test_123456789', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 hour', 'success'),
('22222222-2222-2222-2222-222222222222', 'acct_test2', 'sk_test_987654321', NOW() - INTERVAL '60 days', NOW() - INTERVAL '2 hours', 'success'),
('33333333-3333-3333-3333-333333333333', 'acct_test3', 'sk_test_456789123', NOW() - INTERVAL '15 days', NOW() - INTERVAL '3 hours', 'success'),
('44444444-4444-4444-4444-444444444444', 'acct_test4', 'sk_test_789123456', NOW() - INTERVAL '45 days', NOW() - INTERVAL '1 hour', 'success');