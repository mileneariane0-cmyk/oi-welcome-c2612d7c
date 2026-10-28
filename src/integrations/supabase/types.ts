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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      quote_request_contacts: {
        Row: {quote_id:string; name:string; phone:string; created_at:string}
        Insert: {quote_id:string; name:string; phone:string; created_at?:string}
        Update: {quote_id?:string; name?:string; phone?:string; created_at?:string}
        Relationships: []
      }
      store_content: {
        Row: {key: string; content: Json; published: boolean; updated_at: string}
        Insert: {key: string; content?: Json; published?: boolean; updated_at?: string}
        Update: {key?: string; content?: Json; published?: boolean; updated_at?: string}
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          destination_url: string | null
          ends_at: string | null
          id: string
          media_type: string
          position: number
          published: boolean
          starts_at: string | null
          storage_path: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_url?: string | null
          ends_at?: string | null
          id?: string
          media_type: string
          position?: number
          published?: boolean
          starts_at?: string | null
          storage_path: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_url?: string | null
          ends_at?: string | null
          id?: string
          media_type?: string
          position?: number
          published?: boolean
          starts_at?: string | null
          storage_path?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          published: boolean
          show_on_home: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          published?: boolean
          show_on_home?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          published?: boolean
          show_on_home?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number | null
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_files: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          order_id: string | null
          original_name: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          order_id?: string | null
          original_name: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          order_id?: string | null
          original_name?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_files_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_media: {
        Row: {
          created_at: string
          id: string
          invitation_id: string
          media_type: string
          position: number
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitation_id: string
          media_type: string
          position?: number
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitation_id?: string
          media_type?: string
          position?: number
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_media_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_pages: {
        Row: {
          content: Json
          created_at: string
          customer_id: string
          event_at: string | null
          id: string
          order_id: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          customer_id: string
          event_at?: string | null
          id?: string
          order_id?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          customer_id?: string
          event_at?: string | null
          id?: string
          order_id?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_pages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_pages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_request_limits: {
        Row: {
          request_key: string
          requests: number
          window_start: string
        }
        Insert: {
          request_key: string
          requests?: number
          window_start?: string
        }
        Update: {
          request_key?: string
          requests?: number
          window_start?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          customization: Json
          id: string
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          unit_price: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          customization?: Json
          id?: string
          name: string
          order_id: string
          product_id?: string | null
          quantity: number
          unit_price: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          customization?: Json
          id?: string
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string
          customer_id: string
          due_at: string | null
          id: string
          notes: string | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          customer_id: string
          due_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          customer_id?: string
          due_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proofs: {
        Row: {
          created_at: string
          id: string
          payment_id: string
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_id: string
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_id?: string
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          order_id: string
          paid_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method?: string
          order_id: string
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id?: string
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          created_at: string
          id: string
          media_type: string
          position: number
          product_id: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_type: string
          position?: number
          product_id: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          position?: number
          product_id?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          name: string
          price: number | null
          product_id: string
          sku: string | null
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          name: string
          price?: number | null
          product_id: string
          sku?: string | null
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          name?: string
          price?: number | null
          product_id?: string
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          id: string
          name: string
          personalization_instructions: string
          preview_url: string | null
          price: number
          product_type: string
          promotional_price: number | null
          published: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name: string
          personalization_instructions?: string
          preview_url?: string | null
          price?: number
          product_type?: string
          promotional_price?: number | null
          published?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          personalization_instructions?: string
          preview_url?: string | null
          price?: number
          product_type?: string
          promotional_price?: number | null
          published?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string
          id: string
          preferences: Json
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string
          id: string
          preferences?: Json
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string
          id?: string
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number | null
          created_at: string
          customer_id: string | null
          details: string
          id: string
          order_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          customer_id?: string | null
          details: string
          id?: string
          order_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          customer_id?: string | null
          details?: string
          id?: string
          order_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvp_responses: {
        Row: {
          attendance: string
          created_at: string
          guest_name: string
          id: string
          invitation_id: string
          party_size: number
          updated_at: string
        }
        Insert: {
          attendance: string
          created_at?: string
          guest_name: string
          id?: string
          invitation_id: string
          party_size?: number
          updated_at?: string
        }
        Update: {
          attendance?: string
          created_at?: string
          guest_name?: string
          id?: string
          invitation_id?: string
          party_size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      request_public_quote: {Args: {p_name: string; p_phone: string; p_details: string}; Returns: string}
      allowed_platform_file: {
        Args: { bucket: string; filename: string; mime: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_invitation_rsvp: {
        Args: {
          p_attendance: string
          p_name: string
          p_party_size: number
          p_request_key: string
          p_slug: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
