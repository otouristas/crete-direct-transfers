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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      booking_incidents: {
        Row: {
          booking_id: string
          claimed_wait_until: string | null
          created_at: string
          evidence_urls: string[]
          id: string
          note: string | null
          opened_by: string
          opened_by_user_id: string | null
          resolution: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          claimed_wait_until?: string | null
          created_at?: string
          evidence_urls?: string[]
          id?: string
          note?: string | null
          opened_by: string
          opened_by_user_id?: string | null
          resolution?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          claimed_wait_until?: string | null
          created_at?: string
          evidence_urls?: string[]
          id?: string
          note?: string | null
          opened_by?: string
          opened_by_user_id?: string | null
          resolution?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "open_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_referrals: {
        Row: {
          booking_id: string
          commission_cents: number
          created_at: string
          id: string
          partner_id: string
          status: string
        }
        Insert: {
          booking_id: string
          commission_cents?: number
          created_at?: string
          id?: string
          partner_id: string
          status?: string
        }
        Update: {
          booking_id?: string
          commission_cents?: number
          created_at?: string
          id?: string
          partner_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_referrals_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_referrals_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "open_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          assigned_at: string | null
          bags_cabin: number
          bags_checked: number
          cancellation_note: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          notes: string | null
          passengers: number
          payment_status: string
          pickup_address: string | null
          pickup_at: string
          pickup_point: Json | null
          prefer_credit: boolean
          price_cents: number
          quote_id: string | null
          refund_amount_cents: number | null
          refund_percent: number | null
          refund_status: string
          return_at: string | null
          return_flight_number: string | null
          route_slug: string
          status: string
          stripe_payment_intent_id: string | null
          trip_type: string
          updated_at: string
          user_id: string | null
          vehicle_class: string
        }
        Insert: {
          assigned_at?: string | null
          bags_cabin?: number
          bags_checked?: number
          cancellation_note?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          driver_id?: string | null
          dropoff_address?: string | null
          dropoff_point?: Json | null
          extras?: Json
          flight_number?: string | null
          goodwill_credit_cents?: number
          id?: string
          notes?: string | null
          passengers: number
          payment_status?: string
          pickup_address?: string | null
          pickup_at: string
          pickup_point?: Json | null
          prefer_credit?: boolean
          price_cents: number
          quote_id?: string | null
          refund_amount_cents?: number | null
          refund_percent?: number | null
          refund_status?: string
          return_at?: string | null
          return_flight_number?: string | null
          route_slug: string
          status?: string
          stripe_payment_intent_id?: string | null
          trip_type?: string
          updated_at?: string
          user_id?: string | null
          vehicle_class: string
        }
        Update: {
          assigned_at?: string | null
          bags_cabin?: number
          bags_checked?: number
          cancellation_note?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          driver_id?: string | null
          dropoff_address?: string | null
          dropoff_point?: Json | null
          extras?: Json
          flight_number?: string | null
          goodwill_credit_cents?: number
          id?: string
          notes?: string | null
          passengers?: number
          payment_status?: string
          pickup_address?: string | null
          pickup_at?: string
          pickup_point?: Json | null
          prefer_credit?: boolean
          price_cents?: number
          quote_id?: string | null
          refund_amount_cents?: number | null
          refund_percent?: number | null
          refund_status?: string
          return_at?: string | null
          return_flight_number?: string | null
          route_slug?: string
          status?: string
          stripe_payment_intent_id?: string | null
          trip_type?: string
          updated_at?: string
          user_id?: string | null
          vehicle_class?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          topic: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          topic?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          topic?: string
        }
        Relationships: []
      }
      driver_profiles: {
        Row: {
          approval_status: string
          created_at: string
          dns_strikes: number
          id: string
          id_document_number: string | null
          insurance_number: string | null
          license_number: string | null
          updated_at: string
          vehicle_class: string | null
          vehicle_make_model: string | null
          vehicle_plate: string | null
          vehicle_registration_number: string | null
        }
        Insert: {
          approval_status?: string
          created_at?: string
          dns_strikes?: number
          id: string
          id_document_number?: string | null
          insurance_number?: string | null
          license_number?: string | null
          updated_at?: string
          vehicle_class?: string | null
          vehicle_make_model?: string | null
          vehicle_plate?: string | null
          vehicle_registration_number?: string | null
        }
        Update: {
          approval_status?: string
          created_at?: string
          dns_strikes?: number
          id?: string
          id_document_number?: string | null
          insurance_number?: string | null
          license_number?: string | null
          updated_at?: string
          vehicle_class?: string | null
          vehicle_make_model?: string | null
          vehicle_plate?: string | null
          vehicle_registration_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_referrals: {
        Row: {
          active: boolean
          code: string
          commission_percent: number
          created_at: string
          id: string
          partner_email: string | null
          partner_name: string
        }
        Insert: {
          active?: boolean
          code: string
          commission_percent?: number
          created_at?: string
          id?: string
          partner_email?: string | null
          partner_name: string
        }
        Update: {
          active?: boolean
          code?: string
          commission_percent?: number
          created_at?: string
          id?: string
          partner_email?: string | null
          partner_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          bookable_mode: string
          breakdown: Json
          created_at: string
          currency: string
          distance_km: number | null
          expires_at: string
          extras: Json
          hours: number | null
          id: string
          inputs_hash: string
          market: string
          pickup_at: string | null
          price_cents: number
          return_at: string | null
          route_slug: string
          service: string
          trip_type: string
          vehicle_class: string
        }
        Insert: {
          bookable_mode?: string
          breakdown?: Json
          created_at?: string
          currency?: string
          distance_km?: number | null
          expires_at: string
          extras?: Json
          hours?: number | null
          id?: string
          inputs_hash: string
          market?: string
          pickup_at?: string | null
          price_cents: number
          return_at?: string | null
          route_slug: string
          service?: string
          trip_type?: string
          vehicle_class: string
        }
        Update: {
          bookable_mode?: string
          breakdown?: Json
          created_at?: string
          currency?: string
          distance_km?: number | null
          expires_at?: string
          extras?: Json
          hours?: number | null
          id?: string
          inputs_hash?: string
          market?: string
          pickup_at?: string | null
          price_cents?: number
          return_at?: string | null
          route_slug?: string
          service?: string
          trip_type?: string
          vehicle_class?: string
        }
        Relationships: []
      }
      saved_travelers: {
        Row: {
          child_seat_needed: boolean
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          child_seat_needed?: boolean
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          child_seat_needed?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      open_jobs: {
        Row: {
          bags_cabin: number | null
          bags_checked: number | null
          created_at: string | null
          currency: string | null
          dropoff_address: string | null
          extras: Json | null
          id: string | null
          passengers: number | null
          pickup_address: string | null
          pickup_at: string | null
          price_cents: number | null
          return_at: string | null
          route_slug: string | null
          trip_type: string | null
          vehicle_class: string | null
        }
        Insert: {
          bags_cabin?: number | null
          bags_checked?: number | null
          created_at?: string | null
          currency?: string | null
          dropoff_address?: string | null
          extras?: Json | null
          id?: string | null
          passengers?: number | null
          pickup_address?: string | null
          pickup_at?: string | null
          price_cents?: number | null
          return_at?: string | null
          route_slug?: string | null
          trip_type?: string | null
          vehicle_class?: string | null
        }
        Update: {
          bags_cabin?: number | null
          bags_checked?: number | null
          created_at?: string | null
          currency?: string | null
          dropoff_address?: string | null
          extras?: Json | null
          id?: string | null
          passengers?: number | null
          pickup_address?: string | null
          pickup_at?: string | null
          price_cents?: number | null
          return_at?: string | null
          route_slug?: string | null
          trip_type?: string | null
          vehicle_class?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      booking_driver_info: {
        Args: { p_booking_id: string }
        Returns: {
          full_name: string
          phone: string
          vehicle_class: string
          vehicle_make_model: string
          vehicle_plate: string
        }[]
      }
      booking_wait_minutes: {
        Args: {
          p_flight_number: string
          p_pickup_address: string
          p_route_slug: string
        }
        Returns: number
      }
      claim_job: {
        Args: { p_booking_id: string }
        Returns: {
          assigned_at: string | null
          bags_cabin: number
          bags_checked: number
          cancellation_note: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          notes: string | null
          passengers: number
          payment_status: string
          pickup_address: string | null
          pickup_at: string
          pickup_point: Json | null
          prefer_credit: boolean
          price_cents: number
          quote_id: string | null
          refund_amount_cents: number | null
          refund_percent: number | null
          refund_status: string
          return_at: string | null
          return_flight_number: string | null
          route_slug: string
          status: string
          stripe_payment_intent_id: string | null
          trip_type: string
          updated_at: string
          user_id: string | null
          vehicle_class: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_quote_record: {
        Args: {
          p_bookable_mode: string
          p_breakdown: Json
          p_distance_km: number
          p_extras: Json
          p_hours: number
          p_inputs_hash: string
          p_market: string
          p_pickup_at: string
          p_price_cents: number
          p_return_at: string
          p_route_slug: string
          p_service: string
          p_trip_type: string
          p_ttl_minutes?: number
          p_vehicle_class: string
        }
        Returns: {
          bookable_mode: string
          breakdown: Json
          created_at: string
          currency: string
          distance_km: number | null
          expires_at: string
          extras: Json
          hours: number | null
          id: string
          inputs_hash: string
          market: string
          pickup_at: string | null
          price_cents: number
          return_at: string | null
          route_slug: string
          service: string
          trip_type: string
          vehicle_class: string
        }
        SetofOptions: {
          from: "*"
          to: "quotes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_admin: { Args: never; Returns: boolean }
      is_approved_driver: { Args: never; Returns: boolean }
      open_incident: {
        Args: {
          p_booking_id: string
          p_claimed_wait_until?: string
          p_evidence_urls?: string[]
          p_note?: string
          p_type: string
        }
        Returns: {
          booking_id: string
          claimed_wait_until: string | null
          created_at: string
          evidence_urls: string[]
          id: string
          note: string | null
          opened_by: string
          opened_by_user_id: string | null
          resolution: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          type: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "booking_incidents"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      owns_booking: {
        Args: { p_booking: Database["public"]["Tables"]["bookings"]["Row"] }
        Returns: boolean
      }
      request_cancellation: {
        Args: {
          p_booking_id: string
          p_note?: string
          p_prefer_credit?: boolean
          p_reason: string
        }
        Returns: {
          assigned_at: string | null
          bags_cabin: number
          bags_checked: number
          cancellation_note: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          notes: string | null
          passengers: number
          payment_status: string
          pickup_address: string | null
          pickup_at: string
          pickup_point: Json | null
          prefer_credit: boolean
          price_cents: number
          quote_id: string | null
          refund_amount_cents: number | null
          refund_percent: number | null
          refund_status: string
          return_at: string | null
          return_flight_number: string | null
          route_slug: string
          status: string
          stripe_payment_intent_id: string | null
          trip_type: string
          updated_at: string
          user_id: string | null
          vehicle_class: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      resolve_incident: {
        Args: {
          p_incident_id: string
          p_notes?: string
          p_reject?: boolean
          p_resolution: string
        }
        Returns: {
          booking_id: string
          claimed_wait_until: string | null
          created_at: string
          evidence_urls: string[]
          id: string
          note: string | null
          opened_by: string
          opened_by_user_id: string | null
          resolution: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          type: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "booking_incidents"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_job_status: {
        Args: { p_booking_id: string; p_status: string }
        Returns: {
          assigned_at: string | null
          bags_cabin: number
          bags_checked: number
          cancellation_note: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          notes: string | null
          passengers: number
          payment_status: string
          pickup_address: string | null
          pickup_at: string
          pickup_point: Json | null
          prefer_credit: boolean
          price_cents: number
          quote_id: string | null
          refund_amount_cents: number | null
          refund_percent: number | null
          refund_status: string
          return_at: string | null
          return_flight_number: string | null
          route_slug: string
          status: string
          stripe_payment_intent_id: string | null
          trip_type: string
          updated_at: string
          user_id: string | null
          vehicle_class: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
