import React, { useState, useEffect } from 'react';
import { Passenger } from '../../types/transit';
import { Modal } from '../common/Modal';
import { PlusIcon, TrashIcon, PhoneIcon } from '../common/Icons';

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passenger: Passenger) => void;
  initialPassenger?: Passenger | null;
  existingIds: string[];
}

export const PassengerModal: React.FC<PassengerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPassenger,
  existingIds,
}) => {
  const isEditing = !!initialPassenger;

  const [passengerId, setPassengerId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [dob, setDob] = useState('');
  const [doorNo, setDoorNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');

  // Multivalued PASSENGER_CONTACT phone numbers
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPassenger) {
      setPassengerId(initialPassenger.passenger_id);
      setFirstName(initialPassenger.first_name);
      setLastName(initialPassenger.last_name);
      setEmail(initialPassenger.email);
      setGender(initialPassenger.gender);
      setDob(initialPassenger.dob);
      setDoorNo(initialPassenger.door_no);
      setStreet(initialPassenger.street);
      setCity(initialPassenger.city);
      setState(initialPassenger.state);
      setPin(initialPassenger.pin);
      setPhoneNumbers(
        initialPassenger.phone_numbers && initialPassenger.phone_numbers.length > 0
          ? [...initialPassenger.phone_numbers]
          : ['']
      );
    } else {
      // Auto-generate next ID like P005
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      const nextId = `P${String(nextNum).padStart(3, '0')}`;

      setPassengerId(nextId);
      setFirstName('');
      setLastName('');
      setEmail('');
      setGender('M');
      setDob('2000-01-01');
      setDoorNo('');
      setStreet('');
      setCity('Chennai');
      setState('TN');
      setPin('600001');
      setPhoneNumbers(['']);
    }
    setErrors({});
  }, [initialPassenger, isOpen, existingIds]);

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

    if (!passengerId.trim()) {
      errs.passengerId = 'Passenger ID is required';
    } else if (!isEditing && existingIds.includes(passengerId.trim())) {
      errs.passengerId = 'Passenger ID already exists';
    }

    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email address';
    }

    if (!dob) errs.dob = 'Date of birth is required';
    if (!doorNo.trim()) errs.doorNo = 'Door No is required';
    if (!street.trim()) errs.street = 'Street is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State is required';
    if (!pin.trim()) errs.pin = 'PIN is required';

    const validPhones = phoneNumbers.map((p) => p.trim()).filter(Boolean);
    if (validPhones.length === 0) {
      errs.phones = 'At least one contact phone number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanedPhones = phoneNumbers.map((p) => p.trim()).filter(Boolean);

    const record: Passenger = {
      passenger_id: passengerId.trim().toUpperCase(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      gender,
      dob,
      door_no: doorNo.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      pin: pin.trim(),
      phone_numbers: cleanedPhones,
    };

    onSave(record);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Passenger: ${initialPassenger?.passenger_id}` : 'Register New Passenger'}
      subtitle="Complete passenger entity attributes and multivalued contact numbers"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Row 1: ID, First Name, Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Passenger ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={passengerId}
              onChange={(e) => setPassengerId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. P001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.passengerId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.passengerId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Anu"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.firstName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Kumar"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.lastName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.lastName}</p>}
          </div>
        </div>

        {/* Row 2: Email, Gender, DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anu@gmail.com"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && <p className="text-[10px] text-rose-500 mt-0.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'Other')}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
              <option value="Other">Other</option>
            </select>
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

        {/* Address section */}
        <div className="pt-2 border-t border-zinc-100">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
            Residential Address
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Door No</label>
              <input
                type="text"
                value={doorNo}
                onChange={(e) => setDoorNo(e.target.value)}
                placeholder="12"
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.doorNo && <p className="text-[10px] text-rose-500 mt-0.5">{errors.doorNo}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Street</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Anna St"
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.street && <p className="text-[10px] text-rose-500 mt-0.5">{errors.street}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Chennai"
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.city && <p className="text-[10px] text-rose-500 mt-0.5">{errors.city}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">State / PIN</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="TN"
                  className="w-14 px-2 py-1.5 border border-zinc-200 rounded-lg uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="600001"
                  className="flex-1 px-2 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {errors.pin && <p className="text-[10px] text-rose-500 mt-0.5">{errors.pin}</p>}
            </div>
          </div>
        </div>

        {/* Multivalued PASSENGER_CONTACT Sub-Entity */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                Multivalued Contacts (PASSENGER_CONTACT)
              </span>
              <span className="text-[10px] text-zinc-400">
                Support multiple phone numbers linked to this passenger
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddPhone}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
            >
              <PlusIcon size={12} /> Add Phone
            </button>
          </div>

          <div className="space-y-2">
            {phoneNumbers.map((phone, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-zinc-400 pointer-events-none">
                    <PhoneIcon size={13} />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    placeholder={`Contact Number #${idx + 1} (e.g. 9876543210)`}
                    className="w-full pl-8 pr-3 py-1.5 border border-zinc-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePhone(idx)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove phone number"
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            ))}
          </div>
          {errors.phones && <p className="text-[10px] text-rose-500 mt-1">{errors.phones}</p>}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
          >
            {isEditing ? 'Update Passenger' : 'Register Passenger'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
