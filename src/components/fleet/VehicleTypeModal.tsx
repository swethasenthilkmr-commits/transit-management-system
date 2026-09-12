import React, { useState, useEffect } from 'react';
import { VehicleType, FuelType } from '../../types/transit';
import { Modal } from '../common/Modal';

interface VehicleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vt: VehicleType) => void;
  initialType?: VehicleType | null;
  existingIds: string[];
}

export const VehicleTypeModal: React.FC<VehicleTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialType,
  existingIds,
}) => {
  const isEditing = !!initialType;

  const [typeId, setTypeId] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('Diesel');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialType) {
      setTypeId(initialType.type_id);
      setName(initialType.name);
      setCapacity(String(initialType.capacity));
      setFuelType(initialType.fuel_type);
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setTypeId(`VT${String(nextNum).padStart(2, '0')}`);
      setName('');
      setCapacity('40');
      setFuelType('Diesel');
    }
    setErrors({});
  }, [initialType, isOpen, existingIds]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!typeId.trim()) {
      errs.typeId = 'Type ID is required';
    } else if (!isEditing && existingIds.includes(typeId.trim())) {
      errs.typeId = 'Type ID already exists';
    }

    if (!name.trim()) errs.name = 'Type Name is required';

    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      errs.capacity = 'Capacity must be a positive whole number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      type_id: typeId.trim().toUpperCase(),
      name: name.trim(),
      capacity: parseInt(capacity, 10),
      fuel_type: fuelType,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Vehicle Type: ${initialType?.type_id}` : 'Create Vehicle Type'}
      subtitle="Define seating specifications and propulsion fuel category"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Type ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            disabled={isEditing}
            placeholder="e.g. VT01"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.typeId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.typeId}</p>}
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Category / Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. City Bus Standard / Metro Coach"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Passenger Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="40"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.capacity && <p className="text-[10px] text-rose-500 mt-0.5">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
              <option value="Hybrid">Hybrid</option>
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
            {isEditing ? 'Update Type' : 'Create Type'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
