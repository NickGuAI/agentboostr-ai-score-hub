import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageNavigation } from '@/components/PageNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface LeaderboardProject {
  id: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  current_mrr: number;
  mrr_growth_rate: number;
  total_score: number;
  grade: string;
  percentile: number;
}

export default function Leaderboard() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<LeaderboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: 'all',
    stage: 'all'
  });

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    try {
      let query = supabase
        .from('project_overview')
        .select('*')
        .not('total_score', 'is', null)
        .order('total_score', { ascending: false });

      if (filter.category !== 'all') {
        query = query.eq('category', filter.category);
      }
      if (filter.stage !== 'all') {
        query = query.eq('stage', filter.stage);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'text-purple-600 bg-purple-50',
      'A': 'text-green-600 bg-green-50',
      'B': 'text-blue-600 bg-blue-50',
      'C': 'text-yellow-600 bg-yellow-50',
      'D': 'text-red-600 bg-red-50'
    };
    return colors[grade as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageNavigation title="排行榜" showBackButton={false} />
      
      <div className="space-y-6">
        <div className="flex justify-end items-center">
          <Button asChild>
            <Link to="/projects/new">添加你的项目</Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select
                value={filter.category}
                onValueChange={(value) => setFilter({ ...filter, category: value })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="所有分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分类</SelectItem>
                  <SelectItem value="AI工具">AI工具</SelectItem>
                  <SelectItem value="效率工具">效率工具</SelectItem>
                  <SelectItem value="开发工具">开发工具</SelectItem>
                  <SelectItem value="内容创作">内容创作</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filter.stage}
                onValueChange={(value) => setFilter({ ...filter, stage: value })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="所有阶段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有阶段</SelectItem>
                  <SelectItem value="idea">创意阶段</SelectItem>
                  <SelectItem value="mvp">MVP阶段</SelectItem>
                  <SelectItem value="growth">增长阶段</SelectItem>
                  <SelectItem value="scale">扩展阶段</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>顶级项目</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold w-12 text-center">
                          {getRankBadge(index + 1)}
                        </div>
                        
                        <div className="flex-1">
                          <Link to={`/projects/${project.id}`} className="hover:underline">
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {project.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {project.stage}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <DollarSign className="h-4 w-4" />
                            ${project.current_mrr?.toFixed(0) || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">MRR</div>
                        </div>

                        <div>
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            project.mrr_growth_rate > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {project.mrr_growth_rate > 0 ? 
                              <TrendingUp className="h-4 w-4" /> : 
                              <TrendingDown className="h-4 w-4" />
                            }
                            {project.mrr_growth_rate > 0 ? '+' : ''}{project.mrr_growth_rate?.toFixed(1) || 0}%
                          </div>
                          <div className="text-xs text-muted-foreground">Growth</div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">
                            {project.total_score?.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(project.grade)}`}>
                          {project.grade}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">没有找到符合条件的项目</p>
                    <Button asChild>
                      <Link to="/projects/new">成为第一个添加项目的人</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}