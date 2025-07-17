import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function StripeCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      if (!code || !state) {
        setStatus('Authorization failed: Missing parameters');
        return;
      }

      try {
        // Complete OAuth flow
        const { data, error } = await supabase.functions.invoke('stripe-auth', {
          body: { code, state }
        });

        if (error) throw error;

        setStatus('Connection successful! Syncing data...');
        
        // Redirect to project detail page
        const { projectId } = JSON.parse(atob(state));
        setTimeout(() => {
          navigate(`/projects/${projectId}`);
        }, 2000);

      } catch (error: any) {
        console.error('Error:', error);
        setStatus('Connection failed, please try again');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}