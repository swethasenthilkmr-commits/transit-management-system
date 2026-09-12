import React from 'react';
import { useTransit } from '../../context/TransitContext';
import {
  UsersIcon,
  RouteIcon,
  VehicleIcon,
  TripIcon,
  PaymentIcon,
  PlusIcon,
  BusIcon,
  MetroIcon,
} from '../common/Icons';
import { RouteTypeBadge, StatusBadge } from '../common/Badge';

export const DashboardView: React.FC = () => {
  const {
    passengers,
    routes,
    stations,
    vehicles,
    drivers,
    trips,
    bookings,
    payments,
    tickets,
    setActiveTab,
  } = useTransit();

  const totalRevenue = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const busRoutesCount = routes.filter((r) => r.type === 'Bus').length;
  const metroRoutesCount = routes.filter((r) => r.type === 'Metro').length;

  const assignedVehiclesCount = vehicles.filter((v) => v.driver_id !== null).length;
  const driverUtilization = drivers.length > 0 ? Math.round((assignedVehiclesCount / drivers.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-6 text-white shadow-md border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Central Dispatch & Fleet Control
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Public Bus & Metro Operations
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Real-time management portal for transit routes, driver scheduling, weak entity stop sequences, passenger bookings, and ticket settlements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-900 bg-white rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusIcon size={15} />
            New Booking
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trips')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <TripIcon size={15} />
            View Schedules
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Passengers */}
        <div
          onClick={() => setActiveTab('passengers')}
          className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Registered Passengers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UsersIcon size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">{passengers.length}</span>
            <span className="text-[11px] text-zinc-500 font-medium">riders on file</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>With contact sub-entities</span>
            <span className="text-blue-600 font-medium group-hover:underline">Manage &rarr;</span>
          </div>
        </div>

        {/* Transit Routes */}
        <div
          onClick={() => setActiveTab('routes')}
          className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Active Network</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <RouteIcon size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">{routes.length}</span>
            <span className="text-[11px] text-zinc-500 font-medium">Routes ({stations.length} Stations)</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{busRoutesCount} Bus · {metroRoutesCount} Metro</span>
            <span className="text-indigo-600 font-medium group-hover:underline">Network &rarr;</span>
          </div>
        </div>

        {/* Fleet & Drivers */}
        <div
          onClick={() => setActiveTab('fleet-vehicles')}
          className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Fleet & Drivers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <VehicleIcon size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">{vehicles.length}</span>
            <span className="text-[11px] text-zinc-500 font-medium">Vehicles ({drivers.length} Drivers)</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{driverUtilization}% assigned (1:1)</span>
            <span className="text-amber-600 font-medium group-hover:underline">Fleet &rarr;</span>
          </div>
        </div>

        {/* Bookings & Revenue */}
        <div
          onClick={() => setActiveTab('payments')}
          className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Revenue & Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PaymentIcon size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">${totalRevenue.toFixed(2)}</span>
            <span className="text-[11px] text-zinc-500 font-medium">from {payments.length} txns</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{tickets.length} tickets issued</span>
            <span className="text-emerald-600 font-medium group-hover:underline">Ledger &rarr;</span>
          </div>
        </div>
      </div>

      {/* Grid: Active Trips Timeline Preview & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Scheduled Trips */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Today's Scheduled Trips</h3>
              <p className="text-xs text-zinc-400">Departures and assigned transit corridors</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('trips')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all trips &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {trips.slice(0, 4).map((t) => {
              const route = routes.find((r) => r.route_id === t.route_id);
              const vehicle = vehicles.find((v) => v.vehicle_id === t.vehicle_id);

              return (
                <div
                  key={t.trip_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-50/70 hover:bg-zinc-100/70 rounded-xl border border-zinc-100 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        route?.type === 'Metro'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {route?.type === 'Metro' ? <MetroIcon size={18} /> : <BusIcon size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900">{t.trip_id}</span>
                        {route && <RouteTypeBadge type={route.type} />}
                        <span className="text-xs font-semibold text-zinc-800">
                          {route?.name || t.route_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Vehicle: <span className="font-mono">{vehicle?.registration_no || 'Unassigned'}</span> · Date: {t.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-zinc-800">
                        {t.start_time} - {t.end_time}
                      </div>
                      <div className="text-[10px] text-zinc-400">Scheduled window</div>
                    </div>
                    <StatusBadge status={t.status || 'Scheduled'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Recent Bookings & Tickets */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Recent Bookings</h3>
                <p className="text-xs text-zinc-400">Passenger ticket reservations</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View all &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {bookings.slice(0, 4).map((b) => {
                const passenger = passengers.find((p) => p.passenger_id === b.passenger_id);
                const trip = trips.find((t) => t.trip_id === b.trip_id);
                const route = routes.find((r) => r.route_id === trip?.route_id);

                return (
                  <div
                    key={b.booking_id}
                    className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-zinc-900">
                        {passenger ? `${passenger.first_name} ${passenger.last_name}` : b.passenger_id}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Trip <span className="font-mono">{b.trip_id}</span> · Seat <span className="font-mono font-bold text-zinc-800">{b.seat_number}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {route?.name || 'Corridor transit'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] text-zinc-500 block mb-1">
                        {b.booking_id}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-lg transition-colors text-center"
            >
              Open Ticket Dispatcher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
