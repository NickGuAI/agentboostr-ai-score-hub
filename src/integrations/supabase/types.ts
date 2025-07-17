export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      evaluation_results: {
        Row: {
          business_health_score: number | null
          created_at: string | null
          evaluation_date: string | null
          grade: string | null
          growth_potential_score: number | null
          id: string
          market_validation_score: number | null
          percentile: number | null
          project_id: string | null
          recommendations: string[] | null
          report_data: Json | null
          strengths: string[] | null
          total_score: number | null
          user_engagement_score: number | null
          weaknesses: string[] | null
        }
        Insert: {
          business_health_score?: number | null
          created_at?: string | null
          evaluation_date?: string | null
          grade?: string | null
          growth_potential_score?: number | null
          id?: string
          market_validation_score?: number | null
          percentile?: number | null
          project_id?: string | null
          recommendations?: string[] | null
          report_data?: Json | null
          strengths?: string[] | null
          total_score?: number | null
          user_engagement_score?: number | null
          weaknesses?: string[] | null
        }
        Update: {
          business_health_score?: number | null
          created_at?: string | null
          evaluation_date?: string | null
          grade?: string | null
          growth_potential_score?: number | null
          id?: string
          market_validation_score?: number | null
          percentile?: number | null
          project_id?: string | null
          recommendations?: string[] | null
          report_data?: Json | null
          strengths?: string[] | null
          total_score?: number | null
          user_engagement_score?: number | null
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_metrics: {
        Row: {
          active_customers: number | null
          arpu: number | null
          arr: number | null
          cac: number | null
          churn_rate: number | null
          churned_customers: number | null
          created_at: string | null
          customer_growth_rate: number | null
          id: string
          ltv: number | null
          metric_date: string
          mrr: number | null
          mrr_growth_rate: number | null
          new_customers: number | null
          project_id: string | null
          total_customers: number | null
          total_revenue: number | null
        }
        Insert: {
          active_customers?: number | null
          arpu?: number | null
          arr?: number | null
          cac?: number | null
          churn_rate?: number | null
          churned_customers?: number | null
          created_at?: string | null
          customer_growth_rate?: number | null
          id?: string
          ltv?: number | null
          metric_date: string
          mrr?: number | null
          mrr_growth_rate?: number | null
          new_customers?: number | null
          project_id?: string | null
          total_customers?: number | null
          total_revenue?: number | null
        }
        Update: {
          active_customers?: number | null
          arpu?: number | null
          arr?: number | null
          cac?: number | null
          churn_rate?: number | null
          churned_customers?: number | null
          created_at?: string | null
          customer_growth_rate?: number | null
          id?: string
          ltv?: number | null
          metric_date?: string
          mrr?: number | null
          mrr_growth_rate?: number | null
          new_customers?: number | null
          project_id?: string | null
          total_customers?: number | null
          total_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ga4_analytics_data: {
        Row: {
          active_users: number | null
          bounce_rate: number | null
          conversion_rate: number | null
          created_at: string
          data_date: string
          device_breakdown: Json | null
          fetched_at: string
          id: string
          new_users: number | null
          page_views: number | null
          project_id: string | null
          session_duration: number | null
          sessions: number | null
          top_pages: Json | null
          traffic_sources: Json | null
        }
        Insert: {
          active_users?: number | null
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          data_date: string
          device_breakdown?: Json | null
          fetched_at?: string
          id?: string
          new_users?: number | null
          page_views?: number | null
          project_id?: string | null
          session_duration?: number | null
          sessions?: number | null
          top_pages?: Json | null
          traffic_sources?: Json | null
        }
        Update: {
          active_users?: number | null
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          data_date?: string
          device_breakdown?: Json | null
          fetched_at?: string
          id?: string
          new_users?: number | null
          page_views?: number | null
          project_id?: string | null
          session_duration?: number | null
          sessions?: number | null
          top_pages?: Json | null
          traffic_sources?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ga4_analytics_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ga4_analytics_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ga4_connections: {
        Row: {
          access_token: string
          connected_at: string
          created_at: string
          google_account_email: string | null
          id: string
          last_sync_at: string | null
          project_id: string | null
          property_id: string
          property_name: string | null
          refresh_token: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          connected_at?: string
          created_at?: string
          google_account_email?: string | null
          id?: string
          last_sync_at?: string | null
          project_id?: string | null
          property_id: string
          property_name?: string | null
          refresh_token?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          connected_at?: string
          created_at?: string
          google_account_email?: string | null
          id?: string
          last_sync_at?: string | null
          project_id?: string | null
          property_id?: string
          property_name?: string | null
          refresh_token?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ga4_connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ga4_connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_email: string | null
          owner_id: string | null
          stage: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_email?: string | null
          owner_id?: string | null
          stage?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_email?: string | null
          owner_id?: string | null
          stage?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      stripe_connections: {
        Row: {
          access_token: string
          connected_at: string | null
          id: string
          last_sync_at: string | null
          project_id: string | null
          refresh_token: string | null
          scope: string | null
          stripe_account_id: string
          sync_status: string | null
        }
        Insert: {
          access_token: string
          connected_at?: string | null
          id?: string
          last_sync_at?: string | null
          project_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          stripe_account_id: string
          sync_status?: string | null
        }
        Update: {
          access_token?: string
          connected_at?: string | null
          id?: string
          last_sync_at?: string | null
          project_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          stripe_account_id?: string
          sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_raw_data: {
        Row: {
          data: Json
          data_type: string
          fetched_at: string | null
          id: string
          project_id: string | null
          stripe_id: string
        }
        Insert: {
          data: Json
          data_type: string
          fetched_at?: string | null
          id?: string
          project_id?: string | null
          stripe_id: string
        }
        Update: {
          data?: Json
          data_type?: string
          fetched_at?: string | null
          id?: string
          project_id?: string | null
          stripe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_raw_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_raw_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      project_overview: {
        Row: {
          active_customers: number | null
          category: string | null
          created_at: string | null
          current_mrr: number | null
          description: string | null
          ga4_active_users: number | null
          ga4_connected_at: string | null
          ga4_conversion_rate: number | null
          ga4_last_sync_at: string | null
          ga4_new_users: number | null
          ga4_property_id: string | null
          ga4_property_name: string | null
          ga4_sessions: number | null
          grade: string | null
          id: string | null
          mrr_growth_rate: number | null
          name: string | null
          owner_email: string | null
          owner_id: string | null
          percentile: number | null
          stage: string | null
          stripe_account_id: string | null
          stripe_connected_at: string | null
          sync_status: string | null
          total_score: number | null
          updated_at: string | null
          website_url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
