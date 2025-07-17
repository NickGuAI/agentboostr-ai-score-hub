import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageNavigation } from '@/components/PageNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ProjectOverview = Database['public']['Views']['project_overview']['Row'];

export default function Projects() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectOverview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('project_overview')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadProjects();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <PageNavigation title="我的项目" showBackButton={false} />
        
        <div className="flex justify-end items-center mb-8">
          <Button asChild>
            <Link to="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              创建项目
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    {project.grade && (
                      <Badge variant="secondary" className="text-lg">
                        {project.grade}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge variant="secondary">{project.stage}</Badge>
                  </div>
                  
                  {project.current_mrr && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">MRR</span>
                        <span className="font-semibold">
                          ${project.current_mrr.toFixed(0)}
                        </span>
                      </div>
                      {project.mrr_growth_rate && (
                        <div className="text-right">
                          <span className={`text-sm ${project.mrr_growth_rate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {project.mrr_growth_rate > 0 ? '+' : ''}{project.mrr_growth_rate.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {project.total_score && (
                    <div className="mt-4 text-center">
                      <span className="text-2xl font-bold text-primary">
                        {project.total_score.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">分</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">还没有项目</p>
            <Button asChild>
              <Link to="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                创建第一个项目
              </Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}