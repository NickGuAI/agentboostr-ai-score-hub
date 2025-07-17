import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageNavigation } from '@/components/PageNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  Circle, 
  Loader2, 
  Rocket, 
  DollarSign, 
  BarChart3,
  Target,
  ArrowRight
} from 'lucide-react';

export default function TestSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testProjectId, setTestProjectId] = useState<string | null>(null);

  const steps = [
    {
      title: '创建测试项目',
      description: '创建一个演示项目来测试所有功能',
      icon: Rocket,
      completed: false
    },
    {
      title: '连接 Stripe',
      description: '模拟财务数据集成',
      icon: DollarSign,
      completed: false
    },
    {
      title: '连接 Google Analytics',
      description: '集成网站分析数据',
      icon: BarChart3,
      completed: false
    },
    {
      title: 'AI 评分系统',
      description: '生成智能评分报告',
      icon: Target,
      completed: false
    }
  ];

  const createTestProject = async () => {
    if (!user?.id || !user?.email) {
      toast.error('用户未登录或用户信息不完整，请先登录');
      return;
    }

    setLoading(true);
    try {
      const testProjectData = {
        name: '智能AI助手平台',
        description: '一个基于GPT的智能对话助手平台，为企业提供客服自动化解决方案。支持多语言对话，情感分析，智能推荐等功能。',
        website_url: 'https://ai-assistant-demo.com',
        category: 'AI工具',
        stage: 'growth',
        owner_id: user.id,
        owner_email: user.email,
      };

      console.log('Creating project with data:', testProjectData);

      const { data, error } = await supabase
        .from('projects')
        .insert([testProjectData])
        .select()
        .single();

      if (error) throw error;

      setTestProjectId(data.id);
      
      // 创建模拟的财务数据
      await createMockStripeData(data.id);
      
      // 创建模拟的GA4数据
      await createMockGA4Data(data.id);
      
      // 触发AI评分
      await generateEvaluation(data.id);

      toast.success('测试项目创建成功！');
      setStep(4);
      
      // 2秒后跳转到项目详情页
      setTimeout(() => {
        navigate(`/projects/${data.id}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error creating test project:', error);
      toast.error('创建测试项目失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createMockStripeData = async (projectId: string) => {
    try {
      // 创建模拟的Stripe连接
      await supabase.from('stripe_connections').insert({
        project_id: projectId,
        stripe_account_id: 'acct_test_demo123',
        access_token: 'sk_test_demo_token',
        connected_at: new Date().toISOString(),
        sync_status: 'completed'
      });

      // 创建模拟的财务指标数据
      const mockMetrics = {
        project_id: projectId,
        metric_date: new Date().toISOString().split('T')[0],
        mrr: 12500,
        arr: 150000,
        total_revenue: 180000,
        total_customers: 125,
        active_customers: 118,
        new_customers: 15,
        churned_customers: 3,
        mrr_growth_rate: 18.5,
        customer_growth_rate: 12.8,
        churn_rate: 2.4,
        arpu: 106,
        ltv: 1680,
        cac: 125
      };

      await supabase.from('financial_metrics').insert(mockMetrics);
      
    } catch (error) {
      console.error('Error creating mock Stripe data:', error);
    }
  };

  const createMockGA4Data = async (projectId: string) => {
    try {
      // 创建模拟的GA4连接
      await supabase.from('ga4_connections').insert({
        project_id: projectId,
        property_id: '123456789',
        property_name: 'AI助手平台 - 网站数据',
        access_token: 'ya29.demo_token',
        google_account_email: user?.email,
        connected_at: new Date().toISOString(),
        last_sync_at: new Date().toISOString(),
        sync_status: 'completed'
      });

      // 创建模拟的GA4分析数据
      const mockGA4Data = {
        project_id: projectId,
        data_date: new Date().toISOString().split('T')[0],
        active_users: 2580,
        new_users: 485,
        sessions: 3420,
        page_views: 12650,
        bounce_rate: 0.32,
        session_duration: 245.6,
        conversion_rate: 3.8,
        top_pages: [
          { page: '/home', views: 4200 },
          { page: '/features', views: 2100 },
          { page: '/pricing', views: 1800 },
          { page: '/contact', views: 950 }
        ],
        traffic_sources: [
          { source: 'Organic Search', users: 1420 },
          { source: 'Direct', users: 850 },
          { source: 'Social Media', users: 310 }
        ],
        device_breakdown: [
          { device: 'Desktop', users: 1580 },
          { device: 'Mobile', users: 890 },
          { device: 'Tablet', users: 110 }
        ]
      };

      await supabase.from('ga4_analytics_data').insert(mockGA4Data);
      
    } catch (error) {
      console.error('Error creating mock GA4 data:', error);
    }
  };

  const generateEvaluation = async (projectId: string) => {
    try {
      const { error } = await supabase.functions.invoke('calculate-score', {
        body: { projectId }
      });

      if (error) {
        console.error('Error generating evaluation:', error);
        // 如果AI评分失败，创建一个模拟评分
        await createMockEvaluation(projectId);
      }
    } catch (error) {
      console.error('Error invoking calculate-score:', error);
      // 创建模拟评分作为备选
      await createMockEvaluation(projectId);
    }
  };

  const createMockEvaluation = async (projectId: string) => {
    try {
      const mockEvaluation = {
        project_id: projectId,
        evaluation_date: new Date().toISOString().split('T')[0],
        business_health_score: 26,
        user_engagement_score: 22,
        market_validation_score: 13,
        growth_potential_score: 25,
        total_score: 86,
        percentile: 85,
        grade: 'A',
        strengths: [
          '稳定的MRR增长，月增长率达18.5%',
          '低流失率（2.4%），显示良好的用户留存',
          '较高的ARPU（$106），说明产品价值得到认可',
          '网站流量健康，转化率为3.8%高于行业平均',
          '用户参与度高，平均会话时长超过4分钟'
        ],
        weaknesses: [
          '客户获取成本相对较高（$125）',
          '移动端用户占比较低，存在优化空间',
          '新用户转化还有提升空间',
          '社交媒体流量占比较小'
        ],
        recommendations: [
          '优化移动端用户体验，提高移动端转化率',
          '加强内容营销，降低客户获取成本',
          '实施用户推荐计划，利用现有客户获取新用户',
          '加强社交媒体营销，扩大品牌影响力',
          '优化产品定价策略，提高整体LTV'
        ]
      };

      await supabase.from('evaluation_results').insert(mockEvaluation);
    } catch (error) {
      console.error('Error creating mock evaluation:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="container mx-auto max-w-4xl">
          <PageNavigation title="演示测试" />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI项目评分平台 - 测试演示
            </h1>
            <p className="text-lg text-muted-foreground">
              一键创建演示项目，体验完整的AI评分和数据分析功能
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                功能演示设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 进度条 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">设置进度</span>
                  <span className="text-sm text-muted-foreground">{step}/4 完成</span>
                </div>
                <Progress value={(step / 4) * 100} className="h-2" />
              </div>

              {/* 步骤列表 */}
              <div className="space-y-4">
                {steps.map((stepItem, index) => {
                  const Icon = stepItem.icon;
                  const isCompleted = index < step;
                  const isCurrent = index === step && loading;
                  
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : isCurrent ? (
                          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <h3 className="font-medium">{stepItem.title}</h3>
                        <p className="text-sm text-muted-foreground">{stepItem.description}</p>
                      </div>
                      {isCompleted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          已完成
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 开始按钮 */}
              <div className="text-center">
                {step < 4 ? (
                  <Button
                    onClick={createTestProject}
                    disabled={loading}
                    size="lg"
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        正在设置演示环境...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        开始创建演示项目
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-green-600 font-medium">
                      ✅ 演示项目设置完成！
                    </div>
                    <Button
                      onClick={() => navigate(`/projects/${testProjectId}`)}
                      size="lg"
                      className="gap-2"
                    >
                      查看演示项目
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 功能介绍 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Stripe 财务集成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• MRR/ARR 追踪</li>
                  <li>• 客户增长分析</li>
                  <li>• 流失率监控</li>
                  <li>• ARPU 和 LTV 计算</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Google Analytics 集成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 网站流量分析</li>
                  <li>• 用户行为追踪</li>
                  <li>• 转化率优化</li>
                  <li>• 流量来源分析</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  AI 智能评分
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 多维度评分系统</li>
                  <li>• 智能分析报告</li>
                  <li>• 个性化建议</li>
                  <li>• 行业排名对比</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  完整体验
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 一键创建演示项目</li>
                  <li>• 真实数据模拟</li>
                  <li>• 完整评分流程</li>
                  <li>• 可视化报告展示</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}