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
      asap_dispatch_events: {
        Row: {
          booking_id: string
          created_at: string
          currency: string
          dropoff_address: string | null
          eta_hint_minutes: number | null
          expires_at: string
          id: string
          passengers: number
          pickup_address: string | null
          price_cents: number
          route_slug: string
          vehicle_class: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          currency?: string
          dropoff_address?: string | null
          eta_hint_minutes?: number | null
          expires_at: string
          id?: string
          passengers: number
          pickup_address?: string | null
          price_cents: number
          route_slug: string
          vehicle_class: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          currency?: string
          dropoff_address?: string | null
          eta_hint_minutes?: number | null
          expires_at?: string
          id?: string
          passengers?: number
          pickup_address?: string | null
          price_cents?: number
          route_slug?: string
          vehicle_class?: string
        }
        Relationships: [
          {
            foreignKeyName: "asap_dispatch_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asap_dispatch_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "my_job_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asap_dispatch_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "open_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
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
            referencedRelation: "my_job_offers"
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
            referencedRelation: "my_job_offers"
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
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
        }
        Insert: {
          asap_expires_at?: string | null
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
          dispatch_batch?: number
          dispatch_mode?: string | null
          driver_id?: string | null
          dropoff_address?: string | null
          dropoff_point?: Json | null
          eta_minutes?: number | null
          extras?: Json
          flight_number?: string | null
          goodwill_credit_cents?: number
          id?: string
          market?: string | null
          notes?: string | null
          offered_at?: string | null
          partner_id?: string | null
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
          urgency?: string
          user_id?: string | null
          vehicle_class: string
          zone_id?: string | null
        }
        Update: {
          asap_expires_at?: string | null
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
          dispatch_batch?: number
          dispatch_mode?: string | null
          driver_id?: string | null
          dropoff_address?: string | null
          dropoff_point?: Json | null
          eta_minutes?: number | null
          extras?: Json
          flight_number?: string | null
          goodwill_credit_cents?: number
          id?: string
          market?: string | null
          notes?: string | null
          offered_at?: string | null
          partner_id?: string | null
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
          urgency?: string
          user_id?: string | null
          vehicle_class?: string
          zone_id?: string | null
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
            foreignKeyName: "bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "service_zones"
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
      device_tokens: {
        Row: {
          created_at: string
          expo_push_token: string
          id: string
          platform: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expo_push_token: string
          id?: string
          platform: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expo_push_token?: string
          id?: string
          platform?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      driver_documents: {
        Row: {
          created_at: string
          document_type: string
          driver_id: string
          expires_on: string | null
          id: string
          mime_type: string
          original_filename: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          size_bytes: number
          status: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_type: string
          driver_id: string
          expires_on?: string | null
          id?: string
          mime_type: string
          original_filename: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_bytes: number
          status?: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_type?: string
          driver_id?: string
          expires_on?: string | null
          id?: string
          mime_type?: string
          original_filename?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_bytes?: number
          status?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_onboarding_events: {
        Row: {
          actor_id: string | null
          created_at: string
          driver_id: string
          event_type: string
          from_status: string | null
          id: number
          notes: string | null
          to_status: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          driver_id: string
          event_type: string
          from_status?: string | null
          id?: number
          notes?: string | null
          to_status?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          driver_id?: string
          event_type?: string
          from_status?: string | null
          id?: number
          notes?: string | null
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_onboarding_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_onboarding_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_onboarding_submissions: {
        Row: {
          consent_version: string | null
          consented_at: string | null
          created_at: string
          current_step: number
          driver_id: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          consent_version?: string | null
          consented_at?: string | null
          created_at?: string
          current_step?: number
          driver_id: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          consent_version?: string | null
          consented_at?: string | null
          created_at?: string
          current_step?: number
          driver_id?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_onboarding_submissions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_onboarding_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_profiles: {
        Row: {
          approval_status: string
          created_at: string
          dns_strikes: number
          id: string
          id_document_number: string | null
          insurance_number: string | null
          is_online: boolean
          license_number: string | null
          online_at: string | null
          partner_id: string | null
          primary_zone_id: string | null
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
          is_online?: boolean
          license_number?: string | null
          online_at?: string | null
          partner_id?: string | null
          primary_zone_id?: string | null
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
          is_online?: boolean
          license_number?: string | null
          online_at?: string | null
          partner_id?: string | null
          primary_zone_id?: string | null
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
          {
            foreignKeyName: "driver_profiles_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_profiles_primary_zone_id_fkey"
            columns: ["primary_zone_id"]
            isOneToOne: false
            referencedRelation: "service_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      job_offers: {
        Row: {
          batch: number
          booking_id: string
          created_at: string
          driver_id: string
          expires_at: string
          id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          batch?: number
          booking_id: string
          created_at?: string
          driver_id: string
          expires_at: string
          id?: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          batch?: number
          booking_id?: string
          created_at?: string
          driver_id?: string
          expires_at?: string
          id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_offers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_offers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "my_job_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_offers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "open_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_offers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_members: {
        Row: {
          created_at: string
          partner_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          partner_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          partner_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_members_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      partner_zones: {
        Row: {
          partner_id: string
          zone_id: string
        }
        Insert: {
          partner_id: string
          zone_id: string
        }
        Update: {
          partner_id?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_zones_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_zones_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "service_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          dispatch_email: string
          dispatch_mode: string | null
          id: string
          market: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dispatch_email: string
          dispatch_mode?: string | null
          id?: string
          market: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dispatch_email?: string
          dispatch_mode?: string | null
          id?: string
          market?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_currency: string
          preferred_locale: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_currency?: string
          preferred_locale?: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_currency?: string
          preferred_locale?: string
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
      service_zones: {
        Row: {
          created_at: string
          id: string
          lat: number
          lng: number
          market: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          lat: number
          lng: number
          market: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          market?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      my_job_offers: {
        Row: {
          bags_cabin: number | null
          bags_checked: number | null
          batch: number | null
          currency: string | null
          dropoff_address: string | null
          expires_at: string | null
          extras: Json | null
          id: string | null
          market: string | null
          offer_id: string | null
          offer_status: string | null
          offered_at: string | null
          partner_id: string | null
          passengers: number | null
          pickup_address: string | null
          pickup_at: string | null
          price_cents: number | null
          return_at: string | null
          route_slug: string | null
          trip_type: string | null
          vehicle_class: string | null
          zone_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "service_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      open_jobs: {
        Row: {
          asap_expires_at: string | null
          bags_cabin: number | null
          bags_checked: number | null
          created_at: string | null
          currency: string | null
          dropoff_address: string | null
          eta_minutes: number | null
          extras: Json | null
          id: string | null
          passengers: number | null
          pickup_address: string | null
          pickup_at: string | null
          price_cents: number | null
          return_at: string | null
          route_slug: string | null
          trip_type: string | null
          urgency: string | null
          vehicle_class: string | null
        }
        Insert: {
          asap_expires_at?: string | null
          bags_cabin?: number | null
          bags_checked?: number | null
          created_at?: string | null
          currency?: string | null
          dropoff_address?: string | null
          eta_minutes?: number | null
          extras?: Json | null
          id?: string | null
          passengers?: number | null
          pickup_address?: string | null
          pickup_at?: string | null
          price_cents?: number | null
          return_at?: string | null
          route_slug?: string | null
          trip_type?: string | null
          urgency?: string | null
          vehicle_class?: string | null
        }
        Update: {
          asap_expires_at?: string | null
          bags_cabin?: number | null
          bags_checked?: number | null
          created_at?: string | null
          currency?: string | null
          dropoff_address?: string | null
          eta_minutes?: number | null
          extras?: Json | null
          id?: string | null
          passengers?: number | null
          pickup_address?: string | null
          pickup_at?: string | null
          price_cents?: number | null
          return_at?: string | null
          route_slug?: string | null
          trip_type?: string | null
          urgency?: string | null
          vehicle_class?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_job_to_driver: {
        Args: { p_booking_id: string; p_driver_id: string }
        Returns: {
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_asap_booking: {
        Args: {
          p_bags_cabin?: number
          p_bags_checked?: number
          p_currency?: string
          p_customer_email: string
          p_customer_name: string
          p_customer_phone: string
          p_dropoff_address: string
          p_dropoff_lat?: number
          p_dropoff_lng?: number
          p_eta_hint_minutes?: number
          p_notes?: string
          p_passengers: number
          p_pickup_address: string
          p_pickup_lat?: number
          p_pickup_lng?: number
          p_price_cents: number
          p_route_slug: string
          p_vehicle_class: string
        }
        Returns: {
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_dispatch_for_booking: {
        Args: {
          p_booking_id: string
          p_lat?: number
          p_lng?: number
          p_market?: string
          p_preferred_partner_id?: string
        }
        Returns: {
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_offer_batch: {
        Args: { p_booking_id: string; p_limit?: number }
        Returns: number
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
      default_dispatch_mode: { Args: { p_market: string }; Returns: string }
      expire_asap_bookings: { Args: never; Returns: number }
      expire_job_offers: { Args: never; Returns: Json }
      get_asap_dispatch_status: {
        Args: { p_booking_id: string }
        Returns: {
          booking_id: string
          currency: string
          driver_first_name: string
          dropoff_address: string
          eta_minutes: number
          expired: boolean
          expires_at: string
          pickup_address: string
          price_cents: number
          status: string
          urgency: string
        }[]
      }
      haversine_km: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      is_admin: { Args: never; Returns: boolean }
      is_approved_driver: { Args: never; Returns: boolean }
      is_partner_dispatcher: {
        Args: { p_partner_id: string }
        Returns: boolean
      }
      my_partner_ids: { Args: never; Returns: string[] }
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
      pick_partner_for_zone: { Args: { p_zone_id: string }; Returns: string }
      request_cancellation: {
        Args: {
          p_booking_id: string
          p_note?: string
          p_prefer_credit?: boolean
          p_reason: string
        }
        Returns: {
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
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
      resolve_zone_id: {
        Args: { p_lat: number; p_lng: number; p_market: string }
        Returns: string
      }
      respond_to_offer: {
        Args: { p_accept: boolean; p_offer_id: string }
        Returns: {
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      review_driver_document: {
        Args: {
          p_document_id: string
          p_rejection_reason?: string
          p_status: string
        }
        Returns: {
          created_at: string
          document_type: string
          driver_id: string
          expires_on: string | null
          id: string
          mime_type: string
          original_filename: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          size_bytes: number
          status: string
          storage_path: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "driver_documents"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      review_driver_onboarding: {
        Args: { p_driver_id: string; p_notes?: string; p_status: string }
        Returns: {
          consent_version: string | null
          consented_at: string | null
          created_at: string
          current_step: number
          driver_id: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          submitted_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "driver_onboarding_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_driver_online: {
        Args: { p_online: boolean }
        Returns: {
          approval_status: string
          created_at: string
          dns_strikes: number
          id: string
          id_document_number: string | null
          insurance_number: string | null
          is_online: boolean
          license_number: string | null
          online_at: string | null
          partner_id: string | null
          primary_zone_id: string | null
          updated_at: string
          vehicle_class: string | null
          vehicle_make_model: string | null
          vehicle_plate: string | null
          vehicle_registration_number: string | null
        }
        SetofOptions: {
          from: "*"
          to: "driver_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_partner_status: {
        Args: { p_partner_id: string; p_status: string }
        Returns: {
          created_at: string
          dispatch_email: string
          dispatch_mode: string | null
          id: string
          market: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "partners"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_driver_onboarding: {
        Args: { p_consent_version: string }
        Returns: {
          consent_version: string | null
          consented_at: string | null
          created_at: string
          current_step: number
          driver_id: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          submitted_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "driver_onboarding_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_job_status: {
        Args: { p_booking_id: string; p_status: string }
        Returns: {
          asap_expires_at: string | null
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
          dispatch_batch: number
          dispatch_mode: string | null
          driver_id: string | null
          dropoff_address: string | null
          dropoff_point: Json | null
          eta_minutes: number | null
          extras: Json
          flight_number: string | null
          goodwill_credit_cents: number
          id: string
          market: string | null
          notes: string | null
          offered_at: string | null
          partner_id: string | null
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
          urgency: string
          user_id: string | null
          vehicle_class: string
          zone_id: string | null
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
