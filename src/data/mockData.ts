import {
  Passenger,
  Route,
  Station,
  RouteStation,
  VehicleType,
  Driver,
  Vehicle,
  Trip,
  TripStop,
  Booking,
  Payment,
  Ticket,
} from '../types/transit';

export const INITIAL_PASSENGERS: Passenger[] = [
  {
    passenger_id: 'P001',
    first_name: 'Anu',
    last_name: 'Kumar',
    email: 'anu@gmail.com',
    gender: 'F',
    dob: '2007-06-09',
    door_no: '12',
    street: 'Anna St',
    city: 'Chennai',
    state: 'TN',
    pin: '600001',
    phone_numbers: ['9876543210'],
  },
  {
    passenger_id: 'P002',
    first_name: 'Arun',
    last_name: 'Raj',
    email: 'arun@gmail.com',
    gender: 'M',
    dob: '2006-03-15',
    door_no: '24',
    street: 'MG Road',
    city: 'Chennai',
    state: 'TN',
    pin: '600002',
    phone_numbers: ['9876543211', '9840112233'],
  },
  {
    passenger_id: 'P003',
    first_name: 'Kavitha',
    last_name: 'Venkatesh',
    email: 'kavitha.v@gmail.com',
    gender: 'F',
    dob: '1998-11-04',
    door_no: '5B',
    street: 'Gandhi Road',
    city: 'Chennai',
    state: 'TN',
    pin: '600042',
    phone_numbers: ['9444123456'],
  },
  {
    passenger_id: 'P004',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@corp.com',
    gender: 'M',
    dob: '1992-04-20',
    door_no: '88',
    street: 'Cathedral Road',
    city: 'Chennai',
    state: 'TN',
    pin: '600086',
    phone_numbers: ['9940567890'],
  },
];

export const INITIAL_ROUTES: Route[] = [
  {
    route_id: 'R001',
    name: 'Chennai Central Bus Line',
    type: 'Bus',
    total_distance: 15.0,
  },
  {
    route_id: 'R003',
    name: 'Airport Express Metro',
    type: 'Metro',
    total_distance: 20.0,
  },
  {
    route_id: 'R002',
    name: 'Tambaram - Koyambedu Express',
    type: 'Bus',
    total_distance: 28.5,
  },
  {
    route_id: 'R004',
    name: 'Blue Line Metro Corridor',
    type: 'Metro',
    total_distance: 32.0,
  },
];

export const INITIAL_STATIONS: Station[] = [
  {
    station_id: 'S001',
    name: 'Chennai Central',
    city: 'Chennai',
    area: 'Central',
    landmark: 'Railway Station',
  },
  {
    station_id: 'S003',
    name: 'Chennai International Airport',
    city: 'Chennai',
    area: 'Meenambakkam',
    landmark: 'Terminal 2 Metro Gate',
  },
  {
    station_id: 'S002',
    name: 'Guindy Junction',
    city: 'Chennai',
    area: 'Guindy',
    landmark: 'Kathipara Cloverleaf Flyover',
  },
  {
    station_id: 'S004',
    name: 'Koyambedu Inter-State',
    city: 'Chennai',
    area: 'Koyambedu',
    landmark: 'CMBT Bus Terminus',
  },
  {
    station_id: 'S005',
    name: 'T. Nagar Hub',
    city: 'Chennai',
    area: 'T. Nagar',
    landmark: 'Panagal Park Circle',
  },
];

