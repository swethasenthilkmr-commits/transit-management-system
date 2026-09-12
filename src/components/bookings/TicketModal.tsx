import React, { useState, useEffect } from 'react';
import { Ticket, Passenger, Trip, Booking, Payment, TicketType, TravelClass } from '../../types/transit';
import { Modal } from '../common/Modal';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
  initialTicket?: Ticket | null;
  existingIds: string[];
  passengers: Passenger[];
  trips: Trip[];
  bookings: Booking[];
  payments: Payment[];
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTicket,
  existingIds,
  passengers,
  trips,
  bookings,
  payments,
}) => {
  const isEditing = !!initialTicket;

  const [ticketId, setTicketId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [tripId, setTripId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('Regular');
  const [travelClass, setTravelClass] = useState<TravelClass>('General');
  const [paymentId, setPaymentId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTicket) {
      setTicketId(initialTicket.ticket_id);
      setBookingId(initialTicket.booking_id);
      setPassengerId(initialTicket.passenger_id);
      setTripId(initialTicket.trip_id);
      setIssueDate(initialTicket.issue_date);
      setTicketType(initialTicket.ticket_type);
      setTravelClass(initialTicket.travel_class);
      setPaymentId(initialTicket.payment_id);
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setTicketId(`TK${String(nextNum).padStart(3, '0')}`);

      const firstBooking = bookings[0];
      if (firstBooking) {
        setBookingId(firstBooking.booking_id);
        setPassengerId(firstBooking.passenger_id);
        setTripId(firstBooking.trip_id);
      } else {
        setBookingId('');
        setPassengerId(passengers[0]?.passenger_id || '');
        setTripId(trips[0]?.trip_id || '');
      }

      setIssueDate('2026-08-20');
      setTicketType('Regular');
      setTravelClass('General');
      setPaymentId(payments[0]?.payment_id || '');
    }
    setErrors({});
  }, [initialTicket, isOpen, existingIds, bookings, passengers, trips, payments]);

  // When booking is selected, auto-populate passenger and trip
  const handleBookingChange = (bId: string) => {
    setBookingId(bId);
    const found = bookings.find((b) => b.booking_id === bId);
    if (found) {
      setPassengerId(found.passenger_id);
      setTripId(found.trip_id);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!ticketId.trim()) {
      errs.ticketId = 'Ticket ID is required';
    } else if (!isEditing && existingIds.includes(ticketId.trim())) {
      errs.ticketId = 'Ticket ID already exists';
    }

    if (!passengerId) errs.passengerId = 'Passenger selection is required';
    if (!tripId) errs.tripId = 'Trip selection is required';
    if (!bookingId) errs.bookingId = 'Linked Booking is required';
    if (!issueDate) errs.issueDate = 'Issue date is required';
    if (!paymentId) errs.paymentId = 'Payment reference is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ticket_id: ticketId.trim().toUpperCase(),
      booking_id: bookingId,
      passenger_id: passengerId,
      trip_id: tripId,
      issue_date: issueDate,
      ticket_type: ticketType,
      travel_class: travelClass,
      payment_id: paymentId,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Ticket: ${initialTicket?.ticket_id}` : 'Issue Transit Ticket & Boarding Pass'}
      subtitle="Relational bond linking Booking, Passenger, Trip, Travel Class, and Settled Payment"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Ticket ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. TK001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.ticketId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.ticketId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Issue Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.issueDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.issueDate}</p>}
          </div>
        </div>

        {/* Booking Link */}
        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Linked Booking Reservation <span className="text-rose-500">*</span>
          </label>
          <select
            value={bookingId}
            onChange={(e) => handleBookingChange(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
          >
            {bookings.map((b) => (
              <option key={b.booking_id} value={b.booking_id}>
                {b.booking_id}: Passenger {b.passenger_id} | Trip {b.trip_id} | Seat {b.seat_number}
              </option>
            ))}
          </select>
          {errors.bookingId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.bookingId}</p>}
        </div>

        {/* Passenger & Trip Auto-Selected */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Passenger <span className="text-rose-500">*</span>
            </label>
            <select
              value={passengerId}
              onChange={(e) => setPassengerId(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {passengers.map((p) => (
                <option key={p.passenger_id} value={p.passenger_id}>
                  {p.passenger_id}: {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
            {errors.passengerId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.passengerId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Trip <span className="text-rose-500">*</span>
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {trips.map((t) => (
                <option key={t.trip_id} value={t.trip_id}>
                  {t.trip_id} ({t.start_time}-{t.end_time}, Route: {t.route_id})
                </option>
              ))}
            </select>
            {errors.tripId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.tripId}</p>}
          </div>
        </div>

        {/* Ticket Type & Travel Class */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Ticket Type</label>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value as TicketType)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Regular">Regular Single Journey</option>
              <option value="Daily Pass">Daily All-Line Pass</option>
              <option value="Weekly Pass">Weekly Commuter Pass</option>
              <option value="Monthly Pass">Monthly Transit Pass</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Travel Class</label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value as TravelClass)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="General">General Class</option>
              <option value="AC">AC Premium</option>
              <option value="Metro Express">Metro Express First</option>
            </select>
          </div>
        </div>

        {/* Payment reference */}
        <div>
          <label className="block font-medium text-zinc-700 mb-1">
            Assigned Payment Record <span className="text-rose-500">*</span>
          </label>
          <select
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          >
            {payments.map((p) => (
              <option key={p.payment_id} value={p.payment_id}>
                {p.payment_id}: ${p.amount.toFixed(2)} via {p.mode} ({p.txn_reference_no})
              </option>
            ))}
          </select>
          {errors.paymentId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.paymentId}</p>}
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
            {isEditing ? 'Update Ticket' : 'Issue Ticket'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
