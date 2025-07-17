import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GA4Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('正在处理Google Analytics连接...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      if (error) {
        setStatus('error');
        setMessage('用户取消了授权或发生错误');
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('缺少必要的授权参数');
        return;
      }

      try {
        // Complete OAuth flow
        const { data, error } = await supabase.functions.invoke('ga4-auth/callback', {
          body: { code, state }
        });

        if (error) throw error;

        setStatus('success');
        setMessage('Google Analytics连接成功！正在同步数据...');
        
        // Parse state to get project info
        const { projectId } = JSON.parse(atob(state));
        
        // Redirect to project detail page after 2 seconds
        setTimeout(() => {
          navigate(`/projects/${projectId}?ga4=success`);
        }, 2000);

      } catch (error: any) {
        console.error('GA4 callback error:', error);
        setStatus('error');
        setMessage('连接失败：' + (error.message || '未知错误'));
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'success':
        return '连接成功';
      case 'error':
        return '连接失败';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            {getIcon()}
            <CardTitle className="text-xl">{getTitle()}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          
          {status === 'error' && (
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/projects')} 
                variant="outline"
                className="w-full"
              >
                返回项目列表
              </Button>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-sm text-muted-foreground">
              即将自动跳转到项目页面...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}