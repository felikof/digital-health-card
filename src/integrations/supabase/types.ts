export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          target_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          target_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consultations: {
        Row: {
          created_at: string | null
          date: string | null
          diagnostic: string
          examens: string | null
          id: string
          medecin_id: string
          notes: string | null
          patient_id: string
          symptomes: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          diagnostic: string
          examens?: string | null
          id?: string
          medecin_id: string
          notes?: string | null
          patient_id: string
          symptomes: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          diagnostic?: string
          examens?: string | null
          id?: string
          medecin_id?: string
          notes?: string | null
          patient_id?: string
          symptomes?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_medecin_id_fkey"
            columns: ["medecin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivrances: {
        Row: {
          created_at: string | null
          date_delivrance: string | null
          id: string
          lot: string | null
          notes: string | null
          ordonnance_id: string
          pharmacien_id: string
          quantite: number
        }
        Insert: {
          created_at?: string | null
          date_delivrance?: string | null
          id?: string
          lot?: string | null
          notes?: string | null
          ordonnance_id: string
          pharmacien_id: string
          quantite: number
        }
        Update: {
          created_at?: string | null
          date_delivrance?: string | null
          id?: string
          lot?: string | null
          notes?: string | null
          ordonnance_id?: string
          pharmacien_id?: string
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivrances_ordonnance_id_fkey"
            columns: ["ordonnance_id"]
            isOneToOne: false
            referencedRelation: "ordonnances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivrances_pharmacien_id_fkey"
            columns: ["pharmacien_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          hash: string | null
          id: string
          nom: string
          owner_id: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          hash?: string | null
          id?: string
          nom: string
          owner_id: string
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          hash?: string | null
          id?: string
          nom?: string
          owner_id?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ordonnances: {
        Row: {
          consultation_id: string | null
          contenu: Json
          created_at: string | null
          date: string | null
          id: string
          patient_id: string
          prescripteur_id: string
          qr_code: string | null
          signature_electronique: string
          statut: Database["public"]["Enums"]["ordonnance_statut"] | null
          updated_at: string | null
        }
        Insert: {
          consultation_id?: string | null
          contenu: Json
          created_at?: string | null
          date?: string | null
          id?: string
          patient_id: string
          prescripteur_id: string
          qr_code?: string | null
          signature_electronique: string
          statut?: Database["public"]["Enums"]["ordonnance_statut"] | null
          updated_at?: string | null
        }
        Update: {
          consultation_id?: string | null
          contenu?: Json
          created_at?: string | null
          date?: string | null
          id?: string
          patient_id?: string
          prescripteur_id?: string
          qr_code?: string | null
          signature_electronique?: string
          statut?: Database["public"]["Enums"]["ordonnance_statut"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordonnances_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordonnances_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordonnances_prescripteur_id_fkey"
            columns: ["prescripteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allergies: string | null
          antecedents: string | null
          created_at: string | null
          date_naissance: string | null
          id: string
          nom: string
          prenom: string
          qr_id: string
          telephone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string | null
          antecedents?: string | null
          created_at?: string | null
          date_naissance?: string | null
          id?: string
          nom: string
          prenom: string
          qr_id: string
          telephone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string | null
          antecedents?: string | null
          created_at?: string | null
          date_naissance?: string | null
          id?: string
          nom?: string
          prenom?: string
          qr_id?: string
          telephone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_qr_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "medecin" | "pharmacien" | "admin"
      ordonnance_statut: "active" | "delivree" | "expiree" | "annulee"
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
    Enums: {
      app_role: ["patient", "medecin", "pharmacien", "admin"],
      ordonnance_statut: ["active", "delivree", "expiree", "annulee"],
    },
  },
} as const
