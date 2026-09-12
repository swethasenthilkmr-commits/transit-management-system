import React, { useState, useEffect } from 'react';
import { Driver } from '../../types/transit';
import { Modal } from '../common/Modal';
import { PlusIcon, TrashIcon, PhoneIcon } from '../common/Icons';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  initialDriver?: Driver | null;
  existingIds: string[];
}

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDriver,
  existingIds,
}) => {
  const isEditing = !!initialDriver;

  const [driverId, setDriverId] = useState('');
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialDriver) {
      setDriverId(initialDriver.driver_id);
      setName(initialDriver.name);
      setLicenseNo(initialDriver.license_no);
      setDob(initialDriver.dob);
      setPhoneNumbers(
        initialDriver.phone_numbers && initialDriver.phone_numbers.length > 0
          ? [...initialDriver.phone_numbers]
          : ['']
      );
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setDriverId(`D${String(nextNum).padStart(3, '0')}`);
      setName('');
      setLicenseNo('');
      setDob('1985-01-01');
      setPhoneNumbers(['']);
    }
    setErrors({});
  }, [initialDriver, isOpen, existingIds]);

  const handleAddPhone = () => {
    setPhoneNumbers((prev) => [...prev, '']);
  };

  const handlePhoneChange = (index: number, val: string) => {
    setPhoneNumbers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemovePhone = (index: number) => {
    if (phoneNumbers.length <= 1) {
      setPhoneNumbers(['']);
      return;
    }
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!driverId.trim()) {
      errs.driverId = 'Driver ID is required';
    } else if (!isEditing && existingIds.includes(driverId.trim())) {
      errs.driverId = 'Driver ID already exists';
    }

    if (!name.trim()) errs.name = 'Driver Name is required';
    if (!licenseNo.trim()) errs.licenseNo = 'License Number is required';
    if (!dob) errs.dob = 'Date of Birth is required';

    const validPhones = phoneNumbers.map((p) => p.trim()).filter(Boolean);
    if (validPhones.length === 0) {
      errs.phones = 'At least one contact phone is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      driver_id: driverId.trim().toUpperCase(),
      name: name.trim(),
      license_no: licenseNo.trim().toUpperCase(),
      dob,
      phone_numbers: phoneNumbers.map((p) => p.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Driver: ${initialDriver?.driver_id}` : 'Register Transit Driver'}
      subtitle="Driver credentials, license number, and multivalued contacts"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Driver ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. D001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.driverId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.driverId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.dob && <p className="text-[10px] text-rose-500 mt-0.5">{errors.dob}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ravi Kumar"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Commercial Driving License No <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
            placeholder="e.g. DL1001"
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg uppercase font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.licenseNo && <p className="text-[10px] text-rose-500 mt-0.5">{errors.licenseNo}</p>}
        </div>

        {/* Multivalued contacts */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Multivalued Contact Numbers
            </span>
            <button
              type="button"
              onClick={handleAddPhone}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors"
            >
              <PlusIcon size={12} /> Add Contact
            </button>
          </div>

          <div className="space-y-2">
            {phoneNumbers.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-zinc-400 pointer-events-none">
                    <PhoneIcon size={13} />
                  </span>
                  <input
                    type="tel"
                    value={p}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    placeholder="e.g. 9840123456"
                    className="w-full pl-8 pr-3 py-1.5 border border-zinc-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePhone(idx)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>
          {errors.phones && <p className="text-[10px] text-rose-500 mt-1">{errors.phones}</p>}
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
            {isEditing ? 'Update Driver' : 'Register Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
