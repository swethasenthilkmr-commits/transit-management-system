import React, { useState, useEffect } from 'react';
import { Station } from '../../types/transit';
import { Modal } from '../common/Modal';

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (station: Station) => void;
  initialStation?: Station | null;
  existingIds: string[];
}

export const StationModal: React.FC<StationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStation,
  existingIds,
}) => {
  const isEditing = !!initialStation;

  const [stationId, setStationId] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialStation) {
      setStationId(initialStation.station_id);
      setName(initialStation.name);
      setCity(initialStation.city);
      setArea(initialStation.area);
      setLandmark(initialStation.landmark);
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setStationId(`S${String(nextNum).padStart(3, '0')}`);
      setName('');
      setCity('Chennai');
      setArea('');
      setLandmark('');
    }
    setErrors({});
  }, [initialStation, isOpen, existingIds]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!stationId.trim()) {
      errs.stationId = 'Station ID is required';
    } else if (!isEditing && existingIds.includes(stationId.trim())) {
      errs.stationId = 'Station ID already exists';
    }

    if (!name.trim()) errs.name = 'Station Name is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!area.trim()) errs.area = 'Area is required';
    if (!landmark.trim()) errs.landmark = 'Landmark is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      station_id: stationId.trim().toUpperCase(),
      name: name.trim(),
      city: city.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Station: ${initialStation?.station_id}` : 'Add New Transit Station'}
      subtitle="Define station stop location, administrative area, and landmark"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Station ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. S001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.stationId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.stationId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Chennai"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.city && <p className="text-[10px] text-rose-500 mt-0.5">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Station Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Central Railway Station"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Area / Locality <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Central / Meenambakkam"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.area && <p className="text-[10px] text-rose-500 mt-0.5">{errors.area}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Prominent Landmark <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Railway Station / Airport Gate"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.landmark && <p className="text-[10px] text-rose-500 mt-0.5">{errors.landmark}</p>}
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
            {isEditing ? 'Update Station' : 'Create Station'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
