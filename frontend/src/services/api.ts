import {
  AuthResponse,
  User,
  Trip,
  Booking,
  TripMessage,
  FuelEstimateResult,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api/v1';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('dz_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // --- Auth & Profile ---
  async login(formData: FormData): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Identifiants invalides');
    }
    return res.json();
  }

  async register(data: Record<string, unknown>): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Trips ---
  async searchTrips(params: {
    origin_city?: string;
    origin_wilaya?: number;
    destination_city?: string;
    destination_wilaya?: number;
    date?: string;
    min_seats?: number;
    max_price?: number;
    comfort_only?: boolean;
    has_rest_stop?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<Trip[]> {
    const query = new URLSearchParams();
    if (params.origin_city) query.append('origin_city', params.origin_city);
    if (params.origin_wilaya) query.append('origin_wilaya', params.origin_wilaya.toString());
    if (params.destination_city) query.append('destination_city', params.destination_city);
    if (params.destination_wilaya) query.append('destination_wilaya', params.destination_wilaya.toString());
    if (params.date) query.append('date', params.date);
    if (params.min_seats) query.append('min_seats', params.min_seats.toString());
    if (params.max_price) query.append('max_price', params.max_price.toString());
    if (params.comfort_only) query.append('comfort_only', 'true');
    if (params.has_rest_stop) query.append('has_rest_stop', 'true');
    if (params.skip) query.append('skip', params.skip.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return this.request<Trip[]>(`/trips?${query.toString()}`);
  }

  async getTrip(id: number): Promise<Trip> {
    return this.request<Trip>(`/trips/${id}`);
  }

  async createTrip(data: Record<string, unknown>): Promise<Trip> {
    return this.request<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrip(id: number, data: Record<string, unknown>): Promise<Trip> {
    return this.request<Trip>(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelTrip(id: number): Promise<Trip> {
    return this.request<Trip>(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyDriverTrips(): Promise<Trip[]> {
    return this.request<Trip[]>('/trips/driver/me');
  }

  // --- Bookings ---
  async createBooking(tripId: number, data: { seat_count: number; seat_type: string }): Promise<Booking> {
    return this.request<Booking>(`/bookings/trips/${tripId}/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyPassengerBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/bookings/passenger/me');
  }

  async getTripBookings(tripId: number): Promise<Booking[]> {
    return this.request<Booking[]>(`/bookings/trips/${tripId}`);
  }

  async approveBooking(bookingId: number): Promise<Booking> {
    return this.request<Booking>(`/bookings/${bookingId}/approve`, {
      method: 'POST',
    });
  }

  async rejectBooking(bookingId: number, reason?: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${bookingId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async cancelBooking(bookingId: number, reason?: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // --- Messages / Chat ---
  async getTripMessages(tripId: number): Promise<TripMessage[]> {
    return this.request<TripMessage[]>(`/messages/trips/${tripId}`);
  }

  async sendTripMessage(tripId: number, content: string): Promise<TripMessage> {
    return this.request<TripMessage>(`/messages/trips/${tripId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // --- Fuel Estimation ---
  async estimateFuel(data: {
    distance_km: number;
    total_seats: number;
    wilaya_code: number;
    fuel_type?: string;
  }): Promise<FuelEstimateResult> {
    return this.request<FuelEstimateResult>('/fuel/estimate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
