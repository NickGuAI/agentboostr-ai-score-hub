import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Eye, 
  Target,
  Calendar,
  BarChart3,
  Activity,
  Percent
} from 'lucide-react';

interface DataVisualizationProps {
  project?: {
    name: string;
    description: string;
    category: string;
    stage: string;
    total_score?: number;
    grade?: string;
    percentile?: number;
  };
  metrics?: {
    mrr: number;
    active_customers: number;
    total_customers: number;
    churn_rate: number;
    mrr_growth_rate: number;
    customer_growth_rate?: number;
    arpu: number;
    ltv: number;
    cac?: number;
    churned_customers: number;
  };
  ga4Data?: {
    active_users?: number;
    new_users?: number;
    sessions?: number;
    page_views?: number;
    conversion_rate?: number;
    property_name?: string;
  };
  evaluation?: {
    business_health_score: number;
    user_engagement_score: number;
    market_validation_score: number;
    growth_potential_score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export function DataVisualization({ project, metrics, ga4Data, evaluation }: DataVisualizationProps) {
  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'from-purple-500 to-purple-600',
      'A': 'from-green-500 to-green-600',
      'B': 'from-blue-500 to-blue-600',
      'C': 'from-yellow-500 to-yellow-600',
      'D': 'from-red-500 to-red-600'
    };
    return colors[grade as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* AI评分概览 */}
      {project && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradeColor(project.grade || 'C')} flex items-center justify-center shadow-lg`}>
                <span className="text-2xl font-bold text-white">{project.grade || 'C'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary">{project.category}</Badge>
                  <Badge variant="outline">{project.stage}</Badge>
                  {project.total_score && (
                    <Badge className="bg-primary/10 text-primary">
                      总分: {project.total_score}/100
                    </Badge>
                  )}
                  {project.percentile && (
                    <Badge className="bg-green-100 text-green-800">
                      前 {100 - project.percentile}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Stripe 财务指标详细面板 - 85%权重 */}
      {metrics && (
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Stripe 财务指标</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">权重: 85% • 核心商业数据</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-lg px-3 py-1">
                核心数据源
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* MRR */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                  <Badge variant="secondary" className="text-xs">主要指标</Badge>
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {formatCurrency(metrics.mrr)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">月度经常性收入</div>
                <div className={`flex items-center gap-1 text-sm font-medium ${metrics.mrr_growth_rate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.mrr_growth_rate > 0 ? 
                    <TrendingUp className="h-4 w-4" /> : 
                    <TrendingDown className="h-4 w-4" />
                  }
                  {metrics.mrr_growth_rate > 0 ? '+' : ''}{metrics.mrr_growth_rate?.toFixed(1)}% 增长
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ARR: {formatCurrency(metrics.mrr * 12)}
                </div>
              </div>

              {/* 客户指标 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <Badge variant="secondary" className="text-xs">客户数据</Badge>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {metrics.active_customers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">活跃付费客户</div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>总计: {metrics.total_customers}</div>
                  <div>新增: {metrics.total_customers - metrics.active_customers - metrics.churned_customers}</div>
                  <div>流失: {metrics.churned_customers}</div>
                </div>
              </div>

              {/* 单位经济 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Target className="h-8 w-8 text-purple-600" />
                  <Badge variant="secondary" className="text-xs">单位经济</Badge>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {formatCurrency(metrics.arpu)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">ARPU (每用户平均收入)</div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>LTV: {formatCurrency(metrics.ltv)}</div>
                  <div>CAC: {formatCurrency(metrics.cac || 0)}</div>
                  <div>LTV/CAC: {metrics.cac > 0 ? (metrics.ltv / metrics.cac).toFixed(1) : 'N/A'}</div>
                </div>
              </div>

              {/* 健康度指标 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-orange-100 dark:border-orange-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <Badge variant="secondary" className="text-xs">健康度</Badge>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {metrics.churn_rate?.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">月流失率</div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>客户增长率: {metrics.customer_growth_rate?.toFixed(1) || 'N/A'}%</div>
                  <div className={`font-medium ${metrics.churn_rate <= 5 ? 'text-green-600' : metrics.churn_rate <= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {metrics.churn_rate <= 5 ? '健康' : metrics.churn_rate <= 10 ? '注意' : '需改进'}
                  </div>
                </div>
              </div>
            </div>

            {/* 财务趋势分析 */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 p-6 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                财务健康度分析
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-emerald-700 dark:text-emerald-300">收入规模</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {metrics.mrr >= 10000 ? '🟢 大规模' : 
                     metrics.mrr >= 5000 ? '🟡 中等规模' : 
                     metrics.mrr >= 1000 ? '🟠 小规模' : '🔴 初期规模'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-emerald-700 dark:text-emerald-300">增长速度</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {metrics.mrr_growth_rate >= 20 ? '🟢 高速增长' : 
                     metrics.mrr_growth_rate >= 10 ? '🟡 稳定增长' : 
                     metrics.mrr_growth_rate >= 0 ? '🟠 缓慢增长' : '🔴 负增长'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-emerald-700 dark:text-emerald-300">客户质量</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {metrics.churn_rate <= 5 ? '🟢 优秀' : 
                     metrics.churn_rate <= 10 ? '🟡 良好' : 
                     metrics.churn_rate <= 20 ? '🟠 需改进' : '🔴 较差'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GA4 用户参与度数据 - 15%权重 */}
      {ga4Data && (ga4Data.active_users || ga4Data.sessions) && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">Google Analytics 数据</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-500">权重: 15% • 用户参与度指标</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ga4Data.property_name && (
                  <Badge variant="secondary">{ga4Data.property_name}</Badge>
                )}
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  辅助数据
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {ga4Data.active_users && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">用户数</Badge>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatNumber(ga4Data.active_users)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">活跃用户</div>
                </div>
              )}
              
