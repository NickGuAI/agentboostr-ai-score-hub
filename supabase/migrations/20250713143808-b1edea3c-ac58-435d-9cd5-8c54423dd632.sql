-- Create table for Google Analytics connections
CREATE TABLE public.ga4_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  google_account_email TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  property_id TEXT NOT NULL,
  property_name TEXT,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for GA4 analytics data
CREATE TABLE public.ga4_analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  data_date DATE NOT NULL,
  active_users INTEGER,
  new_users INTEGER,
  sessions INTEGER,
  page_views INTEGER,
  bounce_rate NUMERIC,
  session_duration NUMERIC,
  conversion_rate NUMERIC,
  top_pages JSONB,
  traffic_sources JSONB,
  device_breakdown JSONB,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, data_date)
);

-- Enable RLS
ALTER TABLE public.ga4_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ga4_analytics_data ENABLE ROW LEVEL SECURITY;

-- Create policies for ga4_connections
CREATE POLICY "Users view own GA4 connections" ON public.ga4_connections
  FOR ALL USING (project_id IN (
    SELECT id FROM public.projects WHERE owner_id = auth.uid()
  ));

-- Create policies for ga4_analytics_data
CREATE POLICY "Users view own GA4 analytics data" ON public.ga4_analytics_data
  FOR ALL USING (project_id IN (
    SELECT id FROM public.projects WHERE owner_id = auth.uid()
  ));

-- Add triggers for updated_at
CREATE TRIGGER update_ga4_connections_updated_at
  BEFORE UPDATE ON public.ga4_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update project_overview view to include GA4 data
DROP VIEW IF EXISTS public.project_overview;
CREATE VIEW public.project_overview AS
SELECT 
  p.id,
  p.owner_id,
  p.owner_email,
  p.name,
  p.description,
  p.website_url,
  p.category,
  p.stage,
  p.created_at,
  p.updated_at,
  
  -- Stripe connection info
  sc.stripe_account_id,
  sc.connected_at as stripe_connected_at,
  sc.sync_status,
  
  -- Latest financial metrics
  fm.current_mrr,
  fm.active_customers,
  fm.mrr_growth_rate,
  
  -- Evaluation results
  er.total_score,
  er.grade,
  er.percentile,
  
  -- GA4 connection info
  gc.property_id as ga4_property_id,
  gc.property_name as ga4_property_name,
  gc.connected_at as ga4_connected_at,
  gc.last_sync_at as ga4_last_sync_at,
  
  -- Latest GA4 metrics
  gd.active_users as ga4_active_users,
  gd.new_users as ga4_new_users,
  gd.sessions as ga4_sessions,
  gd.conversion_rate as ga4_conversion_rate

FROM public.projects p
LEFT JOIN public.stripe_connections sc ON p.id = sc.project_id
LEFT JOIN (
  SELECT DISTINCT ON (project_id) 
    project_id,
    mrr as current_mrr,
    active_customers,
    mrr_growth_rate
  FROM public.financial_metrics 
  ORDER BY project_id, metric_date DESC
) fm ON p.id = fm.project_id
LEFT JOIN (
  SELECT DISTINCT ON (project_id)
    project_id,
    total_score,
    grade,
    percentile
  FROM public.evaluation_results
  ORDER BY project_id, evaluation_date DESC
) er ON p.id = er.project_id
LEFT JOIN public.ga4_connections gc ON p.id = gc.project_id
LEFT JOIN (
  SELECT DISTINCT ON (project_id)
    project_id,
    active_users,
    new_users,
    sessions,
    conversion_rate
  FROM public.ga4_analytics_data
  ORDER BY project_id, data_date DESC
) gd ON p.id = gd.project_id;