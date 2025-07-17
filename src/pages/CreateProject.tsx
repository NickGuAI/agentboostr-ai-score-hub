import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { PageNavigation } from "@/components/PageNavigation";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateProject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (projectData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            website_url: projectData.website_url,
            category: projectData.category,
            stage: projectData.stage,
            owner_id: user?.id,
            owner_email: user?.email,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        toast.success("项目创建成功！");
        navigate(`/projects/${data[0].id}`);
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error("创建项目失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <PageNavigation title="创建新项目" />
          
          <div className="max-w-2xl mx-auto">
            <CreateProjectForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}