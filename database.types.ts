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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      book: {
        Row: {
          description: string | null
          grade: number
          id: number
          image: string
          name: string
          route: string
        }
        Insert: {
          description?: string | null
          grade: number
          id?: number
          image: string
          name: string
          route: string
        }
        Update: {
          description?: string | null
          grade?: number
          id?: number
          image?: string
          name?: string
          route?: string
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          id: number
          name: string | null
          profileImage: string | null
          userId: string
          xp: number
        }
        Insert: {
          id?: number
          name?: string | null
          profileImage?: string | null
          userId: string
          xp: number
        }
        Update: {
          id?: number
          name?: string | null
          profileImage?: string | null
          userId?: string
          xp?: number
        }
        Relationships: []
      }
      lesson: {
        Row: {
          bookId: number | null
          grade: number
          id: number
          name: string
          sort: number
        }
        Insert: {
          bookId?: number | null
          grade: number
          id?: number
          name: string
          sort: number
        }
        Update: {
          bookId?: number | null
          grade?: number
          id?: number
          name?: string
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription: {
        Row: {
          bookId: number | null
          description: string | null
          grade: number | null
          id: number
          isFullSubscription: boolean
          name: string
          price: number
        }
        Insert: {
          bookId?: number | null
          description?: string | null
          grade?: number | null
          id?: number
          isFullSubscription: boolean
          name: string
          price: number
        }
        Update: {
          bookId?: number | null
          description?: string | null
          grade?: number | null
          id?: number
          isFullSubscription?: boolean
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscription_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["id"]
          },
        ]
      }
      test_package: {
        Row: {
          bookId: number
          created_at: string | null
          description: string | null
          grade: number
          id: number
          name: string
          price: number
          question_count: number
        }
        Insert: {
          bookId: number
          created_at?: string | null
          description?: string | null
          grade: number
          id?: number
          name: string
          price: number
          question_count: number
        }
        Update: {
          bookId?: number
          created_at?: string | null
          description?: string | null
          grade?: number
          id?: number
          name?: string
          price?: number
          question_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_package_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["id"]
          },
        ]
      }
      topic: {
        Row: {
          id: number
          lessonId: number
          name: string
          sort: number
        }
        Insert: {
          id?: number
          lessonId: number
          name: string
          sort: number
        }
        Update: {
          id?: number
          lessonId?: number
          name?: string
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "topic_lessonId_fkey"
            columns: ["lessonId"]
            isOneToOne: false
            referencedRelation: "lesson"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscription: {
        Row: {
          id: number
          purchasedAt: string
          subscriptionId: number
          userId: string
        }
        Insert: {
          id?: number
          purchasedAt?: string
          subscriptionId: number
          userId: string
        }
        Update: {
          id?: number
          purchasedAt?: string
          subscriptionId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscription_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: false
            referencedRelation: "subscription"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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
