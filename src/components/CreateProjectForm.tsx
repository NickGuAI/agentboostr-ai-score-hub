import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CreateProjectForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    website_url: '',
    category: 'AI工具',
    stage: 'mvp'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a project",
          variant: "destructive"
        });
        return;
      }

      // Create project
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          owner_id: user.id,
          owner_email: user.email,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: "Now connecting to Stripe...",
      });

      // Start Stripe connection flow
      const { data: oauthData, error: oauthError } = await supabase.functions.invoke('stripe-auth', {
        body: {
          projectId: project.id,
          redirectUrl: window.location.origin
        }
      });

      if (oauthError) throw oauthError;

      // Redirect to Stripe OAuth
      window.location.href = oauthData.url;

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                type="text"
                required
                value={projectData.name}
                onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                placeholder="e.g., AI Writing Assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                placeholder="Describe what your project does..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={projectData.website_url}
                onChange={(e) => setProjectData({ ...projectData, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={projectData.category}
                  onValueChange={(value) => setProjectData({ ...projectData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI工具">AI Tools</SelectItem>
                    <SelectItem value="效率工具">Productivity Tools</SelectItem>
                    <SelectItem value="开发工具">Developer Tools</SelectItem>
                    <SelectItem value="内容创作">Content Creation</SelectItem>
                    <SelectItem value="其他">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stage</Label>
                <Select
                  value={projectData.stage}
                  onValueChange={(value) => setProjectData({ ...projectData, stage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="mvp">MVP Stage</SelectItem>
                    <SelectItem value="growth">Growth Stage</SelectItem>
                    <SelectItem value="scale">Scale Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create & Connect Stripe'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/projects')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}