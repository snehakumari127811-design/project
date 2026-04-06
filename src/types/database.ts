export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          role: 'super_admin' | 'moderator';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          role?: 'super_admin' | 'moderator';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          role?: 'super_admin' | 'moderator';
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string;
          category_id: string | null;
          video_url: string;
          thumbnail_url: string;
          duration: number;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          category_id?: string | null;
          video_url: string;
          thumbnail_url?: string;
          duration?: number;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category_id?: string | null;
          video_url?: string;
          thumbnail_url?: string;
          duration?: number;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          video_id: string;
          commenter_name: string;
          content: string;
          is_moderated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          commenter_name: string;
          content: string;
          is_moderated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          video_id?: string;
          commenter_name?: string;
          content?: string;
          is_moderated?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          id: string;
          video_id: string;
          ip_address: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          ip_address: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          video_id?: string;
          ip_address?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          video_id: string;
          description: string;
          reporter_email: string;
          status: 'pending' | 'reviewed' | 'resolved' | 'ignored';
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          video_id: string;
          description: string;
          reporter_email?: string;
          status?: 'pending' | 'reviewed' | 'resolved' | 'ignored';
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          video_id?: string;
          description?: string;
          reporter_email?: string;
          status?: 'pending' | 'reviewed' | 'resolved' | 'ignored';
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_video_views: {
        Args: {
          video_id_param: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Video = Database['public']['Tables']['videos']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type Admin = Database['public']['Tables']['admins']['Row'];
