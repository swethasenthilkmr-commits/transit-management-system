import React, { useState, useEffect } from 'react';
import { Trip, Route, Vehicle, TripStatus } from '../../types/transit';
import { Modal } from '../common/Modal';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  initialTrip?: Trip | null;
  existingIds: string[];
  routes: Route[];
  vehicles: Vehicle[];
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip,
  existingIds,
  routes,
  vehicles,
}) => {
  const isEditing = !!initialTrip;

  const [tripId, setTripId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [routeId, setRouteId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [status, setStatus] = useState<TripStatus>('Scheduled');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTrip) {
      setTripId(initialTrip.trip_id);
      setDate(initialTrip.date);
      setStartTime(initialTrip.start_time);
      setEndTime(initialTrip.end_time);
      setRouteId(initialTrip.route_id);
      setVehicleId(initialTrip.vehicle_id || 'none');
      setStatus(initialTrip.status || 'Scheduled');
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setTripId(`T${String(nextNum).padStart(3, '0')}`);
      setDate('2026-08-20');
      setStartTime('08:00');
      setEndTime('08:45');
      setRouteId(routes[0]?.route_id || '');
      setVehicleId(vehicles[0]?.vehicle_id || 'none');
      setStatus('Scheduled');
    }
    setErrors({});
  }, [initialTrip, isOpen, existingIds, routes, vehicles]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!tripId.trim()) {
      errs.tripId = 'Trip ID is required';
    } else if (!isEditing && existingIds.includes(tripId.trim())) {
      errs.tripId = 'Trip ID already exists';
    }

    if (!date) errs.date = 'Trip Date is required';
    if (!startTime) errs.startTime = 'Start time is required';
    if (!endTime) errs.endTime = 'End time is required';
    if (!routeId) errs.routeId = 'Assigned Route is required';

    if (startTime && endTime && startTime >= endTime) {
      errs.endTime = 'End time must be later than start time';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      trip_id: tripId.trim().toUpperCase(),
      date,
      start_time: startTime,
      end_time: endTime,
      route_id: routeId,
      vehicle_id: vehicleId === 'none' ? undefined : vehicleId,
      status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Trip Schedule: ${initialTrip?.trip_id}` : 'Schedule New Transit Trip'}
      subtitle="Define route, scheduled departures, vehicle dispatch, and operational status"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Trip ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. T001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.tripId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.tripId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Operation Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.date && <p className="text-[10px] text-rose-500 mt-0.5">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Assigned Transit Route <span className="text-rose-500">*</span>
          </label>
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {routes.map((r) => (
              <option key={r.route_id} value={r.route_id}>
                {r.route_id}: {r.name} [{r.type} - {r.total_distance} km]
              </option>
            ))}
          </select>
          {errors.routeId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.routeId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Start Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.startTime && <p className="text-[10px] text-rose-500 mt-0.5">{errors.startTime}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              End Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.endTime && <p className="text-[10px] text-rose-500 mt-0.5">{errors.endTime}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Assigned Vehicle</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="none">-- Unassigned --</option>
              {vehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.vehicle_id}: {v.registration_no} ({v.color})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TripStatus)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In-Transit">In-Transit</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
          >
            {isEditing ? 'Update Trip' : 'Create Trip'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
