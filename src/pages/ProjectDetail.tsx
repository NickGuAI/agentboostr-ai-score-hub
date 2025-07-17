import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageNavigation } from '@/components/PageNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { GA4Section } from '@/components/GA4Section';
import { DataVisualization } from '@/components/DataVisualization';
import { TrendingUp, TrendingDown, Users, DollarSign, Percent, RefreshCw } from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  website_url?: string;
  stripe_account_id: string;
  current_mrr: number;
  active_customers: number;
  mrr_growth_rate: number;
  total_score: number;
  grade: string;
  percentile: number;
  // GA4 fields
  ga4_property_id?: string;
  ga4_property_name?: string;
  ga4_connected_at?: string;
  ga4_last_sync_at?: string;
  ga4_active_users?: number;
  ga4_new_users?: number;
  ga4_sessions?: number;
  ga4_conversion_rate?: number;
}

interface Metrics {
  mrr: number;
  active_customers: number;
  total_customers: number;
  churn_rate: number;
  mrr_growth_rate: number;
  arpu: number;
  ltv: number;
  churned_customers: number;
}

interface Evaluation {
  total_score: number;
  grade: string;
  percentile: number;
  business_health_score: number;
  user_engagement_score: number;
  market_validation_score: number;
  growth_potential_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      // Load project overview
      const { data: projectData, error: projectError } = await supabase
        .from('project_overview')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load latest evaluation
      const { data: evalData } = await supabase
        .from('evaluation_results')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (evalData) {
        setEvaluation(evalData);
      }

      // Load detailed metrics
      const { data: metricsData } = await supabase
        .from('financial_metrics')
        .select('*')
        .eq('project_id', id)
        .order('metric_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (metricsData) {
        setMetrics(metricsData);
      }

    } catch (error: any) {
      console.error('Error loading project:', error);
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeConnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-auth', {
        body: {
          projectId: id,
          redirectUrl: window.location.origin
        }
      });

      if (error) throw error;

      // Redirect to Stripe OAuth
      window.location.href = data.url;
      toast({
        title: "Success",
        description: "正在跳转到Stripe授权页面...",
      });
    } catch (error: any) {
      console.error('Stripe connection error:', error);
      toast({
        title: "Error",
        description: "连接失败: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('sync-stripe-data', {
        body: { projectId: id }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "数据同步成功！",
      });
      
      // Reload data
      await loadProjectData();

    } catch (error: any) {
      console.error('Error syncing:', error);
      toast({
        title: "Error",
        description: "同步失败",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };


  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'bg-purple-500',
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-yellow-500',
      'D': 'bg-red-500'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8 text-center">Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageNavigation title={project.name} />
      
      {/* 数据可视化组件 */}
      <DataVisualization 
        project={project}
        metrics={metrics}
        ga4Data={{
          active_users: project.ga4_active_users,
          new_users: project.ga4_new_users,
          sessions: project.ga4_sessions,
          conversion_rate: project.ga4_conversion_rate,
          property_name: project.ga4_property_name,
        }}
        evaluation={evaluation}
      />
      
      {/* GA4连接管理 */}
      <div className="mt-8">
        <GA4Section 
          projectId={project.id} 
          ga4Data={{
            property_id: project.ga4_property_id,
            property_name: project.ga4_property_name,
            connected_at: project.ga4_connected_at,
            last_sync_at: project.ga4_last_sync_at,
            active_users: project.ga4_active_users,
            new_users: project.ga4_new_users,
            sessions: project.ga4_sessions,
            conversion_rate: project.ga4_conversion_rate,
          }}
        />
      </div>

      {/* Stripe连接管理 */}
      <div className="mt-6">
        {project.stripe_account_id ? (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Stripe 数据管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Badge className="bg-green-100 text-green-800">✓ Stripe已连接</Badge>
                <Button
                  onClick={handleSync}
                  disabled={syncing}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      同步中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      同步数据
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                Stripe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  连接你的Stripe账户获取真实的收入和客户数据
                </p>
                <Button onClick={handleStripeConnect} className="w-full gap-2">
                  <DollarSign className="h-4 w-4" />
                  连接 Stripe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}