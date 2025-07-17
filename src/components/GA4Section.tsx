import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Users, Eye, Clock, TrendingUp, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GA4SectionProps {
  projectId: string;
  ga4Data?: {
    property_id?: string;
    property_name?: string;
    connected_at?: string;
    last_sync_at?: string;
    active_users?: number;
    new_users?: number;
    sessions?: number;
    conversion_rate?: number;
  };
}

export function GA4Section({ projectId, ga4Data }: GA4SectionProps) {
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const isConnected = !!ga4Data?.property_id;

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ga4-auth', {
        body: {
          projectId,
          redirectUrl: window.location.origin
        }
      });

      if (error) throw error;

      // Redirect to Google OAuth
      window.location.href = data.url;
      toast.success('正在跳转到Google授权页面...');
    } catch (error: any) {
      console.error('GA4 connection error:', error);
      toast.error('连接失败：' + error.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-ga4-data', {
        body: { projectId }
      });

      if (error) throw error;

      toast.success('GA4数据同步成功！');
      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('GA4 sync error:', error);
      toast.error('同步失败：' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900">Google Analytics 4</CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            连接你的Google Analytics获取真实的网站流量和用户行为数据
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              连接GA4后可以获取：活跃用户数、新用户数、会话数、转化率等关键指标
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleConnect} 
            disabled={connecting}
            className="w-full gap-2"
          >
            {connecting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                连接中...
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                连接 Google Analytics
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">Google Analytics 4</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              已连接
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
            className="gap-2"
          >
            {syncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                同步中
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                同步数据
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Info */}
        <div className="space-y-2">
          <h4 className="font-medium text-green-900">连接信息</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">属性名称：</span>
              <span className="font-medium">{ga4Data.property_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">属性ID：</span>
              <span className="font-medium">{ga4Data.property_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">连接时间：</span>
              <span className="font-medium">
                {ga4Data.connected_at ? new Date(ga4Data.connected_at).toLocaleDateString('zh-CN') : '未知'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">最后同步：</span>
              <span className="font-medium">
                {ga4Data.last_sync_at ? new Date(ga4Data.last_sync_at).toLocaleDateString('zh-CN') : '未同步'}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Metrics */}
        {(ga4Data.active_users || ga4Data.sessions) && (
          <div className="space-y-2">
            <h4 className="font-medium text-green-900">最新数据（近30天）</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ga4Data.active_users && (
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">
                    {ga4Data.active_users.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">活跃用户</div>
                </div>
              )}
              
              {ga4Data.new_users && (
                <div className="text-center p-3 bg-white rounded-lg border">
                  <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">
                    {ga4Data.new_users.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">新用户</div>
                </div>
              )}
              
              {ga4Data.sessions && (
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Eye className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-purple-600">
                    {ga4Data.sessions.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">会话数</div>
                </div>
              )}
              
              {ga4Data.conversion_rate !== undefined && (
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-orange-600">
                    {ga4Data.conversion_rate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">转化率</div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