export const INITIAL_ROUTE_STATIONS: RouteStation[] = [
  { route_id: 'R001', station_id: 'S001', stop_order: 1, distance_from_start: 0 },
  { route_id: 'R001', station_id: 'S005', stop_order: 2, distance_from_start: 6.2 },
  { route_id: 'R001', station_id: 'S002', stop_order: 3, distance_from_start: 10.5 },
  { route_id: 'R001', station_id: 'S003', stop_order: 4, distance_from_start: 15.0 },

  { route_id: 'R003', station_id: 'S001', stop_order: 1, distance_from_start: 0 },
  { route_id: 'R003', station_id: 'S002', stop_order: 2, distance_from_start: 12.0 },
  { route_id: 'R003', station_id: 'S003', stop_order: 3, distance_from_start: 20.0 },

  { route_id: 'R002', station_id: 'S004', stop_order: 1, distance_from_start: 0 },
  { route_id: 'R002', station_id: 'S005', stop_order: 2, distance_from_start: 8.5 },
  { route_id: 'R002', station_id: 'S002', stop_order: 3, distance_from_start: 16.0 },

  { route_id: 'R004', station_id: 'S001', stop_order: 1, distance_from_start: 0 },
  { route_id: 'R004', station_id: 'S004', stop_order: 2, distance_from_start: 11.0 },
  { route_id: 'R004', station_id: 'S002', stop_order: 3, distance_from_start: 22.0 },
  { route_id: 'R004', station_id: 'S003', stop_order: 4, distance_from_start: 32.0 },
];

export const INITIAL_VEHICLE_TYPES: VehicleType[] = [
  {
    type_id: 'VT01',
    name: 'City Bus Standard',
    capacity: 40,
    fuel_type: 'Diesel',
  },
  {
    type_id: 'VT02',
    name: 'Metro Train 4-Car Formation',
    capacity: 240,
    fuel_type: 'Electric',
  },
  {
    type_id: 'VT03',
    name: 'AC Low-Floor Electric Bus',
    capacity: 35,
    fuel_type: 'Electric',
  },
  {
    type_id: 'VT04',
    name: 'Green CNG Feeder Shuttle',
    capacity: 25,
    fuel_type: 'CNG',
  },
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    driver_id: 'D001',
    name: 'Ravi Kumar',
    license_no: 'DL1001',
    dob: '1985-02-10',
    phone_numbers: ['9840123456', '9840123457'],
  },
  {
    driver_id: 'D002',
    name: 'Priya Sundaram',
    license_no: 'DL1002',
    dob: '1990-11-22',
    phone_numbers: ['9840998877'],
  },
  {
    driver_id: 'D003',
    name: 'Senthil Nathan',
    license_no: 'DL1003',
    dob: '1982-07-04',
    phone_numbers: ['9789012345'],
  },
  {
    driver_id: 'D004',
    name: 'Karthik Raja',
    license_no: 'DL1004',
    dob: '1988-09-18',
    phone_numbers: ['9884567890'],
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    vehicle_id: 'V001',
    registration_no: 'TN01AB1234',
    manufacture_date: '2022-04-10',
    color: 'Ocean Blue',
    type_id: 'VT01',
    driver_id: 'D001', // 1:1 assigned to Ravi Kumar
  },
  {
    vehicle_id: 'V002',
    registration_no: 'METRO-EXP-01',
    manufacture_date: '2023-01-15',
    color: 'Silver & Indigo',
    type_id: 'VT02',
    driver_id: 'D002', // 1:1 assigned to Priya Sundaram
  },
  {
    vehicle_id: 'V003',
    registration_no: 'TN02CD5678',
    manufacture_date: '2023-09-20',
    color: 'Emerald Green',
    type_id: 'VT03',
    driver_id: 'D003', // 1:1 assigned to Senthil Nathan
  },
  {
    vehicle_id: 'V004',
    registration_no: 'TN09XY9900',
    manufacture_date: '2024-02-11',
    color: 'Pure White',
    type_id: 'VT04',
    driver_id: null, // Unassigned driver pool
  },
];

export const INITIAL_TRIPS: Trip[] = [
  {
    trip_id: 'T001',
    date: '2026-08-20',
    start_time: '08:00',
    end_time: '08:45',
    route_id: 'R001',
    vehicle_id: 'V001',
    status: 'Scheduled',
  },
  {
    trip_id: 'T002',
    date: '2026-08-20',
    start_time: '09:15',
    end_time: '09:50',
    route_id: 'R003',
    vehicle_id: 'V002',
    status: 'Scheduled',
  },
  {
    trip_id: 'T003',
    date: '2026-08-20',
    start_time: '10:30',
    end_time: '11:15',
    route_id: 'R001',
    vehicle_id: 'V001',
    status: 'Scheduled',
  },
  {
    trip_id: 'T004',
    date: '2026-08-20',
    start_time: '14:00',
    end_time: '14:55',
    route_id: 'R004',
    vehicle_id: 'V002',
    status: 'Scheduled',
  },
];

