import React, { useState, useEffect } from 'react';
import { Trip, TripStop, Station, Route } from '../../types/transit';
import { Modal } from '../common/Modal';
import { RouteTypeBadge } from '../common/Badge';
import { ClockIcon, PlusIcon, TrashIcon, RefreshIcon } from '../common/Icons';

interface TripStopsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  route?: Route;
  allStations: Station[];
  routeStations: { station: Station; stopOrder: number }[];
  initialStops: (TripStop & { station?: Station })[];
  onSaveStops: (tripId: string, stops: TripStop[]) => void;
}

export const TripStopsModal: React.FC<TripStopsModalProps> = ({
  isOpen,
  onClose,
  trip,
  route,
  allStations,
  routeStations,
  initialStops,
  onSaveStops,
}) => {
  const [stops, setStops] = useState<TripStop[]>([]);
  const [newStationId, setNewStationId] = useState('');
  const [newArrival, setNewArrival] = useState('');
  const [newDeparture, setNewDeparture] = useState('');

  useEffect(() => {
    if (trip) {
      if (initialStops && initialStops.length > 0) {
        setStops([...initialStops].sort((a, b) => a.stop_order - b.stop_order));
      } else {
        // If no stops created yet for this trip, auto-init from route stations if available
        if (routeStations && routeStations.length > 0) {
          const autoStops: TripStop[] = routeStations.map((rs, idx) => ({
            trip_id: trip.trip_id,
            station_id: rs.station.station_id,
            stop_order: idx + 1,
            arrival_time: trip.start_time,
            departure_time: trip.end_time,
          }));
          setStops(autoStops);
        } else {
          setStops([]);
        }
      }

      setNewStationId(allStations[0]?.station_id || '');
      setNewArrival(trip.start_time);
      setNewDeparture(trip.end_time);
    }
  }, [trip, initialStops, routeStations, allStations, isOpen]);

  if (!trip) return null;

  const handleUpdateTime = (
    index: number,
    field: 'arrival_time' | 'departure_time',
    val: string
  ) => {
    setStops((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveStop = (index: number) => {
    setStops((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((item, idx) => ({ ...item, stop_order: idx + 1 }));
    });
  };

  const handleAddStop = () => {
    if (!newStationId) return;
    const nextOrder = stops.length + 1;
    const newStop: TripStop = {
      trip_id: trip.trip_id,
      station_id: newStationId,
      stop_order: nextOrder,
      arrival_time: newArrival || trip.start_time,
      departure_time: newDeparture || trip.end_time,
    };
    setStops((prev) => [...prev, newStop]);
  };

  const handleAutoPopulateFromRoute = () => {
    if (!routeStations || routeStations.length === 0) return;

    // Distribute time evenly between trip.start_time and trip.end_time
    const [startH, startM] = trip.start_time.split(':').map(Number);
    const [endH, endM] = trip.end_time.split(':').map(Number);
    const startTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;
    const totalDuration = Math.max(10, endTotalMin - startTotalMin);
    const stepMin = routeStations.length > 1 ? totalDuration / (routeStations.length - 1) : 0;

    const generated: TripStop[] = routeStations.map((rs, idx) => {
      const currentMin = Math.round(startTotalMin + idx * stepMin);
      const arrH = String(Math.floor(currentMin / 60) % 24).padStart(2, '0');
      const arrM = String(currentMin % 60).padStart(2, '0');
      const arrival = `${arrH}:${arrM}`;

      const depCurrentMin = Math.min(endTotalMin, currentMin + (idx === routeStations.length - 1 ? 0 : 3));
      const depH = String(Math.floor(depCurrentMin / 60) % 24).padStart(2, '0');
      const depM = String(depCurrentMin % 60).padStart(2, '0');
      const departure = `${depH}:${depM}`;

      return {
        trip_id: trip.trip_id,
        station_id: rs.station.station_id,
        stop_order: idx + 1,
        arrival_time: arrival,
        departure_time: departure,
      };
    });

    setStops(generated);
  };

  const handleSave = () => {
    onSaveStops(trip.trip_id, stops);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trip Stops Timeline: ${trip.trip_id}`}
      subtitle={`Weak Entity mapping: Station stops and arrival/departure timetable`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Header trip overview banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-zinc-900 text-sm">{trip.trip_id}</span>
              {route && <RouteTypeBadge type={route.type} />}
              <span className="font-semibold text-zinc-800">{route?.name || trip.route_id}</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Date: <span className="font-mono">{trip.date}</span> · Window:{' '}
              <span className="font-mono font-bold text-zinc-800">
                {trip.start_time} - {trip.end_time}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoPopulateFromRoute}
            title="Auto-generate stops from Route sequence with evenly spaced times"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/50 self-start sm:self-auto"
          >
            <RefreshIcon size={12} /> Sync From Route Pattern
          </button>
        </div>

        {/* Visual Timeline Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Step-by-Step Stop Timeline ({stops.length} Stations)
            </span>
            <span className="text-[10px] text-zinc-400">Times can be edited directly</span>
          </div>

          {stops.length > 0 ? (
            <div className="relative pl-6 py-2 space-y-4 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-200">
              {stops.map((stop, idx) => {
                const station = allStations.find((s) => s.station_id === stop.station_id);
                const isFirst = idx === 0;
                const isLast = idx === stops.length - 1;

                return (
                  <div key={`${stop.station_id}-${idx}`} className="relative flex items-start gap-3 group">
                    {/* Timeline Node Bullet */}
                    <div
                      className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] z-10 border-2 ${
                        isFirst
                          ? 'bg-emerald-600 border-emerald-200 text-white'
                          : isLast
                          ? 'bg-rose-600 border-rose-200 text-white'
                          : 'bg-zinc-900 border-white text-white'
                      }`}
                    >
                      {stop.stop_order}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 text-xs">
                            {station?.name || stop.station_id}
                          </span>
                          <span className="font-mono text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded">
                            {stop.station_id}
                          </span>
                          {isFirst && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                              Origin
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-medium border border-rose-200">
                              Terminal
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {station?.area} · Landmark: {station?.landmark || 'N/A'}
                        </div>
                      </div>

                      {/* Time Controls */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 p-1 rounded-lg">
                          <div className="flex items-center gap-1 px-1">
                            <span className="text-[10px] text-zinc-400">Arr</span>
                            <input
                              type="time"
                              value={stop.arrival_time}
                              onChange={(e) => handleUpdateTime(idx, 'arrival_time', e.target.value)}
                              className="bg-transparent font-mono text-xs font-semibold text-zinc-800 focus:outline-none"
                            />
                          </div>
                          <span className="text-zinc-300">|</span>
                          <div className="flex items-center gap-1 px-1">
                            <span className="text-[10px] text-zinc-400">Dep</span>
                            <input
                              type="time"
                              value={stop.departure_time}
                              onChange={(e) => handleUpdateTime(idx, 'departure_time', e.target.value)}
                              className="bg-transparent font-mono text-xs font-semibold text-zinc-800 focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveStop(idx)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Stop"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-400">
              <ClockIcon size={24} className="mx-auto mb-1 text-zinc-300" />
              <p className="font-medium text-xs text-zinc-600">No weak entity stops configured for this trip</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Click "Sync From Route Pattern" or add stops below</p>
            </div>
          )}
        </div>

        {/* Append Single Stop */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
          <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider block">
            Add Specific Station Stop to Timeline
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="sm:col-span-2">
              <label className="block text-zinc-500 text-[10px] mb-0.5">Select Station</label>
              <select
                value={newStationId}
                onChange={(e) => setNewStationId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white"
              >
                {allStations.map((s) => (
                  <option key={s.station_id} value={s.station_id}>
                    {s.station_id}: {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-500 text-[10px] mb-0.5">Arrival</label>
              <input
                type="time"
                value={newArrival}
                onChange={(e) => setNewArrival(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-zinc-500 text-[10px] mb-0.5">Departure</label>
              <input
                type="time"
                value={newDeparture}
                onChange={(e) => setNewDeparture(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddStop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <PlusIcon size={13} /> Append Stop
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
          >
            Save Trip Stops
          </button>
        </div>
      </div>
    </Modal>
  );
};
