export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          assigned_at: string | null;
          bags_cabin: number;
          bags_checked: number;
          cancellation_note: string | null;
          cancellation_reason: string | null;
          cancelled_at: string | null;
          cancelled_by: string | null;
          created_at: string;
          currency: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          dispatch_batch: number;
          dispatch_mode: string | null;
          driver_id: string | null;
          extras: Json;
          flight_number: string | null;
          goodwill_credit_cents: number;
          id: string;
          market: string | null;
          notes: string | null;
          offered_at: string | null;
          partner_id: string | null;
          passengers: number;
          payment_status: string;
          pickup_at: string;
          pickup_address: string | null;
          pickup_point: Json | null;
          prefer_credit: boolean;
          dropoff_address: string | null;
          dropoff_point: Json | null;
          price_cents: number;
          quote_id: string | null;
          refund_amount_cents: number | null;
          refund_percent: number | null;
          refund_status: string;
          return_at: string | null;
          return_flight_number: string | null;
          route_slug: string;
          status: string;
          stripe_payment_intent_id: string | null;
          trip_type: string;
          updated_at: string;
          urgency: string;
          asap_expires_at: string | null;
          eta_minutes: number | null;
          user_id: string | null;
          vehicle_class: string;
          zone_id: string | null;
        };
        Insert: {
          assigned_at?: string | null;
          bags_cabin?: number;
          bags_checked?: number;
          cancellation_note?: string | null;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          currency?: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          dispatch_batch?: number;
          dispatch_mode?: string | null;
          driver_id?: string | null;
          extras?: Json;
          flight_number?: string | null;
          goodwill_credit_cents?: number;
          id?: string;
          market?: string | null;
          notes?: string | null;
          offered_at?: string | null;
          partner_id?: string | null;
          passengers: number;
          payment_status?: string;
          pickup_at: string;
          pickup_address?: string | null;
          pickup_point?: Json | null;
          prefer_credit?: boolean;
          dropoff_address?: string | null;
          dropoff_point?: Json | null;
          price_cents: number;
          quote_id?: string | null;
          refund_amount_cents?: number | null;
          refund_percent?: number | null;
          refund_status?: string;
          return_at?: string | null;
          return_flight_number?: string | null;
          route_slug: string;
          status?: string;
          stripe_payment_intent_id?: string | null;
          trip_type?: string;
          updated_at?: string;
          urgency?: string;
          asap_expires_at?: string | null;
          eta_minutes?: number | null;
          user_id?: string | null;
          vehicle_class: string;
          zone_id?: string | null;
        };
        Update: {
          assigned_at?: string | null;
          bags_cabin?: number;
          bags_checked?: number;
          cancellation_note?: string | null;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          currency?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string;
          dispatch_batch?: number;
          dispatch_mode?: string | null;
          driver_id?: string | null;
          extras?: Json;
          flight_number?: string | null;
          goodwill_credit_cents?: number;
          id?: string;
          market?: string | null;
          notes?: string | null;
          offered_at?: string | null;
          partner_id?: string | null;
          passengers?: number;
          payment_status?: string;
          pickup_at?: string;
          pickup_address?: string | null;
          pickup_point?: Json | null;
          prefer_credit?: boolean;
          dropoff_address?: string | null;
          dropoff_point?: Json | null;
          price_cents?: number;
          quote_id?: string | null;
          refund_amount_cents?: number | null;
          refund_percent?: number | null;
          refund_status?: string;
          return_at?: string | null;
          return_flight_number?: string | null;
          route_slug?: string;
          status?: string;
          stripe_payment_intent_id?: string | null;
          trip_type?: string;
          updated_at?: string;
          urgency?: string;
          asap_expires_at?: string | null;
          eta_minutes?: number | null;
          user_id?: string | null;
          vehicle_class?: string;
          zone_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_zone_id_fkey";
            columns: ["zone_id"];
            isOneToOne: false;
            referencedRelation: "service_zones";
            referencedColumns: ["id"];
          },
        ];
      };
      booking_incidents: {
        Row: {
          booking_id: string;
          claimed_wait_until: string | null;
          created_at: string;
          evidence_urls: string[];
          id: string;
          note: string | null;
          opened_by: string;
          opened_by_user_id: string | null;
          resolution: string | null;
          resolution_notes: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          status: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          booking_id: string;
          claimed_wait_until?: string | null;
          created_at?: string;
          evidence_urls?: string[];
          id?: string;
          note?: string | null;
          opened_by: string;
          opened_by_user_id?: string | null;
          resolution?: string | null;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          booking_id?: string;
          claimed_wait_until?: string | null;
          created_at?: string;
          evidence_urls?: string[];
          id?: string;
          note?: string | null;
          opened_by?: string;
          opened_by_user_id?: string | null;
          resolution?: string | null;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booking_incidents_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      quotes: {
        Row: {
          bookable_mode: string;
          breakdown: Json;
          created_at: string;
          currency: string;
          distance_km: number | null;
          expires_at: string;
          extras: Json;
          hours: number | null;
          id: string;
          inputs_hash: string;
          market: string;
          pickup_at: string | null;
          price_cents: number;
          return_at: string | null;
          route_slug: string;
          service: string;
          trip_type: string;
          vehicle_class: string;
        };
        Insert: {
          bookable_mode?: string;
          breakdown?: Json;
          created_at?: string;
          currency?: string;
          distance_km?: number | null;
          expires_at: string;
          extras?: Json;
          hours?: number | null;
          id?: string;
          inputs_hash: string;
          market?: string;
          pickup_at?: string | null;
          price_cents: number;
          return_at?: string | null;
          route_slug: string;
          service?: string;
          trip_type?: string;
          vehicle_class: string;
        };
        Update: {
          bookable_mode?: string;
          breakdown?: Json;
          created_at?: string;
          currency?: string;
          distance_km?: number | null;
          expires_at?: string;
          extras?: Json;
          hours?: number | null;
          id?: string;
          inputs_hash?: string;
          market?: string;
          pickup_at?: string | null;
          price_cents?: number;
          return_at?: string | null;
          route_slug?: string;
          service?: string;
          trip_type?: string;
          vehicle_class?: string;
        };
        Relationships: [];
      };
      saved_travelers: {
        Row: {
          child_seat_needed: boolean;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          notes: string | null;
          phone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          child_seat_needed?: boolean;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          child_seat_needed?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      partner_referrals: {
        Row: {
          active: boolean;
          code: string;
          commission_percent: number;
          created_at: string;
          id: string;
          partner_email: string | null;
          partner_name: string;
        };
        Insert: {
          active?: boolean;
          code: string;
          commission_percent?: number;
          created_at?: string;
          id?: string;
          partner_email?: string | null;
          partner_name: string;
        };
        Update: {
          active?: boolean;
          code?: string;
          commission_percent?: number;
          created_at?: string;
          id?: string;
          partner_email?: string | null;
          partner_name?: string;
        };
        Relationships: [];
      };
      booking_referrals: {
        Row: {
          booking_id: string;
          commission_cents: number;
          created_at: string;
          id: string;
          partner_id: string;
          status: string;
        };
        Insert: {
          booking_id: string;
          commission_cents?: number;
          created_at?: string;
          id?: string;
          partner_id: string;
          status?: string;
        };
        Update: {
          booking_id?: string;
          commission_cents?: number;
          created_at?: string;
          id?: string;
          partner_id?: string;
          status?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          company: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          topic: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          topic?: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          topic?: string;
        };
        Relationships: [];
      };
      driver_profiles: {
        Row: {
          approval_status: string;
          created_at: string;
          dns_strikes: number;
          id: string;
          id_document_number: string | null;
          insurance_number: string | null;
          is_online: boolean;
          license_number: string | null;
          online_at: string | null;
          partner_id: string | null;
          primary_zone_id: string | null;
          updated_at: string;
          vehicle_class: string | null;
          vehicle_make_model: string | null;
          vehicle_plate: string | null;
          vehicle_registration_number: string | null;
        };
        Insert: {
          approval_status?: string;
          created_at?: string;
          dns_strikes?: number;
          id: string;
          id_document_number?: string | null;
          insurance_number?: string | null;
          is_online?: boolean;
          license_number?: string | null;
          online_at?: string | null;
          partner_id?: string | null;
          primary_zone_id?: string | null;
          updated_at?: string;
          vehicle_class?: string | null;
          vehicle_make_model?: string | null;
          vehicle_plate?: string | null;
          vehicle_registration_number?: string | null;
        };
        Update: {
          approval_status?: string;
          created_at?: string;
          dns_strikes?: number;
          id?: string;
          id_document_number?: string | null;
          insurance_number?: string | null;
          is_online?: boolean;
          license_number?: string | null;
          online_at?: string | null;
          partner_id?: string | null;
          primary_zone_id?: string | null;
          updated_at?: string;
          vehicle_class?: string | null;
          vehicle_make_model?: string | null;
          vehicle_plate?: string | null;
          vehicle_registration_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "driver_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "driver_profiles_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "driver_profiles_primary_zone_id_fkey";
            columns: ["primary_zone_id"];
            isOneToOne: false;
            referencedRelation: "service_zones";
            referencedColumns: ["id"];
          },
        ];
      };
      device_tokens: {
        Row: {
          created_at: string;
          expo_push_token: string;
          id: string;
          platform: string;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expo_push_token: string;
          id?: string;
          platform: string;
          role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expo_push_token?: string;
          id?: string;
          platform?: string;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      job_offers: {
        Row: {
          batch: number;
          booking_id: string;
          created_at: string;
          driver_id: string;
          expires_at: string;
          id: string;
          responded_at: string | null;
          status: string;
        };
        Insert: {
          batch?: number;
          booking_id: string;
          created_at?: string;
          driver_id: string;
          expires_at: string;
          id?: string;
          responded_at?: string | null;
          status?: string;
        };
        Update: {
          batch?: number;
          booking_id?: string;
          created_at?: string;
          driver_id?: string;
          expires_at?: string;
          id?: string;
          responded_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_offers_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_offers_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      partners: {
        Row: {
          created_at: string;
          dispatch_email: string;
          dispatch_mode: string | null;
          id: string;
          market: string;
          name: string;
          slug: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          dispatch_email: string;
          dispatch_mode?: string | null;
          id?: string;
          market: string;
          name: string;
          slug: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          dispatch_email?: string;
          dispatch_mode?: string | null;
          id?: string;
          market?: string;
          name?: string;
          slug?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      partner_members: {
        Row: {
          created_at: string;
          partner_id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          partner_id: string;
          role: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          partner_id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "partner_members_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      partner_zones: {
        Row: {
          partner_id: string;
          zone_id: string;
        };
        Insert: {
          partner_id: string;
          zone_id: string;
        };
        Update: {
          partner_id?: string;
          zone_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "partner_zones_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_zones_zone_id_fkey";
            columns: ["zone_id"];
            isOneToOne: false;
            referencedRelation: "service_zones";
            referencedColumns: ["id"];
          },
        ];
      };
      service_zones: {
        Row: {
          created_at: string;
          id: string;
          lat: number;
          lng: number;
          market: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lat: number;
          lng: number;
          market: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lat?: number;
          lng?: number;
          market?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      asap_dispatch_events: {
        Row: {
          id: string;
          booking_id: string;
          route_slug: string;
          vehicle_class: string;
          passengers: number;
          pickup_address: string | null;
          dropoff_address: string | null;
          price_cents: number;
          currency: string;
          eta_hint_minutes: number | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          route_slug: string;
          vehicle_class: string;
          passengers: number;
          pickup_address?: string | null;
          dropoff_address?: string | null;
          price_cents: number;
          currency?: string;
          eta_hint_minutes?: number | null;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          route_slug?: string;
          vehicle_class?: string;
          passengers?: number;
          pickup_address?: string | null;
          dropoff_address?: string | null;
          price_cents?: number;
          currency?: string;
          eta_hint_minutes?: number | null;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "asap_dispatch_events_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      open_jobs: {
        Row: {
          bags_cabin: number | null;
          bags_checked: number | null;
          created_at: string | null;
          currency: string | null;
          dispatch_mode: string | null;
          dropoff_address: string | null;
          extras: Json | null;
          id: string | null;
          market: string | null;
          partner_id: string | null;
          passengers: number | null;
          pickup_address: string | null;
          pickup_at: string | null;
          price_cents: number | null;
          return_at: string | null;
          route_slug: string | null;
          trip_type: string | null;
          vehicle_class: string | null;
          zone_id: string | null;
          urgency: string | null;
          asap_expires_at: string | null;
          eta_minutes: number | null;
        };
        Relationships: [];
      };
      my_job_offers: {
        Row: {
          bags_cabin: number | null;
          bags_checked: number | null;
          batch: number | null;
          currency: string | null;
          dropoff_address: string | null;
          expires_at: string | null;
          extras: Json | null;
          id: string | null;
          market: string | null;
          offer_id: string | null;
          offer_status: string | null;
          offered_at: string | null;
          partner_id: string | null;
          passengers: number | null;
          pickup_address: string | null;
          pickup_at: string | null;
          price_cents: number | null;
          return_at: string | null;
          route_slug: string | null;
          trip_type: string | null;
          vehicle_class: string | null;
          zone_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      assign_job_to_driver: {
        Args: { p_booking_id: string; p_driver_id: string };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      booking_driver_info: {
        Args: { p_booking_id: string };
        Returns: {
          full_name: string;
          phone: string;
          vehicle_make_model: string;
          vehicle_plate: string;
          vehicle_class: string;
        }[];
      };
      claim_job: {
        Args: { p_booking_id: string };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      create_asap_booking: {
        Args: {
          p_route_slug: string;
          p_vehicle_class: string;
          p_passengers: number;
          p_customer_name: string;
          p_customer_email: string;
          p_customer_phone: string;
          p_pickup_address: string;
          p_dropoff_address: string;
          p_price_cents: number;
          p_eta_hint_minutes?: number;
          p_bags_checked?: number;
          p_bags_cabin?: number;
          p_notes?: string | null;
          p_pickup_lat?: number | null;
          p_pickup_lng?: number | null;
          p_dropoff_lat?: number | null;
          p_dropoff_lng?: number | null;
          p_currency?: string;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      get_asap_dispatch_status: {
        Args: { p_booking_id: string };
        Returns: {
          booking_id: string;
          status: string;
          urgency: string;
          eta_minutes: number | null;
          expires_at: string | null;
          price_cents: number;
          currency: string;
          pickup_address: string | null;
          dropoff_address: string | null;
          driver_first_name: string | null;
          expired: boolean;
        }[];
      };
      expire_asap_bookings: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      create_dispatch_for_booking: {
        Args: {
          p_booking_id: string;
          p_market?: string | null;
          p_lat?: number | null;
          p_lng?: number | null;
          p_preferred_partner_id?: string | null;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      create_offer_batch: {
        Args: { p_booking_id: string; p_limit?: number };
        Returns: number;
      };
      create_quote_record: {
        Args: {
          p_route_slug: string;
          p_vehicle_class: string;
          p_trip_type: string;
          p_extras: Json;
          p_pickup_at: string | null;
          p_return_at: string | null;
          p_distance_km: number | null;
          p_hours: number | null;
          p_service: string;
          p_market: string;
          p_bookable_mode: string;
          p_price_cents: number;
          p_breakdown: Json;
          p_inputs_hash: string;
          p_ttl_minutes?: number;
        };
        Returns: Database["public"]["Tables"]["quotes"]["Row"];
      };
      expire_job_offers: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_approved_driver: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_partner_dispatcher: {
        Args: { p_partner_id: string };
        Returns: boolean;
      };
      open_incident: {
        Args: {
          p_booking_id: string;
          p_type: string;
          p_note?: string | null;
          p_claimed_wait_until?: string | null;
          p_evidence_urls?: string[];
        };
        Returns: Database["public"]["Tables"]["booking_incidents"]["Row"];
      };
      request_cancellation: {
        Args: {
          p_booking_id: string;
          p_reason: string;
          p_note?: string | null;
          p_prefer_credit?: boolean;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      resolve_incident: {
        Args: {
          p_incident_id: string;
          p_resolution: string;
          p_notes?: string | null;
          p_reject?: boolean;
        };
        Returns: Database["public"]["Tables"]["booking_incidents"]["Row"];
      };
      respond_to_offer: {
        Args: { p_offer_id: string; p_accept: boolean };
        Returns: Database["public"]["Tables"]["bookings"]["Row"] | null;
      };
      set_driver_online: {
        Args: { p_online: boolean };
        Returns: Database["public"]["Tables"]["driver_profiles"]["Row"];
      };
      set_partner_status: {
        Args: { p_partner_id: string; p_status: string };
        Returns: Database["public"]["Tables"]["partners"]["Row"];
      };
      update_job_status: {
        Args: { p_booking_id: string; p_status: string };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