export const INITIAL_TRIP_STOPS: TripStop[] = [
  // T001 Weak Entity Stops
  { trip_id: 'T001', station_id: 'S001', stop_order: 1, arrival_time: '08:00', departure_time: '08:05' },
  { trip_id: 'T001', station_id: 'S005', stop_order: 2, arrival_time: '08:18', departure_time: '08:20' },
  { trip_id: 'T001', station_id: 'S002', stop_order: 3, arrival_time: '08:32', departure_time: '08:34' },
  { trip_id: 'T001', station_id: 'S003', stop_order: 4, arrival_time: '08:45', departure_time: '08:45' },

  // T002 Weak Entity Stops
  { trip_id: 'T002', station_id: 'S001', stop_order: 1, arrival_time: '09:15', departure_time: '09:17' },
  { trip_id: 'T002', station_id: 'S002', stop_order: 2, arrival_time: '09:30', departure_time: '09:32' },
  { trip_id: 'T002', station_id: 'S003', stop_order: 3, arrival_time: '09:50', departure_time: '09:50' },

  // T003 Weak Entity Stops
  { trip_id: 'T003', station_id: 'S001', stop_order: 1, arrival_time: '10:30', departure_time: '10:35' },
  { trip_id: 'T003', station_id: 'S005', stop_order: 2, arrival_time: '10:48', departure_time: '10:50' },
  { trip_id: 'T003', station_id: 'S002', stop_order: 3, arrival_time: '11:02', departure_time: '11:04' },
  { trip_id: 'T003', station_id: 'S003', stop_order: 4, arrival_time: '11:15', departure_time: '11:15' },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    booking_id: 'B001',
    passenger_id: 'P001',
    trip_id: 'T001',
    seat_number: 'A01',
    booking_date: '2026-08-20',
    status: 'Confirmed',
  },
  {
    booking_id: 'B002',
    passenger_id: 'P002',
    trip_id: 'T001',
    seat_number: 'A02',
    booking_date: '2026-08-20',
    status: 'Confirmed',
  },
  {
    booking_id: 'B003',
    passenger_id: 'P003',
    trip_id: 'T002',
    seat_number: 'M14',
    booking_date: '2026-08-20',
    status: 'Confirmed',
  },
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    payment_id: 'PAY001',
    mode: 'UPI',
    amount: 40.0,
    payment_date: '2026-08-18',
    txn_reference_no: 'TXN98765432',
    status: 'Completed',
  },
  {
    payment_id: 'PAY002',
    mode: 'Card',
    amount: 50.0,
    payment_date: '2026-08-19',
    txn_reference_no: 'TXN98765433',
    status: 'Completed',
  },
  {
    payment_id: 'PAY003',
    mode: 'UPI',
    amount: 65.0,
    payment_date: '2026-08-20',
    txn_reference_no: 'TXN98765434',
    status: 'Completed',
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    ticket_id: 'TK001',
    passenger_id: 'P001',
    trip_id: 'T001',
    booking_id: 'B001',
    issue_date: '2026-08-18',
    ticket_type: 'Regular',
    travel_class: 'General',
    payment_id: 'PAY001',
  },
  {
    ticket_id: 'TK002',
    passenger_id: 'P002',
    trip_id: 'T001',
    booking_id: 'B002',
    issue_date: '2026-08-19',
    ticket_type: 'Regular',
    travel_class: 'AC',
    payment_id: 'PAY002',
  },
  {
    ticket_id: 'TK003',
    passenger_id: 'P003',
    trip_id: 'T002',
    booking_id: 'B003',
    issue_date: '2026-08-20',
    ticket_type: 'Daily Pass',
    travel_class: 'Metro Express',
    payment_id: 'PAY003',
  },
];
