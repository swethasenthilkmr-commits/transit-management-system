/**
 * Public Bus / Metro Transit Management System
 * Exportable TypeScript domain models & relations
 * Clean schema definitions ready for API integration
 */

// 1. PASSENGER MANAGEMENT
export interface Passenger {
  passenger_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: 'M' | 'F' | 'Other';
  dob: string; // YYYY-MM-DD
  door_no: string;
  street: string;
  city: string;
  state: string;
  pin: string;
  phone_numbers: string[]; // Multivalued PASSENGER_CONTACT
}

export interface PassengerContact {
  passenger_id: string;
  phone_number: string;
}

// 2. ROUTE & NETWORK MANAGEMENT
export type RouteType = 'Bus' | 'Metro';

export interface Route {
  route_id: string;
  name: string;
  type: RouteType;
  total_distance: number; // in kilometers
}

export interface Station {
  station_id: string;
  name: string;
  city: string;
  area: string;
  landmark: string;
}

export interface RouteStation {
  route_id: string;
  station_id: string;
  stop_order: number; // sequential order: 1, 2, 3...
  distance_from_start?: number; // optional km offset
}

// 3. FLEET & DRIVER MANAGEMENT
export type FuelType = 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';

export interface VehicleType {
  type_id: string;
  name: string;
  capacity: number;
  fuel_type: FuelType;
}

export interface Driver {
  driver_id: string;
  name: string;
  license_no: string;
  dob: string; // YYYY-MM-DD
  phone_numbers: string[]; // Multivalued contact numbers
}

export interface Vehicle {
  vehicle_id: string;
  registration_no: string;
  manufacture_date: string; // YYYY-MM-DD
  color: string;
  type_id: string; // FK to VehicleType
  driver_id: string | null; // FK to Driver (1:1 constraint visual/validation)
}

// 4. TRIP SCHEDULING & STOPS
export type TripStatus = 'Scheduled' | 'In-Transit' | 'Completed' | 'Cancelled';

export interface Trip {
  trip_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  route_id: string; // FK to Route
  vehicle_id?: string; // FK to Vehicle (optional)
  status?: TripStatus;
}

export interface TripStop {
  trip_id: string;
  station_id: string;
  stop_order: number;
  arrival_time: string; // HH:MM
  departure_time: string; // HH:MM
}

// 5. BOOKINGS, TICKETS & PAYMENTS
export type BookingStatus = 'Confirmed' | 'Cancelled' | 'Pending';

export interface Booking {
  booking_id: string;
  passenger_id: string; // FK to Passenger
  trip_id: string; // FK to Trip
  seat_number: string;
  booking_date: string; // YYYY-MM-DD
  status: BookingStatus;
}

export type PaymentMode = 'UPI' | 'Card' | 'Cash' | 'NetBanking';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

export interface Payment {
  payment_id: string;
  mode: PaymentMode;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  txn_reference_no: string;
  status: PaymentStatus;
}

export type TicketType = 'Regular' | 'Daily Pass' | 'Weekly Pass' | 'Monthly Pass';
export type TravelClass = 'General' | 'AC' | 'Metro Express';

export interface Ticket {
  ticket_id: string;
  passenger_id: string; // FK to Passenger
  trip_id: string; // FK to Trip
  booking_id: string; // FK to Booking
  issue_date: string; // YYYY-MM-DD
  ticket_type: TicketType;
  travel_class: TravelClass;
  payment_id: string; // FK to Payment
}

// Navigation & View Types
export type ActiveTab =
  | 'dashboard'
  | 'passengers'
  | 'routes'
  | 'stations'
  | 'fleet-vehicles'
  | 'fleet-drivers'
  | 'fleet-types'
  | 'trips'
  | 'bookings'
  | 'payments'
  | 'tickets';

// Reusable table column definition
export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}
