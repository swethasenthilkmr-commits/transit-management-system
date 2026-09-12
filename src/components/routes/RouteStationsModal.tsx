import React, { useState, useEffect } from 'react';
import { Route, Station } from '../../types/transit';
import { Modal } from '../common/Modal';
import { RouteTypeBadge } from '../common/Badge';
import { ChevronUpIcon, ChevronDownIcon, TrashIcon, PlusIcon, StationIcon } from '../common/Icons';

interface RouteStationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  allStations: Station[];
  initialAssigned: { station: Station; stopOrder: number; distanceFromStart?: number }[];
  onSave: (routeId: string, stops: { station_id: string; stop_order: number; distance_from_start?: number }[]) => void;
}

interface StopItem {
  station_id: string;
  station_name: string;
  area: string;
  landmark: string;
  stop_order: number;
  distance_from_start?: number;
}

export const RouteStationsModal: React.FC<RouteStationsModalProps> = ({
  isOpen,
  onClose,
  route,
  allStations,
  initialAssigned,
  onSave,
}) => {
  const [stops, setStops] = useState<StopItem[]>([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    if (route && initialAssigned) {
      const formatted = initialAssigned.map((item) => ({
        station_id: item.station.station_id,
        station_name: item.station.name,
        area: item.station.area,
        landmark: item.station.landmark,
        stop_order: item.stopOrder,
        distance_from_start: item.distanceFromStart,
      }));
      setStops(formatted);

      // Default station selector to first unassigned station
      const assignedIds = formatted.map((f) => f.station_id);
      const unassigned = allStations.filter((s) => !assignedIds.includes(s.station_id));
      if (unassigned.length > 0) {
        setSelectedStationId(unassigned[0].station_id);
      } else if (allStations.length > 0) {
        setSelectedStationId(allStations[0].station_id);
      }
      setDistance('');
    }
  }, [route, initialAssigned, allStations, isOpen]);

  if (!route) return null;

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    // Recalculate sequential stop orders
    const normalized = updated.map((item, idx) => ({
      ...item,
      stop_order: idx + 1,
    }));
    setStops(normalized);
  };

  const handleMoveDown = (index: number) => {
    if (index === stops.length - 1) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    const normalized = updated.map((item, idx) => ({
      ...item,
      stop_order: idx + 1,
    }));
    setStops(normalized);
  };

  const handleRemove = (index: number) => {
    const updated = stops.filter((_, i) => i !== index);
    const normalized = updated.map((item, idx) => ({
      ...item,
      stop_order: idx + 1,
    }));
    setStops(normalized);
  };

  const handleAddStop = () => {
    if (!selectedStationId) return;
    const targetStation = allStations.find((s) => s.station_id === selectedStationId);
    if (!targetStation) return;

    const nextOrder = stops.length + 1;
    const distNum = distance ? parseFloat(distance) : undefined;

    setStops((prev) => [
      ...prev,
      {
        station_id: targetStation.station_id,
        station_name: targetStation.name,
        area: targetStation.area,
        landmark: targetStation.landmark,
        stop_order: nextOrder,
        distance_from_start: distNum,
      },
    ]);
    setDistance('');
  };

  const handleSave = () => {
    onSave(
      route.route_id,
      stops.map((s) => ({
        station_id: s.station_id,
        stop_order: s.stop_order,
        distance_from_start: s.distance_from_start,
      }))
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Route Stations: ${route.route_id}`}
      subtitle={`${route.name} (${route.total_distance} km total)`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Route info header bar */}
        <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
          <div className="flex items-center gap-2">
            <RouteTypeBadge type={route.type} />
            <span className="font-semibold text-zinc-900">{route.name}</span>
          </div>
          <div className="text-zinc-500 font-mono text-[11px]">
            {stops.length} Stops Configured
          </div>
        </div>

        {/* Current Stops List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Sequential Stop Sequence (M:N Mapping)
            </span>
            <span className="text-[10px] text-zinc-400">
              Use arrows to adjust the stop order sequence
            </span>
          </div>

          {stops.length > 0 ? (
            <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-100 bg-white overflow-hidden shadow-xs">
              {stops.map((stop, index) => (
                <div
                  key={`${stop.station_id}-${index}`}
                  className="flex items-center justify-between p-3 hover:bg-zinc-50/60 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 text-white font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                      {stop.stop_order}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900">{stop.station_name}</span>
                        <span className="font-mono text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded">
                          {stop.station_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {stop.area} · Near {stop.landmark}
                        {stop.distance_from_start !== undefined && (
                          <span className="font-mono ml-1.5 text-zinc-600">
                            (+{stop.distance_from_start} km)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Stop Earlier"
                    >
                      <ChevronUpIcon size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={index === stops.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Stop Later"
                    >
                      <ChevronDownIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                      title="Remove Station from Route"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-400">
              <StationIcon size={24} className="mx-auto mb-1 text-zinc-300" />
              <p className="font-medium text-xs text-zinc-600">No stations assigned to this route</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Use the section below to attach stations in sequence</p>
            </div>
          )}
        </div>

        {/* Add Station Stop Section */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
          <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider block">
            Add Station Stop to Route
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="block text-zinc-600 text-[11px] font-medium mb-1">Select Station</label>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {allStations.map((s) => (
                  <option key={s.station_id} value={s.station_id}>
                    {s.station_id}: {s.name} ({s.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-600 text-[11px] font-medium mb-1">Distance from start (km)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 5.5"
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddStop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors shadow-2xs"
            >
              <PlusIcon size={14} /> Append Station as Stop #{stops.length + 1}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
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
            Save Route Sequence
          </button>
        </div>
      </div>
    </Modal>
  );
};
