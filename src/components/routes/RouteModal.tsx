import React, { useState, useEffect } from 'react';
import { Route, RouteType } from '../../types/transit';
import { Modal } from '../common/Modal';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (route: Route) => void;
  initialRoute?: Route | null;
  existingIds: string[];
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoute,
  existingIds,
}) => {
  const isEditing = !!initialRoute;

  const [routeId, setRouteId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<RouteType>('Bus');
  const [totalDistance, setTotalDistance] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialRoute) {
      setRouteId(initialRoute.route_id);
      setName(initialRoute.name);
      setType(initialRoute.type);
      setTotalDistance(String(initialRoute.total_distance));
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setRouteId(`R${String(nextNum).padStart(3, '0')}`);
      setName('');
      setType('Bus');
      setTotalDistance('15.0');
    }
    setErrors({});
  }, [initialRoute, isOpen, existingIds]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!routeId.trim()) {
      errs.routeId = 'Route ID is required';
    } else if (!isEditing && existingIds.includes(routeId.trim())) {
      errs.routeId = 'Route ID already exists';
    }

    if (!name.trim()) errs.name = 'Route Name is required';

    const distNum = parseFloat(totalDistance);
    if (isNaN(distNum) || distNum <= 0) {
      errs.distance = 'Distance must be a valid positive number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      route_id: routeId.trim().toUpperCase(),
      name: name.trim(),
      type,
      total_distance: parseFloat(parseFloat(totalDistance).toFixed(2)),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Route: ${initialRoute?.route_id}` : 'Create New Transit Route'}
      subtitle="Define route attributes and operational transit type"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Route ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            disabled={isEditing}
            placeholder="e.g. R001"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.routeId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.routeId}</p>}
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Route Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chennai Central Bus Line"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Transit Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RouteType)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Bus">Bus</option>
              <option value="Metro">Metro</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Total Distance (km) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={totalDistance}
              onChange={(e) => setTotalDistance(e.target.value)}
              placeholder="15.00"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.distance && <p className="text-[10px] text-rose-500 mt-0.5">{errors.distance}</p>}
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
            {isEditing ? 'Update Route' : 'Create Route'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
