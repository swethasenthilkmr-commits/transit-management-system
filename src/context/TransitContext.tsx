import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ActiveTab,
} from '../types/transit';
import {
  INITIAL_PASSENGERS,
  INITIAL_ROUTES,
  INITIAL_STATIONS,
  INITIAL_ROUTE_STATIONS,
  INITIAL_VEHICLE_TYPES,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_TRIPS,
  INITIAL_TRIP_STOPS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_TICKETS,
} from '../data/mockData';

interface TransitContextType {
  // Navigation & Global Search
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;

  // Entities
  passengers: Passenger[];
  routes: Route[];
  stations: Station[];
  routeStations: RouteStation[];
  vehicleTypes: VehicleType[];
  drivers: Driver[];
  vehicles: Vehicle[];
  trips: Trip[];
  tripStops: TripStop[];
  bookings: Booking[];
  payments: Payment[];
  tickets: Ticket[];

  // Passenger CRUD
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (passenger: Passenger) => void;
  deletePassenger: (id: string) => void;

  // Route CRUD
  addRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  deleteRoute: (id: string) => void;

  // Station CRUD
  addStation: (station: Station) => void;
  updateStation: (station: Station) => void;
  deleteStation: (id: string) => void;

  // Route Stations M:N Mapping
  getStationsForRoute: (routeId: string) => { station: Station; stopOrder: number; distanceFromStart?: number }[];
  saveRouteStations: (routeId: string, stations: { station_id: string; stop_order: number; distance_from_start?: number }[]) => void;

  // Fleet CRUD
  addVehicleType: (type: VehicleType) => void;
  updateVehicleType: (type: VehicleType) => void;
  deleteVehicleType: (id: string) => void;

  addDriver: (driver: Driver) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (id: string) => void;

  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;

  // Trips & Trip Stops
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  getStopsForTrip: (tripId: string) => (TripStop & { station?: Station })[];
  saveTripStops: (tripId: string, stops: TripStop[]) => void;

  // Bookings, Payments, Tickets
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;

  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;

  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;

  // Utility Actions
  resetData: () => void;
  exportJSON: () => void;
}

const STORAGE_KEY = 'transit_flow_db_v1';

