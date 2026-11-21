export interface User {
  id: number;
  email: string;
  phone_number: string;
  full_name: string;
  role: 'driver' | 'passenger' | 'both';
  wilaya_code?: number;
  wilaya_name?: string;
  bio?: string;
  avatar_url?: string;
  rating_avg: number;
  rating_count: number;
  trips_completed_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  user_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate?: string;
  comfort_tier: 'standard' | 'suv' | 'premium';
  air_conditioning: boolean;
  created_at: string;
}

export interface TripStop {
  id?: number;
  trip_id?: number;
  stop_order: number;
  location_name: string;
  city: string;
  wilaya_name?: string;
  is_mandatory_rest: boolean;
  duration_minutes: number;
  notes?: string;
}

export interface Trip {
  id: number;
  driver_id: number;
  vehicle_id?: number;
  origin_wilaya_code: number;
  origin_wilaya_name: string;
  origin_city: string;
  origin_address: string;
  destination_wilaya_code: number;
  destination_wilaya_name: string;
  destination_city: string;
  destination_address: string;
  departure_datetime: string;
  estimated_duration_minutes: number;
  distance_km: number;
  total_seats: number;
  available_seats: number;
  base_seat_price: number;
  comfort_enabled: boolean;
  has_mandatory_rest: boolean;
  fuel_estimate_cost?: number;
  suggested_seat_price?: number;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  driver?: User;
  vehicle?: Vehicle;
  stops?: TripStop[];
}

export interface Booking {
  id: number;
  trip_id: number;
  passenger_id: number;
  seat_count: number;
  seat_type: 'standard' | 'comfort';
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  quoted_base_price: number;
  quoted_commission: number;
  quoted_comfort_fee: number;
  quoted_total_price: number;
  driver_payout: number;
  rejection_or_cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  trip?: Trip;
  passenger?: User;
}

export interface TripMessage {
  id: number;
  trip_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  sender?: User;
}

export interface PricingBreakdown {
  seat_count: number;
  seat_type: string;
  base_seat_price: number;
  total_base_price: number;
  commission_rate: number;
  total_commission: number;
  comfort_rate: number;
  total_comfort_fee: number;
  total_passenger_price: number;
  total_driver_payout: number;
}

export interface FuelEstimateResult {
  distance_km: number;
  total_seats: number;
  wilaya_code: number;
  wilaya_name: string;
  fuel_type: string;
  fuel_price_per_litre: number;
  estimated_fuel_litres: number;
  total_fuel_cost_dzd: number;
  suggested_seat_price_dzd: number;
  is_fallback: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
