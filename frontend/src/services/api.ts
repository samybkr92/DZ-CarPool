import {
  AuthResponse,
  User,
  Trip,
  Booking,
  TripMessage,
  FuelEstimateResult,
} from '../types';
import { DEMO_USERS, INITIAL_TRIPS } from './mockData';
import { calculatePrices, estimateFuelCost } from '../utils/algeriaData';

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api/v1';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('dz_token');
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // --- Local Demo Store (Fallback when backend API is unreachable or on static host) ---
  private getRegisteredUsers(): Array<{ email: string; password?: string; user: User }> {
    const stored = localStorage.getItem('dz_registered_users');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  private saveRegisteredUser(entry: { email: string; password?: string; user: User }) {
    const list = this.getRegisteredUsers().filter(
      (u) => u.email.toLowerCase() !== entry.email.toLowerCase()
    );
    list.push(entry);
    localStorage.setItem('dz_registered_users', JSON.stringify(list));
  }

  private getDemoTrips(): Trip[] {
    const stored = localStorage.getItem('dz_demo_trips');
    if (!stored) {
      localStorage.setItem('dz_demo_trips', JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_TRIPS;
    }
  }

  private saveDemoTrips(trips: Trip[]) {
    localStorage.setItem('dz_demo_trips', JSON.stringify(trips));
  }

  private getDemoBookings(): Booking[] {
    const stored = localStorage.getItem('dz_demo_bookings');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  private saveDemoBookings(bookings: Booking[]) {
    localStorage.setItem('dz_demo_bookings', JSON.stringify(bookings));
  }

  private getDemoMessages(): Record<number, TripMessage[]> {
    const stored = localStorage.getItem('dz_demo_messages');
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }

  private saveDemoMessages(messages: Record<number, TripMessage[]>) {
    localStorage.setItem('dz_demo_messages', JSON.stringify(messages));
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

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || contentType.includes('text/html')) {
      let errMsg = `Erreur HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errMsg = errData.detail || errData.message || errMsg;
      } catch {
        // ignore
      }
      const err = new Error(errMsg);
      (err as any).status = response.status;
      throw err;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  }

  // --- Auth & Profile ---
  async login(credentials: { email: string; password: string } | FormData | string, passwordParam?: string): Promise<AuthResponse> {
    let email = '';
    let password = '';

    if (typeof credentials === 'string') {
      email = credentials;
      password = passwordParam || '';
    } else if (credentials instanceof FormData) {
      email = (credentials.get('email') || credentials.get('username') || '') as string;
      password = (credentials.get('password') || '') as string;
    } else if (typeof credentials === 'object' && credentials !== null) {
      email = credentials.email || '';
      password = credentials.password || '';
    }

    try {
      // 1. Try real backend with JSON
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !contentType.includes('text/html')) {
        const data = await res.json();
        localStorage.setItem('dz_current_user', JSON.stringify(data.user));
        return data;
      }
    } catch {
      // Backend unavailable or static host, fallback gracefully
    }

    // 2. Demo fallback & Local Registered Users resolution
    const normalizedEmail = email.toLowerCase().trim();
    let user: User;

    // Check if previously registered locally
    const registeredList = this.getRegisteredUsers();
    const existing = registeredList.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      user = existing.user;
    } else if (normalizedEmail.includes('passager') || normalizedEmail.includes('amina')) {
      user = DEMO_USERS.passenger;
    } else if (normalizedEmail.includes('driver') || normalizedEmail.includes('conducteur') || normalizedEmail.includes('amine')) {
      user = DEMO_USERS.driver;
    } else {
      user = {
        id: Math.floor(Math.random() * 1000) + 10,
        email: email || 'utilisateur@dz-carpool.dz',
        full_name: email ? email.split('@')[0].replace('.', ' ') : 'Utilisateur DZ',
        phone_number: '0550123456',
        role: 'both',
        bio: 'Membre certifié de la communauté DZ-CarPool.',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email || 'DZ')}`,
        wilaya_code: 16,
        wilaya_name: 'Alger',
        rating_avg: 4.8,
        rating_count: 5,
        trips_completed_count: 8,
        is_active: true,
      };
      this.saveRegisteredUser({ email: user.email, password, user });
    }

    const demoToken = 'dz_demo_token_' + btoa(JSON.stringify({ userId: user.id, email: user.email }));
    localStorage.setItem('dz_token', demoToken);
    localStorage.setItem('dz_current_user', JSON.stringify(user));
    return {
      access_token: demoToken,
      token_type: 'bearer',
      user,
    };
  }

  async register(data: Record<string, unknown>): Promise<AuthResponse> {
    try {
      const res = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res && res.user) {
        localStorage.setItem('dz_current_user', JSON.stringify(res.user));
        return res;
      }
    } catch {
      // Fallback
    }

    const email = ((data.email as string) || 'nouveau@dz-carpool.dz').toLowerCase().trim();
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 50,
      email,
      full_name: (data.full_name as string) || 'Nouveau Membre',
      phone_number: (data.phone_number as string) || '0550000000',
      role: (data.role as 'driver' | 'passenger' | 'both') || 'both',
      bio: (data.bio as string) || 'Membre vérifié DZ-CarPool',
      avatar_url: (data.avatar_url as string) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(String(data.full_name || 'DZ'))}`,
      wilaya_code: (data.wilaya_code as number) || 16,
      wilaya_name: (data.wilaya_name as string) || 'Alger',
      rating_avg: 5.0,
      rating_count: 1,
      trips_completed_count: 0,
      is_active: true,
    };
    this.saveRegisteredUser({ email, password: data.password as string, user: newUser });
    const demoToken = 'dz_demo_token_' + btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }));
    localStorage.setItem('dz_token', demoToken);
    localStorage.setItem('dz_current_user', JSON.stringify(newUser));
    return {
      access_token: demoToken,
      token_type: 'bearer',
      user: newUser,
    };
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await this.request<User>('/auth/me');
    } catch {
      const stored = localStorage.getItem('dz_current_user');
      if (stored) return JSON.parse(stored);
      return DEMO_USERS.driver;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await this.request<User>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const current = await this.getCurrentUser();
      const updated = { ...current, ...data };
      localStorage.setItem('dz_current_user', JSON.stringify(updated));
      return updated;
    }
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
    try {
      const query = new URLSearchParams();
      if (params.origin_city) {
        query.append('origin', params.origin_city);
        query.append('origin_city', params.origin_city);
      }
      if (params.origin_wilaya) query.append('origin_wilaya', params.origin_wilaya.toString());
      if (params.destination_city) {
        query.append('destination', params.destination_city);
        query.append('destination_city', params.destination_city);
      }
      if (params.destination_wilaya) query.append('destination_wilaya', params.destination_wilaya.toString());
      if (params.date) query.append('date', params.date);
      if (params.min_seats) query.append('min_seats', params.min_seats.toString());
      if (params.max_price) query.append('max_price', params.max_price.toString());
      if (params.comfort_only) query.append('comfort_only', 'true');
      if (params.has_rest_stop) query.append('has_rest_stop', 'true');

      const res = await this.request<Trip[] | { trips: Trip[] }>(`/trips?${query.toString()}`);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as any).trips)) return (res as any).trips;
      return [];
    } catch {
      // Demo fallback filtering
      let trips = this.getDemoTrips();

      if (params.origin_city) {
        const o = params.origin_city.toLowerCase();
        trips = trips.filter((t) => t.origin_city.toLowerCase().includes(o) || t.origin_wilaya_name.toLowerCase().includes(o));
      }
      if (params.destination_city) {
        const d = params.destination_city.toLowerCase();
        trips = trips.filter((t) => t.destination_city.toLowerCase().includes(d) || t.destination_wilaya_name.toLowerCase().includes(d));
      }
      if (params.comfort_only) {
        trips = trips.filter((t) => t.comfort_enabled);
      }
      if (params.has_rest_stop) {
        trips = trips.filter((t) => t.has_mandatory_rest);
      }
      if (params.min_seats) {
        trips = trips.filter((t) => t.available_seats >= params.min_seats!);
      }
      return trips;
    }
  }

  async getTrip(id: number): Promise<Trip> {
    try {
      return await this.request<Trip>(`/trips/${id}`);
    } catch {
      const trips = this.getDemoTrips();
      const found = trips.find((t) => t.id === Number(id));
      if (found) return found;
      return INITIAL_TRIPS[0];
    }
  }

  async createTrip(data: Record<string, any>): Promise<Trip> {
    try {
      return await this.request<Trip>('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const distance = Number(data.distance_km) || 350;
      const basePrice = Number(data.base_seat_price) || 1500;
      const prices = calculatePrices(basePrice);
      const hasMandatoryRest = distance > 300;
      const user = await this.getCurrentUser();

      const newTrip: Trip = {
        id: Date.now(),
        driver_id: user.id,
        origin_city: data.origin_city,
        origin_wilaya_code: data.origin_wilaya_code || 16,
        origin_wilaya_name: data.origin_wilaya_name || 'Alger',
        origin_address: data.origin_address || `${data.origin_city}, Algérie`,
        destination_city: data.destination_city,
        destination_wilaya_code: data.destination_wilaya_code || 31,
        destination_wilaya_name: data.destination_wilaya_name || 'Oran',
        destination_address: data.destination_address || `${data.destination_city}, Algérie`,
        departure_datetime: data.departure_datetime,
        estimated_duration_minutes: data.estimated_duration_minutes || 240,
        distance_km: distance,
        total_seats: Number(data.total_seats) || 3,
        available_seats: Number(data.total_seats) || 3,
        base_seat_price: basePrice,
        passenger_standard_price: prices.passengerStandard,
        passenger_comfort_price: data.comfort_enabled ? prices.passengerComfort : null,
        driver_net_payout: prices.driverPayout,
        platform_commission_rate: 0.15,
        comfort_surcharge_rate: 0.30,
        comfort_enabled: Boolean(data.comfort_enabled),
        has_mandatory_rest: hasMandatoryRest,
        fuel_estimate_cost: Math.round((distance * 8 / 100) * 45.62 * 100) / 100,
        suggested_seat_price: Math.round(((distance * 8 / 100 * 45.62) / (data.total_seats || 3)) * 100) / 100,
        status: 'active',
        driver: user,
        vehicle: {
          id: 99,
          user_id: user.id,
          make: data.vehicle_make || 'Renault',
          model: data.vehicle_model || 'Clio 4',
          year: 2022,
          color: 'Blanc',
          license_plate: '10923-116-16',
          comfort_tier: data.comfort_enabled ? 'premium' : 'standard',
          air_conditioning: true,
        },
        stops: hasMandatoryRest
          ? [
              {
                id: Date.now() + 1,
                trip_id: Date.now(),
                stop_order: 1,
                location_name: `Aire de Repos Mi-Parcours (${data.origin_city} ➔ ${data.destination_city})`,
                city: `Mi-Parcours (~${Math.round(distance / 2)} km)`,
                wilaya_name: 'Halte Sécurité',
                is_mandatory_rest: true,
                duration_minutes: 15,
                notes: 'Pause sécurité réglementaire de 15 minutes (trajet > 300 km)',
              },
            ]
          : [],
      };

      const trips = this.getDemoTrips();
      this.saveDemoTrips([newTrip, ...trips]);
      return newTrip;
    }
  }

  async updateTrip(id: number, data: Record<string, unknown>): Promise<Trip> {
    try {
      return await this.request<Trip>(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const trips = this.getDemoTrips();
      const idx = trips.findIndex((t) => t.id === Number(id));
      if (idx !== -1) {
        trips[idx] = { ...trips[idx], ...data } as Trip;
        this.saveDemoTrips(trips);
        return trips[idx];
      }
      return INITIAL_TRIPS[0];
    }
  }

  async cancelTrip(id: number): Promise<Trip> {
    try {
      return await this.request<Trip>(`/trips/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const trips = this.getDemoTrips();
      const found = trips.find((t) => t.id === Number(id));
      if (found) {
        found.status = 'cancelled';
        this.saveDemoTrips(trips);
        return found;
      }
      return INITIAL_TRIPS[0];
    }
  }

  async getMyDriverTrips(): Promise<Trip[]> {
    try {
      const res = await this.request<Trip[] | { trips: Trip[] }>('/trips/driver/me');
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as any).trips)) return (res as any).trips;
      return [];
    } catch {
      const trips = this.getDemoTrips();
      const user = await this.getCurrentUser();
      const myTrips = trips.filter((t) => t.driver_id === user.id || t.driver?.email === user.email);
      return myTrips.length > 0 ? myTrips : trips.slice(0, 3);
    }
  }

  // --- Bookings ---
  async createBooking(tripId: number, data: { seat_count: number; seat_type: string }): Promise<Booking> {
    try {
      return await this.request<Booking>(`/bookings/trips/${tripId}/book`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const trips = this.getDemoTrips();
      const trip = trips.find((t) => t.id === Number(tripId)) || trips[0];
      const user = await this.getCurrentUser();

      const baseUnitPrice = trip.base_seat_price;
      const isComfort = data.seat_type === 'comfort';
      const unitPrice = isComfort
        ? (trip.passenger_comfort_price || calculatePrices(baseUnitPrice).passengerComfort)
        : (trip.passenger_standard_price || calculatePrices(baseUnitPrice).passengerStandard);
      const totalPrice = unitPrice * data.seat_count;

      const newBooking: Booking = {
        id: Date.now(),
        trip_id: trip.id,
        passenger_id: user.id,
        seat_count: data.seat_count,
        seat_type: data.seat_type as any,
        status: 'pending',
        quoted_base_price: baseUnitPrice * data.seat_count,
        quoted_commission: Math.round(baseUnitPrice * 0.15 * data.seat_count),
        quoted_comfort_fee: isComfort ? Math.round(baseUnitPrice * 0.30 * data.seat_count) : 0,
        quoted_total_price: totalPrice,
        driver_payout: baseUnitPrice * data.seat_count,
        unit_price: unitPrice,
        total_price: totalPrice,
        created_at: new Date().toISOString(),
        trip,
        passenger: user,
      };

      const bookings = this.getDemoBookings();
      this.saveDemoBookings([newBooking, ...bookings]);
      return newBooking;
    }
  }

  async approveBooking(bookingId: number): Promise<Booking> {
    return this.respondBooking(bookingId, 'confirm');
  }

  async rejectBooking(bookingId: number, _reason?: string): Promise<Booking> {
    return this.respondBooking(bookingId, 'reject');
  }

  async respondBooking(bookingId: number, action: 'confirm' | 'reject'): Promise<Booking> {
    try {
      return await this.request<Booking>(`/bookings/${bookingId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
    } catch {
      const bookings = this.getDemoBookings();
      const idx = bookings.findIndex((b) => b.id === Number(bookingId));
      if (idx !== -1) {
        bookings[idx].status = action === 'confirm' ? 'confirmed' : 'rejected';
        this.saveDemoBookings(bookings);

        // Atomically update trip seats in demo
        if (action === 'confirm') {
          const trips = this.getDemoTrips();
          const tIdx = trips.findIndex((t) => t.id === bookings[idx].trip_id);
          if (tIdx !== -1) {
            trips[tIdx].available_seats = Math.max(0, trips[tIdx].available_seats - bookings[idx].seat_count);
            this.saveDemoTrips(trips);
          }
        }
        return bookings[idx];
      }
      throw new Error('Réservation introuvable');
    }
  }

  async cancelBooking(bookingId: number): Promise<Booking> {
    try {
      return await this.request<Booking>(`/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
    } catch {
      const bookings = this.getDemoBookings();
      const b = bookings.find((item) => item.id === Number(bookingId));
      if (b) {
        b.status = 'cancelled';
        this.saveDemoBookings(bookings);
        return b;
      }
      throw new Error('Réservation introuvable');
    }
  }

  async getMyPassengerBookings(): Promise<Booking[]> {
    return this.getMyBookings();
  }

  async getMyBookings(): Promise<Booking[]> {
    try {
      return await this.request<Booking[]>('/bookings/me');
    } catch {
      const bookings = this.getDemoBookings();
      if (bookings.length > 0) return bookings;

      // Seed a default sample booking for demo
      const defaultTrip = INITIAL_TRIPS[0];
      const stdPrice = defaultTrip.passenger_standard_price || 1840;
      return [
        {
          id: 101,
          trip_id: defaultTrip.id,
          passenger_id: 2,
          seat_count: 1,
          seat_type: 'standard',
          status: 'pending',
          quoted_base_price: defaultTrip.base_seat_price,
          quoted_commission: Math.round(defaultTrip.base_seat_price * 0.15),
          quoted_comfort_fee: 0,
          quoted_total_price: stdPrice,
          driver_payout: defaultTrip.base_seat_price,
          unit_price: stdPrice,
          total_price: stdPrice,
          created_at: new Date().toISOString(),
          trip: defaultTrip,
          passenger: DEMO_USERS.passenger,
        },
      ];
    }
  }

  async getTripBookings(tripId: number): Promise<Booking[]> {
    try {
      return await this.request<Booking[]>(`/bookings/trips/${tripId}`);
    } catch {
      const bookings = this.getDemoBookings();
      const tripBookings = bookings.filter((b) => b.trip_id === Number(tripId));
      if (tripBookings.length > 0) return tripBookings;

      // Return a pending booking for demo trips so driver can approve
      return [
        {
          id: 201,
          trip_id: Number(tripId),
          passenger_id: 2,
          seat_count: 1,
          seat_type: 'comfort',
          status: 'pending',
          quoted_base_price: 1600,
          quoted_commission: 240,
          quoted_comfort_fee: 480,
          quoted_total_price: 2320,
          driver_payout: 1600,
          unit_price: 2320,
          total_price: 2320,
          created_at: new Date().toISOString(),
          passenger: DEMO_USERS.passenger,
        },
      ];
    }
  }

  // --- Messaging ---
  async getTripMessages(tripId: number): Promise<TripMessage[]> {
    try {
      return await this.request<TripMessage[]>(`/messages/trips/${tripId}`);
    } catch {
      const store = this.getDemoMessages();
      if (store[tripId] && store[tripId].length > 0) {
        return store[tripId];
      }
      return [
        {
          id: 1,
          trip_id: Number(tripId),
          sender_id: 1,
          content: 'Bonjour ! Bienvenue sur ce trajet. Nous partirons ponctuellement.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          sender: DEMO_USERS.driver,
        },
      ];
    }
  }

  async sendTripMessage(tripId: number, content: string): Promise<TripMessage> {
    return this.sendMessage(tripId, content);
  }

  async sendMessage(tripId: number, content: string): Promise<TripMessage> {
    try {
      return await this.request<TripMessage>(`/messages/trips/${tripId}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    } catch {
      const user = await this.getCurrentUser();
      const newMsg: TripMessage = {
        id: Date.now(),
        trip_id: Number(tripId),
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
        sender: user,
      };
      const store = this.getDemoMessages();
      if (!store[tripId]) store[tripId] = [];
      store[tripId].push(newMsg);
      this.saveDemoMessages(store);
      return newMsg;
    }
  }

  // --- Fuel Estimation (Naftal API / prix_carburants.json) ---
  async estimateFuel(params: {
    distance_km: number;
    wilaya_code?: number;
    fuel_type?: 'essence' | 'diesel' | 'gpl';
    total_seats?: number;
  }): Promise<FuelEstimateResult> {
    try {
      const query = new URLSearchParams({
        distance_km: params.distance_km.toString(),
      });
      if (params.wilaya_code) query.append('wilaya_code', params.wilaya_code.toString());
      if (params.fuel_type) query.append('fuel_type', params.fuel_type);
      if (params.total_seats) query.append('total_seats', params.total_seats.toString());

      return await this.request<FuelEstimateResult>(`/fuel/estimate?${query.toString()}`);
    } catch {
      const est = estimateFuelCost(params.distance_km, params.fuel_type || 'essence', params.total_seats || 3);
      return {
        distance_km: est.distance_km,
        total_seats: params.total_seats || 3,
        consumption_liters: est.consumption_liters,
        price_per_liter: est.price_per_liter,
        total_fuel_cost: est.total_fuel_cost,
        suggested_seat_contribution: est.suggested_seat_contribution,
        total_fuel_cost_dzd: est.total_fuel_cost,
        suggested_seat_price_dzd: est.suggested_seat_contribution,
        fuel_type: est.fuel_type,
        wilaya_name: 'Régional Naftal',
        is_fallback: true,
      };
    }
  }
}

export const api = new ApiService();