const TransitContext = createContext<TransitContextType | undefined>(undefined);

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Load from LocalStorage or initialize with seed data
  const loadInitial = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [passengers, setPassengers] = useState<Passenger[]>(() => loadInitial('passengers', INITIAL_PASSENGERS));
  const [routes, setRoutes] = useState<Route[]>(() => loadInitial('routes', INITIAL_ROUTES));
  const [stations, setStations] = useState<Station[]>(() => loadInitial('stations', INITIAL_STATIONS));
  const [routeStations, setRouteStations] = useState<RouteStation[]>(() => loadInitial('routeStations', INITIAL_ROUTE_STATIONS));
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(() => loadInitial('vehicleTypes', INITIAL_VEHICLE_TYPES));
  const [drivers, setDrivers] = useState<Driver[]>(() => loadInitial('drivers', INITIAL_DRIVERS));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadInitial('vehicles', INITIAL_VEHICLES));
  const [trips, setTrips] = useState<Trip[]>(() => loadInitial('trips', INITIAL_TRIPS));
  const [tripStops, setTripStops] = useState<TripStop[]>(() => loadInitial('tripStops', INITIAL_TRIP_STOPS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadInitial('bookings', INITIAL_BOOKINGS));
  const [payments, setPayments] = useState<Payment[]>(() => loadInitial('payments', INITIAL_PAYMENTS));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadInitial('tickets', INITIAL_TICKETS));

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_passengers`, JSON.stringify(passengers));
      localStorage.setItem(`${STORAGE_KEY}_routes`, JSON.stringify(routes));
      localStorage.setItem(`${STORAGE_KEY}_stations`, JSON.stringify(stations));
      localStorage.setItem(`${STORAGE_KEY}_routeStations`, JSON.stringify(routeStations));
      localStorage.setItem(`${STORAGE_KEY}_vehicleTypes`, JSON.stringify(vehicleTypes));
      localStorage.setItem(`${STORAGE_KEY}_drivers`, JSON.stringify(drivers));
      localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
      localStorage.setItem(`${STORAGE_KEY}_trips`, JSON.stringify(trips));
      localStorage.setItem(`${STORAGE_KEY}_tripStops`, JSON.stringify(tripStops));
      localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
    } catch {
      // ignore storage quota errors
    }
  }, [passengers, routes, stations, routeStations, vehicleTypes, drivers, vehicles, trips, tripStops, bookings, payments, tickets]);

  // Passengers
  const addPassenger = (passenger: Passenger) => {
    setPassengers((prev) => [passenger, ...prev]);
  };
  const updatePassenger = (passenger: Passenger) => {
    setPassengers((prev) => prev.map((p) => (p.passenger_id === passenger.passenger_id ? passenger : p)));
  };
  const deletePassenger = (id: string) => {
    setPassengers((prev) => prev.filter((p) => p.passenger_id !== id));
  };

  // Routes
  const addRoute = (route: Route) => {
    setRoutes((prev) => [route, ...prev]);
  };
  const updateRoute = (route: Route) => {
    setRoutes((prev) => prev.map((r) => (r.route_id === route.route_id ? route : r)));
  };
  const deleteRoute = (id: string) => {
    setRoutes((prev) => prev.filter((r) => r.route_id !== id));
    setRouteStations((prev) => prev.filter((rs) => rs.route_id !== id));
  };

  // Stations
  const addStation = (station: Station) => {
    setStations((prev) => [station, ...prev]);
  };
  const updateStation = (station: Station) => {
    setStations((prev) => prev.map((s) => (s.station_id === station.station_id ? station : s)));
  };
  const deleteStation = (id: string) => {
    setStations((prev) => prev.filter((s) => s.station_id !== id));
    setRouteStations((prev) => prev.filter((rs) => rs.station_id !== id));
  };

  // Route Stations M:N Mapping
  const getStationsForRoute = (routeId: string) => {
    return routeStations
      .filter((rs) => rs.route_id === routeId)
      .sort((a, b) => a.stop_order - b.stop_order)
      .map((rs) => {
        const found = stations.find((s) => s.station_id === rs.station_id);
        return {
          station: found || {
            station_id: rs.station_id,
            name: `Unknown Station (${rs.station_id})`,
            city: '',
            area: '',
            landmark: '',
          },
          stopOrder: rs.stop_order,
          distanceFromStart: rs.distance_from_start,
        };
      });
  };

  const saveRouteStations = (
    routeId: string,
    newStops: { station_id: string; stop_order: number; distance_from_start?: number }[]
  ) => {
    setRouteStations((prev) => [
      ...prev.filter((rs) => rs.route_id !== routeId),
      ...newStops.map((s) => ({ ...s, route_id: routeId })),
    ]);
  };

  // Fleet
  const addVehicleType = (type: VehicleType) => {
    setVehicleTypes((prev) => [type, ...prev]);
  };
  const updateVehicleType = (type: VehicleType) => {
    setVehicleTypes((prev) => prev.map((vt) => (vt.type_id === type.type_id ? type : vt)));
  };
  const deleteVehicleType = (id: string) => {
    setVehicleTypes((prev) => prev.filter((vt) => vt.type_id !== id));
  };

  const addDriver = (driver: Driver) => {
    setDrivers((prev) => [driver, ...prev]);
  };
  const updateDriver = (driver: Driver) => {
    setDrivers((prev) => prev.map((d) => (d.driver_id === driver.driver_id ? driver : d)));
  };
  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.driver_id !== id));
    // Clear assigned driver in vehicles
    setVehicles((prev) =>
      prev.map((v) => (v.driver_id === id ? { ...v, driver_id: null } : v))
    );
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [vehicle, ...prev]);
  };
  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.vehicle_id === vehicle.vehicle_id ? vehicle : v)));
  };
  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.vehicle_id !== id));
  };

  // Trips & Trip Stops
  const addTrip = (trip: Trip) => {
    setTrips((prev) => [trip, ...prev]);
  };
  const updateTrip = (trip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.trip_id === trip.trip_id ? trip : t)));
  };
  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.trip_id !== id));
    setTripStops((prev) => prev.filter((ts) => ts.trip_id !== id));
  };

  const getStopsForTrip = (tripId: string) => {
    return tripStops
      .filter((ts) => ts.trip_id === tripId)
      .sort((a, b) => a.stop_order - b.stop_order)
      .map((ts) => ({
        ...ts,
        station: stations.find((s) => s.station_id === ts.station_id),
      }));
  };

  const saveTripStops = (tripId: string, stops: TripStop[]) => {
    setTripStops((prev) => [
      ...prev.filter((ts) => ts.trip_id !== tripId),
      ...stops,
    ]);
  };

  // Bookings
  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };
  const updateBooking = (booking: Booking) => {
    setBookings((prev) => prev.map((b) => (b.booking_id === booking.booking_id ? booking : b)));
  };
  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.booking_id !== id));
  };

  // Payments
  const addPayment = (payment: Payment) => {
    setPayments((prev) => [payment, ...prev]);
  };
  const updatePayment = (payment: Payment) => {
    setPayments((prev) => prev.map((p) => (p.payment_id === payment.payment_id ? payment : p)));
  };
  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.payment_id !== id));
  };

  // Tickets
  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };
  const updateTicket = (ticket: Ticket) => {
    setTickets((prev) => prev.map((t) => (t.ticket_id === ticket.ticket_id ? ticket : t)));
  };
  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.ticket_id !== id));
  };

  // Reset to initial mock seed
  const resetData = () => {
    setPassengers(INITIAL_PASSENGERS);
    setRoutes(INITIAL_ROUTES);
    setStations(INITIAL_STATIONS);
    setRouteStations(INITIAL_ROUTE_STATIONS);
    setVehicleTypes(INITIAL_VEHICLE_TYPES);
    setDrivers(INITIAL_DRIVERS);
    setVehicles(INITIAL_VEHICLES);
    setTrips(INITIAL_TRIPS);
    setTripStops(INITIAL_TRIP_STOPS);
    setBookings(INITIAL_BOOKINGS);
    setPayments(INITIAL_PAYMENTS);
    setTickets(INITIAL_TICKETS);
    localStorage.clear();
  };

  // Export state as JSON file
  const exportJSON = () => {
    const data = {
      passengers,
      routes,
      stations,
      routeStations,
      vehicleTypes,
      drivers,
      vehicles,
      trips,
      tripStops,
      bookings,
      payments,
      tickets,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transit-management-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TransitContext.Provider
      value={{
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        passengers,
        routes,
        stations,
        routeStations,
        vehicleTypes,
        drivers,
        vehicles,
        trips,
        tripStops,
        bookings,
        payments,
        tickets,
        addPassenger,
        updatePassenger,
        deletePassenger,
        addRoute,
        updateRoute,
        deleteRoute,
        addStation,
        updateStation,
        deleteStation,
        getStationsForRoute,
        saveRouteStations,
        addVehicleType,
        updateVehicleType,
        deleteVehicleType,
        addDriver,
        updateDriver,
        deleteDriver,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addTrip,
        updateTrip,
        deleteTrip,
        getStopsForTrip,
        saveTripStops,
        addBooking,
        updateBooking,
        deleteBooking,
        addPayment,
        updatePayment,
        deletePayment,
        addTicket,
        updateTicket,
        deleteTicket,
        resetData,
        exportJSON,
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
