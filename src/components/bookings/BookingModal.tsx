import React, { useState, useEffect } from 'react';
import { Booking, Passenger, Trip, BookingStatus } from '../../types/transit';
import { Modal } from '../common/Modal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  initialBooking?: Booking | null;
  existingIds: string[];
  passengers: Passenger[];
  trips: Trip[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBooking,
  existingIds,
  passengers,
  trips,
}) => {
  const isEditing = !!initialBooking;

  const [bookingId, setBookingId] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [tripId, setTripId] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [status, setStatus] = useState<BookingStatus>('Confirmed');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialBooking) {
      setBookingId(initialBooking.booking_id);
      setPassengerId(initialBooking.passenger_id);
      setTripId(initialBooking.trip_id);
      setSeatNumber(initialBooking.seat_number);
      setBookingDate(initialBooking.booking_date);
      setStatus(initialBooking.status);
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setBookingId(`B${String(nextNum).padStart(3, '0')}`);
      setPassengerId(passengers[0]?.passenger_id || '');
      setTripId(trips[0]?.trip_id || '');
      setSeatNumber('A01');
      setBookingDate('2026-08-20');
      setStatus('Confirmed');
    }
    setErrors({});
  }, [initialBooking, isOpen, existingIds, passengers, trips]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!bookingId.trim()) {
      errs.bookingId = 'Booking ID is required';
    } else if (!isEditing && existingIds.includes(bookingId.trim())) {
      errs.bookingId = 'Booking ID already exists';
    }

    if (!passengerId) errs.passengerId = 'Passenger selection is required';
    if (!tripId) errs.tripId = 'Trip selection is required';
    if (!seatNumber.trim()) errs.seatNumber = 'Seat Number is required';
    if (!bookingDate) errs.bookingDate = 'Booking Date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      booking_id: bookingId.trim().toUpperCase(),
      passenger_id: passengerId,
      trip_id: tripId,
      seat_number: seatNumber.trim().toUpperCase(),
      booking_date: bookingDate,
      status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Booking: ${initialBooking?.booking_id}` : 'Create Passenger Trip Booking'}
      subtitle="M:N relational link between Passenger and Scheduled Trip"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Booking ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. B001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.bookingId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.bookingId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Booking Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.bookingDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.bookingDate}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Passenger (M:N Entity) <span className="text-rose-500">*</span>
          </label>
          <select
            value={passengerId}
            onChange={(e) => setPassengerId(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {passengers.map((p) => (
              <option key={p.passenger_id} value={p.passenger_id}>
                {p.passenger_id}: {p.first_name} {p.last_name} ({p.email})
              </option>
            ))}
          </select>
          {errors.passengerId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.passengerId}</p>}
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Scheduled Trip <span className="text-rose-500">*</span>
          </label>
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {trips.map((t) => (
              <option key={t.trip_id} value={t.trip_id}>
                {t.trip_id} ({t.date}, {t.start_time}-{t.end_time}, Route: {t.route_id})
              </option>
            ))}
          </select>
          {errors.tripId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.tripId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Seat Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              placeholder="e.g. A01 / M14"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.seatNumber && <p className="text-[10px] text-rose-500 mt-0.5">{errors.seatNumber}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Booking Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
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
            {isEditing ? 'Update Booking' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
