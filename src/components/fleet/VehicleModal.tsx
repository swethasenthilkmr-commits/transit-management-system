import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleType, Driver } from '../../types/transit';
import { Modal } from '../common/Modal';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  initialVehicle?: Vehicle | null;
  existingIds: string[];
  vehicleTypes: VehicleType[];
  drivers: Driver[];
  allVehicles: Vehicle[];
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVehicle,
  existingIds,
  vehicleTypes,
  drivers,
  allVehicles,
}) => {
  const isEditing = !!initialVehicle;

  const [vehicleId, setVehicleId] = useState('');
  const [regNo, setRegNo] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [color, setColor] = useState('');
  const [typeId, setTypeId] = useState('');
  const [driverId, setDriverId] = useState<string>('none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialVehicle) {
      setVehicleId(initialVehicle.vehicle_id);
      setRegNo(initialVehicle.registration_no);
      setMfgDate(initialVehicle.manufacture_date);
      setColor(initialVehicle.color);
      setTypeId(initialVehicle.type_id);
      setDriverId(initialVehicle.driver_id || 'none');
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setVehicleId(`V${String(nextNum).padStart(3, '0')}`);
      setRegNo('');
      setMfgDate('2023-01-01');
      setColor('Blue');
      setTypeId(vehicleTypes[0]?.type_id || '');
      setDriverId('none');
    }
    setErrors({});
  }, [initialVehicle, isOpen, existingIds, vehicleTypes]);

  // Determine which vehicle each driver is currently assigned to (for 1:1 check)
  const driverAssignmentMap = React.useMemo(() => {
    const map = new Map<string, string>(); // driver_id -> vehicle_id
    allVehicles.forEach((v) => {
      if (v.driver_id) {
        map.set(v.driver_id, v.vehicle_id);
      }
    });
    return map;
  }, [allVehicles]);

  const currentlyAssignedVehicle = driverId !== 'none' ? driverAssignmentMap.get(driverId) : null;
  const isDriverReassigned =
    currentlyAssignedVehicle && currentlyAssignedVehicle !== initialVehicle?.vehicle_id;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!vehicleId.trim()) {
      errs.vehicleId = 'Vehicle ID is required';
    } else if (!isEditing && existingIds.includes(vehicleId.trim())) {
      errs.vehicleId = 'Vehicle ID already exists';
    }

    if (!regNo.trim()) errs.regNo = 'Registration number is required';
    if (!mfgDate) errs.mfgDate = 'Manufacture date is required';
    if (!color.trim()) errs.color = 'Color is required';
    if (!typeId) errs.typeId = 'Vehicle Type is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      vehicle_id: vehicleId.trim().toUpperCase(),
      registration_no: regNo.trim().toUpperCase(),
      manufacture_date: mfgDate,
      color: color.trim(),
      type_id: typeId,
      driver_id: driverId === 'none' ? null : driverId,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Vehicle: ${initialVehicle?.vehicle_id}` : 'Add Vehicle to Fleet'}
      subtitle="Fleet registry and 1:1 dedicated driver assignment"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Vehicle ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. V001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.vehicleId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.vehicleId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Registration No <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. TN01AB1234"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg uppercase font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.regNo && <p className="text-[10px] text-rose-500 mt-0.5">{errors.regNo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Vehicle Type & Model <span className="text-rose-500">*</span>
            </label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {vehicleTypes.map((vt) => (
                <option key={vt.type_id} value={vt.type_id}>
                  {vt.type_id}: {vt.name} ({vt.capacity} pax · {vt.fuel_type})
                </option>
              ))}
            </select>
            {errors.typeId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.typeId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Exterior Color <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Blue / Silver"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.color && <p className="text-[10px] text-rose-500 mt-0.5">{errors.color}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Manufacture Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={mfgDate}
            onChange={(e) => setMfgDate(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.mfgDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.mfgDate}</p>}
        </div>

        {/* 1:1 Assigned Driver selector with visual constraint helper */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-zinc-800">
              Assigned Dedicated Driver (1:1 Constraint)
            </label>
            <span className="text-[10px] text-zinc-400">One driver per vehicle</span>
          </div>

          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="none">-- Unassigned (Standby Pool) --</option>
            {drivers.map((d) => {
              const assignedVehicle = driverAssignmentMap.get(d.driver_id);
              const isAssignedElsewhere =
                assignedVehicle && assignedVehicle !== initialVehicle?.vehicle_id;

              return (
                <option key={d.driver_id} value={d.driver_id}>
                  {d.driver_id}: {d.name} ({d.license_no})
                  {isAssignedElsewhere ? ` ⚠️ [Assigned to ${assignedVehicle}]` : ' [Available]'}
                </option>
              );
            })}
          </select>

          {isDriverReassigned && (
            <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
              <span>⚠️</span>
              <span>
                <strong>1:1 Reassignment:</strong> Driver is currently driving{' '}
                <span className="font-mono font-bold">{currentlyAssignedVehicle}</span>. Saving will reassign them to this vehicle.
              </span>
            </div>
          )}
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
            {isEditing ? 'Update Vehicle' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
