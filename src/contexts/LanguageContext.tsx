import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // Header
    'nav.features': '功能特性',
    'nav.how-it-works': '工作流程',
    'nav.agent-score': 'Agent Score',
    'nav.pricing': '定价方案',
    'nav.case-studies': '客户案例',
    'nav.projects': '项目列表',
    'nav.leaderboard': '排行榜',
    'nav.login': '登录',
    'nav.free-trial': '免费试用',
    
    // Hero Section
    'hero.badge': 'AI原生孵化器平台',
    'hero.title1': 'AI原生孵化器',
    'hero.title2': '让数据驱动你的创业成功',
    'hero.subtitle': '连接Stripe与Google Analytics，自动生成Agent Score，智能分配广告投放额度',
    'hero.cta1': '免费获取Agent Score',
    'hero.cta2': '观看演示',
    'hero.feature1.title': '智能数据集成',
    'hero.feature1.desc': '自动连接Stripe和GA4，实时同步业务数据',
    'hero.feature2.title': 'AI驱动评分',
    'hero.feature2.desc': '基于多维度数据生成专业Agent Score',
    'hero.feature3.title': '智能投放优化',
    'hero.feature3.desc': '自动分配广告预算，最大化ROI',
    
    // Features Section
    'features.badge': '核心功能',
    'features.title': '全面的数据驱动解决方案',
    'features.subtitle': '从数据集成到智能分析，从评分系统到投放优化，一站式解决创业过程中的关键环节',
    'features.stripe.title': 'Stripe数据集成',
    'features.stripe.desc': '自动连接Stripe账户，实时获取支付数据、MRR/ARR指标和客户数据',
    'features.ga.title': 'Google Analytics 4',
    'features.ga.desc': '深度集成GA4，获取流量数据、用户行为分析和转化漏斗',
    'features.score.title': 'Agent Score评估',
    'features.score.desc': '基于收入健康度、流量质量和产品成熟度的AI智能评分系统',
    'features.ads.title': '智能广告分配',
    'features.ads.desc': '基于Agent Score自动计算最优广告预算和渠道分配策略',
    'features.investment.title': '投资生态连接',
    'features.investment.desc': '连接a2aX Fund和Taihill Venture，为高分项目提供投资机会',
    'features.security.title': '企业级安全',
    'features.security.desc': 'GDPR合规、HTTPS加密传输、敏感数据AES-256加密存储',
    
    // Agent Score Section
    'agent-score.badge': 'Agent Score',
    'agent-score.title': '数据驱动的智能评分系统',
    'agent-score.subtitle': '基于2C Agent投资评估框架，AI自动生成专业评分',
    'agent-score.user-value.title': '用户价值实现',
    'agent-score.user-value.description': '评估用户留存率、使用频次、付费转化率及生命周期价值',
    'agent-score.user-value.retention': '用户留存率: 92%',
    'agent-score.user-value.conversion': '付费转化率: 8.5%',
    'agent-score.user-value.ltv': 'LTV/CAC 比率: 3.2x',
    'agent-score.market-fit.title': '产品市场契合度',
    'agent-score.market-fit.description': '衡量有机增长率、用户推荐意愿及市场渗透率',
    'agent-score.market-fit.growth': '有机增长率: +25%',
    'agent-score.market-fit.nps': '用户推荐意愿: 68 NPS',
    'agent-score.market-fit.penetration': '市场渗透率: 12%',
    'agent-score.technical-moat.title': '技术护城河',
    'agent-score.technical-moat.description': '评估AI能力差异化、数据飞轮效应及技术栈可扩展性',
    'agent-score.technical-moat.ai-capability': 'AI差异化程度: 高',
    'agent-score.technical-moat.data-flywheel': '数据飞轮效应: 运行中',
    'agent-score.technical-moat.scalability': '技术栈扩展性: 优秀',
    'agent-score.business-health.title': '商业模式健康度',
    'agent-score.business-health.description': '分析单位经济模型和现金流转正路径',
    'agent-score.business-health.unit-economics': '单位经济模型: 健康',
    'agent-score.business-health.cashflow': '现金流转正: 预计6个月',
    'agent-score.execution-risk.title': '执行风险评估',
    'agent-score.execution-risk.description': '评估团队执行力、资源配置效率及合规风险',
    'agent-score.execution-risk.team': '团队AI背景: 强',
    'agent-score.execution-risk.resources': '资源配置效率: 优',
    'agent-score.execution-risk.compliance': '合规风险: 低',
    
    // How It Works Section
    'how-it-works.badge': '工作流程',
    'how-it-works.title': '四步完成智能化创业升级',
    'how-it-works.subtitle': '从数据连接到智能投放，全自动化流程让你专注于产品创新',
    'how-it-works.step1.title': '连接数据源',
    'how-it-works.step1.desc': '安全连接Stripe和Google Analytics 4，自动同步业务数据',
    'how-it-works.step2.title': '生成Agent Score',
    'how-it-works.step2.desc': 'AI分析收入、流量、产品数据，生成专业评分报告',
    'how-it-works.step3.title': '获得投放建议',
    'how-it-works.step3.desc': '基于评分智能计算广告预算和渠道分配策略',
    'how-it-works.step4.title': '连接投资生态',
    'how-it-works.step4.desc': '高分项目自动匹配投资机会，加速成长',
    
    // CTA Section
    'cta.badge': '限时免费体验',
    'cta.title': '开启你的AI驱动创业之旅',
    'cta.subtitle': '加入500+创业团队的选择，让数据驱动你的成功。立即获取免费Agent Score评估，解锁智能增长策略。',
    'cta.benefit1': '免费Agent Score评估',
    'cta.benefit2': '完整数据分析报告',
    'cta.benefit3': '投放策略建议',
    'cta.benefit4': '投资机会匹配',
    'cta.benefit5': '7天免费试用',
    'cta.benefit6': '专业客户支持',
    'cta.button1': '免费获取Agent Score',
    'cta.button2': '联系销售团队',
    'cta.metric1': '500+',
    'cta.metric1.label': '创业团队',
    'cta.metric2': '3.2x',
    'cta.metric2.label': '平均ROI提升',
    'cta.metric3': '4.8/5',
    'cta.metric3.label': '用户评分',
    'cta.partners': '投资生态合作伙伴',
    
    // Navigation
    'nav.back': '返回上一页',
    'nav.home': '返回主页',
    
    // Pricing
    'pricing.title': '选择适合您的方案',
    'pricing.subtitle': '从免费开始，随着业务增长选择更高级的功能',
    'pricing.popular': '推荐',
    'pricing.lite.name': '📦 Lite Start Here. No Commitment.',
    'pricing.lite.price': '免费 / Free',
    'pricing.lite.description': '无需信用卡',
    'pricing.lite.feature1': '✅ Agent 评分入门报告',
    'pricing.lite.feature2': '✅ 上传一次路演视频（默认社群可见）',
    'pricing.lite.feature3': '✅ 基础融资推荐',
    'pricing.lite.cta': '立即试用',
    'pricing.basic.name': '🧪 Basic Growth Warm-up Tier',
    'pricing.basic.price': '$29 /月',
    'pricing.basic.description': '',
    'pricing.basic.feature1': '✅ Lite 全部功能',
    'pricing.basic.feature2': '✅ 视频权限控制（私享 / 精选曝光）',
    'pricing.basic.feature3': '✅ 完整融资推荐报告',
    'pricing.basic.feature4': '✅ 数据图表预览',
    'pricing.basic.cta': '了解 Basic',
    'pricing.pro.name': '🚀 ⭐ Pro（推荐） Full Growth Suite',
    'pricing.pro.price': '$149 /月或 $1,490 / 年',
    'pricing.pro.description': '',
    'pricing.pro.feature1': '✅ 全功能评分系统 & 趋势分析',
    'pricing.pro.feature2': '✅ CMO Agent • 自动投放 & 最高 3× ROAS 优化',
    'pricing.pro.feature3': '✅ 虚拟卡支出控制 + 实时 ROI Dashboard',
    'pricing.pro.feature4': '✅ 每周成长报告 & 个性化建议',
    'pricing.pro.cta': '立即升级 Pro 🚀',
    'pricing.footer.line1': '体验孵化器价值，零门槛上手',
    'pricing.footer.line2': '评估增长潜力，随时可升级',
    'pricing.footer.line3': '平均每天 < $5，解锁融资 + 增长闭环',
    
    // Footer
    'footer.description': 'AI原生孵化器平台，连接数据，驱动增长，成就创业梦想。',
    'footer.product': '产品功能',
    'footer.product.integration': '数据集成',
    'footer.product.score': 'Agent Score',
    'footer.product.ads': '智能投放',
    'footer.product.investment': '投资对接',
    'footer.company': '关于我们',
    'footer.company.about': '关于Agentboostr',
    'footer.company.contact': '联系我们',
    'footer.company.careers': '加入我们',
    'footer.company.blog': '博客资讯',
    'footer.support': '帮助支持',
    'footer.support.docs': '使用文档',
    'footer.support.api': 'API文档',
    'footer.support.help': '帮助中心',
    'footer.support.community': '社区论坛',
    'footer.legal': '法律条款',
    'footer.legal.privacy': '隐私政策',
    'footer.legal.terms': '使用条款',
    'footer.legal.security': '安全保障',
    'footer.copyright': '© 2024 Agentboostr. 保留所有权利。',
  },
  en: {
    // Header
    'nav.features': 'Features',
    'nav.how-it-works': 'How It Works',
    'nav.agent-score': 'Agent Score',
    'nav.pricing': 'Pricing',
    'nav.case-studies': 'Case Studies',
    'nav.projects': 'Projects',
    'nav.leaderboard': 'Leaderboard',
    'nav.login': 'Login',
    'nav.free-trial': 'Free Trial',
    
    // Hero Section
    'hero.badge': 'AI-Native Incubator Platform',
    'hero.title1': 'AI-Native Incubator',
    'hero.title2': 'Let Data Drive Your Startup Success',
    'hero.subtitle': 'Connect Stripe & Google Analytics, auto-generate Agent Score, intelligently allocate ad spend',
    'hero.cta1': 'Get Free Agent Score',
    'hero.cta2': 'Watch Demo',
    'hero.feature1.title': 'Smart Data Integration',
    'hero.feature1.desc': 'Auto-connect Stripe and GA4, sync business data in real-time',
    'hero.feature2.title': 'AI-Driven Scoring',
    'hero.feature2.desc': 'Generate professional Agent Score based on multi-dimensional data',
    'hero.feature3.title': 'Smart Ad Optimization',
    'hero.feature3.desc': 'Auto-allocate ad budget, maximize ROI',
    
    // Features Section
    'features.badge': 'Core Features',
    'features.title': 'Comprehensive Data-Driven Solutions',
    'features.subtitle': 'From data integration to smart analysis, from scoring systems to ad optimization - one-stop solution for key startup challenges',
    'features.stripe.title': 'Stripe Data Integration',
    'features.stripe.desc': 'Auto-connect Stripe accounts, real-time payment data, MRR/ARR metrics and customer data',
    'features.ga.title': 'Google Analytics 4',
    'features.ga.desc': 'Deep GA4 integration, traffic data, user behavior analysis and conversion funnels',
    'features.score.title': 'Agent Score Assessment',
    'features.score.desc': 'AI-powered scoring system based on revenue health, traffic quality and product maturity',
    'features.ads.title': 'Smart Ad Allocation',
    'features.ads.desc': 'Auto-calculate optimal ad budget and channel allocation strategy based on Agent Score',
    'features.investment.title': 'Investment Ecosystem Connection',
    'features.investment.desc': 'Connect with a2aX Fund and Taihill Venture, providing investment opportunities for high-scoring projects',
    'features.security.title': 'Enterprise-Grade Security',
    'features.security.desc': 'GDPR compliant, HTTPS encrypted transmission, AES-256 encrypted sensitive data storage',
    
    // Agent Score Section
    'agent-score.badge': 'Agent Score',
    'agent-score.title': 'Data-Driven Intelligent Scoring System',
    'agent-score.subtitle': 'AI automatically generates professional scores based on 2C Agent investment evaluation framework',
    'agent-score.user-value.title': 'User Value Realization',
    'agent-score.user-value.description': 'Evaluate user retention, usage frequency, payment conversion and lifetime value',
    'agent-score.user-value.retention': 'User Retention Rate: 92%',
    'agent-score.user-value.conversion': 'Payment Conversion: 8.5%',
    'agent-score.user-value.ltv': 'LTV/CAC Ratio: 3.2x',
    'agent-score.market-fit.title': 'Product Market Fit',
    'agent-score.market-fit.description': 'Measure organic growth rate, user recommendation willingness and market penetration',
    'agent-score.market-fit.growth': 'Organic Growth Rate: +25%',
    'agent-score.market-fit.nps': 'User Recommendation: 68 NPS',
    'agent-score.market-fit.penetration': 'Market Penetration: 12%',
    'agent-score.technical-moat.title': 'Technical Moat',
    'agent-score.technical-moat.description': 'Assess AI capability differentiation, data flywheel effect and tech stack scalability',
    'agent-score.technical-moat.ai-capability': 'AI Differentiation: High',
    'agent-score.technical-moat.data-flywheel': 'Data Flywheel Effect: Running',
    'agent-score.technical-moat.scalability': 'Tech Stack Scalability: Excellent',
    'agent-score.business-health.title': 'Business Model Health',
    'agent-score.business-health.description': 'Analyze unit economics and cash flow positive path',
    'agent-score.business-health.unit-economics': 'Unit Economics: Healthy',
    'agent-score.business-health.cashflow': 'Cash Flow Positive: Expected in 6 months',
    'agent-score.execution-risk.title': 'Execution Risk Assessment',
    'agent-score.execution-risk.description': 'Evaluate team execution, resource allocation efficiency and compliance risks',
    'agent-score.execution-risk.team': 'Team AI Background: Strong',
    'agent-score.execution-risk.resources': 'Resource Allocation: Excellent',
    'agent-score.execution-risk.compliance': 'Compliance Risk: Low',
    
    // How It Works Section
    'how-it-works.badge': 'How It Works',
    'how-it-works.title': 'Four Steps to Intelligent Startup Upgrade',
    'how-it-works.subtitle': 'From data connection to smart advertising, fully automated process lets you focus on product innovation',
    'how-it-works.step1.title': 'Connect Data Sources',
    'how-it-works.step1.desc': 'Securely connect Stripe and Google Analytics 4, auto-sync business data',
    'how-it-works.step2.title': 'Generate Agent Score',
    'how-it-works.step2.desc': 'AI analyzes revenue, traffic, product data to generate professional scoring report',
    'how-it-works.step3.title': 'Get Ad Recommendations',
    'how-it-works.step3.desc': 'Smart calculation of ad budget and channel allocation strategy based on score',
    'how-it-works.step4.title': 'Connect Investment Ecosystem',
    'how-it-works.step4.desc': 'High-scoring projects automatically match investment opportunities, accelerate growth',
    
    // CTA Section
    'cta.badge': 'Limited Free Experience',
    'cta.title': 'Start Your AI-Driven Startup Journey',
    'cta.subtitle': 'Join the choice of 500+ startup teams, let data drive your success. Get free Agent Score assessment now, unlock smart growth strategies.',
    'cta.benefit1': 'Free Agent Score Assessment',
    'cta.benefit2': 'Complete Data Analysis Report',
    'cta.benefit3': 'Ad Strategy Recommendations',
    'cta.benefit4': 'Investment Opportunity Matching',
    'cta.benefit5': '7-Day Free Trial',
    'cta.benefit6': 'Professional Customer Support',
    'cta.button1': 'Get Free Agent Score',
    'cta.button2': 'Contact Sales Team',
    'cta.metric1': '500+',
    'cta.metric1.label': 'Startup Teams',
    'cta.metric2': '3.2x',
    'cta.metric2.label': 'Average ROI Improvement',
    'cta.metric3': '4.8/5',
    'cta.metric3.label': 'User Rating',
    'cta.partners': 'Investment Ecosystem Partners',
    
    // Navigation
    'nav.back': 'Back',
    'nav.home': 'Home',
    
    // Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle': 'Start free and scale with advanced features as your business grows',
    'pricing.popular': 'Recommended',
    'pricing.lite.name': '📦 Lite Start Here. No Commitment.',
    'pricing.lite.price': 'Free',
    'pricing.lite.description': 'No credit card required',
    'pricing.lite.feature1': '✅ Agent scoring starter report',
    'pricing.lite.feature2': '✅ Upload one pitch video (community visible by default)',
    'pricing.lite.feature3': '✅ Basic funding recommendations',
    'pricing.lite.cta': 'Try Now',
    'pricing.basic.name': '🧪 Basic Growth Warm-up Tier',
    'pricing.basic.price': '$29 /month',
    'pricing.basic.description': '',
    'pricing.basic.feature1': '✅ All Lite features',
    'pricing.basic.feature2': '✅ Video permission control (private / featured exposure)',
    'pricing.basic.feature3': '✅ Complete funding recommendation report',
    'pricing.basic.feature4': '✅ Data chart preview',
    'pricing.basic.cta': 'Learn Basic',
    'pricing.pro.name': '🚀 ⭐ Pro (Recommended) Full Growth Suite',
    'pricing.pro.price': '$149 /month or $1,490 /year',
    'pricing.pro.description': '',
    'pricing.pro.feature1': '✅ Full scoring system & trend analysis',
    'pricing.pro.feature2': '✅ CMO Agent • Auto advertising & up to 3× ROAS optimization',
    'pricing.pro.feature3': '✅ Virtual card spending control + real-time ROI Dashboard',
    'pricing.pro.feature4': '✅ Weekly growth reports & personalized recommendations',
    'pricing.pro.cta': 'Upgrade to Pro 🚀',
    'pricing.footer.line1': 'Experience incubator value, zero barrier to start',
    'pricing.footer.line2': 'Assess growth potential, upgrade anytime',
    'pricing.footer.line3': 'Less than $5/day on average, unlock funding + growth loop',
    
    // Footer
    'footer.description': 'AI-native incubator platform, connecting data, driving growth, achieving startup dreams.',
    'footer.product': 'Product Features',
    'footer.product.integration': 'Data Integration',
    'footer.product.score': 'Agent Score',
    'footer.product.ads': 'Smart Advertising',
    'footer.product.investment': 'Investment Matching',
    'footer.company': 'About Us',
    'footer.company.about': 'About Agentboostr',
    'footer.company.contact': 'Contact Us',
    'footer.company.careers': 'Join Us',
    'footer.company.blog': 'Blog & News',
    'footer.support': 'Help & Support',
    'footer.support.docs': 'Documentation',
    'footer.support.api': 'API Docs',
    'footer.support.help': 'Help Center',
    'footer.support.community': 'Community Forum',
    'footer.legal': 'Legal Terms',
    'footer.legal.privacy': 'Privacy Policy',
    'footer.legal.terms': 'Terms of Service',
    'footer.legal.security': 'Security',
    'footer.copyright': '© 2024 Agentboostr. All rights reserved.',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};