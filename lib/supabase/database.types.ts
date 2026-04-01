export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type RoleValue = "superadmin" | "business_admin" | "customer";
type RewardTypeValue = "standard" | "special" | "bonus";
type PointTransactionTypeValue = "earn" | "redeem" | "adjustment" | "bonus";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: RoleValue;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: RoleValue;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: RoleValue;
          created_at?: string;
        };
        Relationships: [];
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          owner_name: string | null;
          owner_email: string | null;
          owner_phone: string | null;
          primary_color: string;
          secondary_color: string;
          accent_color: string;
          font_family: string;
          welcome_text: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          owner_name?: string | null;
          owner_email?: string | null;
          owner_phone?: string | null;
          primary_color?: string;
          secondary_color?: string;
          accent_color?: string;
          font_family?: string;
          welcome_text?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          owner_name?: string | null;
          owner_email?: string | null;
          owner_phone?: string | null;
          primary_color?: string;
          secondary_color?: string;
          accent_color?: string;
          font_family?: string;
          welcome_text?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      business_admin_assignments: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      business_memberships: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          joined_at: string;
          last_activity_at: string | null;
          current_points: number;
          current_tier: string;
          total_points_earned: number;
          total_points_redeemed: number;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id: string;
          joined_at?: string;
          last_activity_at?: string | null;
          current_points?: number;
          current_tier?: string;
          total_points_earned?: number;
          total_points_redeemed?: number;
        };
        Update: {
          id?: string;
          business_id?: string;
          user_id?: string;
          joined_at?: string;
          last_activity_at?: string | null;
          current_points?: number;
          current_tier?: string;
          total_points_earned?: number;
          total_points_redeemed?: number;
        };
        Relationships: [];
      };
      rewards: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          description: string | null;
          reward_type: RewardTypeValue;
          points_required: number;
          duration_type: string | null;
          starts_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          description?: string | null;
          reward_type: RewardTypeValue;
          points_required: number;
          duration_type?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          is_active?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          title?: string;
          description?: string | null;
          reward_type?: RewardTypeValue;
          points_required?: number;
          duration_type?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          is_active?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reward_redemptions: {
        Row: {
          id: string;
          reward_id: string;
          business_id: string;
          user_id: string;
          redeemed_at: string;
          delivered_by_user_id: string | null;
          points_spent: number;
          status: string;
        };
        Insert: {
          id?: string;
          reward_id: string;
          business_id: string;
          user_id: string;
          redeemed_at?: string;
          delivered_by_user_id?: string | null;
          points_spent: number;
          status?: string;
        };
        Update: {
          id?: string;
          reward_id?: string;
          business_id?: string;
          user_id?: string;
          redeemed_at?: string;
          delivered_by_user_id?: string | null;
          points_spent?: number;
          status?: string;
        };
        Relationships: [];
      };
      point_transactions: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          performed_by_user_id: string | null;
          type: PointTransactionTypeValue;
          points_delta: number;
          source: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id: string;
          performed_by_user_id?: string | null;
          type: PointTransactionTypeValue;
          points_delta: number;
          source?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          user_id?: string;
          performed_by_user_id?: string | null;
          type?: PointTransactionTypeValue;
          points_delta?: number;
          source?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          business_id: string | null;
          target_user_id: string | null;
          entity_type: string;
          entity_id: string | null;
          action_type: string;
          metadata_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          business_id?: string | null;
          target_user_id?: string | null;
          entity_type: string;
          entity_id?: string | null;
          action_type: string;
          metadata_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          business_id?: string | null;
          target_user_id?: string | null;
          entity_type?: string;
          entity_id?: string | null;
          action_type?: string;
          metadata_json?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