              {ga4Data.new_users && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <Badge variant="secondary" className="text-xs">新增</Badge>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatNumber(ga4Data.new_users)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">新用户</div>
                  <div className="text-xs text-gray-500 mt-1">
                    新用户比例: {ga4Data.active_users > 0 ? ((ga4Data.new_users / ga4Data.active_users) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              )}
              
              {ga4Data.sessions && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <Eye className="h-8 w-8 text-purple-600" />
                    <Badge variant="secondary" className="text-xs">会话</Badge>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {formatNumber(ga4Data.sessions)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">会话数</div>
                  <div className="text-xs text-gray-500 mt-1">
                    页面深度: {ga4Data.page_views && ga4Data.sessions > 0 ? (ga4Data.page_views / ga4Data.sessions).toFixed(1) : 'N/A'}
                  </div>
                </div>
              )}
              
              {ga4Data.conversion_rate !== undefined && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-orange-100 dark:border-orange-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <Activity className="h-8 w-8 text-orange-600" />
                    <Badge variant="secondary" className="text-xs">转化</Badge>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {ga4Data.conversion_rate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">转化率</div>
                  <div className={`text-xs mt-1 font-medium ${ga4Data.conversion_rate >= 5 ? 'text-green-600' : ga4Data.conversion_rate >= 2 ? 'text-yellow-600' : 'text-orange-600'}`}>
                    {ga4Data.conversion_rate >= 5 ? '优秀' : ga4Data.conversion_rate >= 2 ? '良好' : '需优化'}
                  </div>
                </div>
              )}
            </div>

            {/* 用户参与度分析 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                用户参与度分析
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-blue-700 dark:text-blue-300">用户规模</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {ga4Data.active_users >= 10000 ? '🟢 大流量' : 
                     ga4Data.active_users >= 1000 ? '🟡 中等流量' : 
                     ga4Data.active_users >= 100 ? '🟠 小流量' : '🔴 初期流量'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-blue-700 dark:text-blue-300">转化效果</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {ga4Data.conversion_rate >= 5 ? '🟢 优秀' : 
                     ga4Data.conversion_rate >= 2 ? '🟡 良好' : 
                     ga4Data.conversion_rate >= 1 ? '🟠 一般' : '🔴 需优化'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-blue-700 dark:text-blue-300">用户粘性</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {ga4Data.page_views && ga4Data.sessions && (ga4Data.page_views / ga4Data.sessions) >= 5 ? '🟢 高粘性' : 
                     ga4Data.page_views && ga4Data.sessions && (ga4Data.page_views / ga4Data.sessions) >= 3 ? '🟡 中等' : 
                     ga4Data.page_views && ga4Data.sessions && (ga4Data.page_views / ga4Data.sessions) >= 2 ? '🟠 一般' : '🔴 需改进'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI评分详细分析 */}
      {evaluation && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* 新评分维度 - 按新权重 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                AI评分维度分析 (新权重)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe 85% */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Stripe 财务数据</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">权重: 85%</div>
                    <div className="font-bold text-emerald-600">{evaluation.business_health_score}/85</div>
                  </div>
                </div>
                <Progress value={(evaluation.business_health_score / 85) * 100} className="h-4 bg-emerald-100 dark:bg-emerald-900" />
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  MRR • 增长率 • 客户经济模型 • 流失率
                </div>
              </div>

              {/* GA4 15% */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-700 dark:text-blue-400">GA4 用户参与度</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">权重: 15%</div>
                    <div className="font-bold text-blue-600">{evaluation.user_engagement_score}/15</div>
                  </div>
                </div>
                <Progress value={(evaluation.user_engagement_score / 15) * 100} className="h-4 bg-blue-100 dark:bg-blue-900" />
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  活跃用户 • 转化率 • 会话深度
                </div>
              </div>

              {/* 总分显示 */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradeColor(project?.grade || 'C')} flex items-center justify-center`}>
                      <span className="text-sm font-bold text-white">{project?.grade || 'C'}</span>
                    </div>
                    <div>
                      <div className="font-bold text-purple-700 dark:text-purple-400">综合评分</div>
                      <div className="text-xs text-purple-600 dark:text-purple-500">基于新权重计算</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">
                      {(evaluation.business_health_score + evaluation.user_engagement_score)}/100
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      {project?.percentile && `超越 ${project.percentile}% 项目`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 优势与建议 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                分析报告
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluation.strengths?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ 优势</h4>
                  <ul className="space-y-1 text-sm">
                    {evaluation.strengths.slice(0, 3).map((strength, i) => (
                      <li key={i} className="text-muted-foreground">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.weaknesses?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">⚠️ 待改进</h4>
                  <ul className="space-y-1 text-sm">
                    {evaluation.weaknesses.slice(0, 3).map((weakness, i) => (
                      <li key={i} className="text-muted-foreground">• {weakness}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.recommendations?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">💡 建议</h4>
                  <ul className="space-y-1 text-sm">
                    {evaluation.recommendations.slice(0, 2).map((rec, i) => (
                      <li key={i} className="text-muted-foreground">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 数据状态提示 */}
      {!metrics && !ga4Data && !evaluation && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无数据</h3>
            <p className="text-muted-foreground">
              请连接Stripe和Google Analytics以获取完整的数据分析
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}