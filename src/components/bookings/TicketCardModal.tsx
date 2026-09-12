import React from 'react';
import { Ticket, Passenger, Trip, Route, Payment, Booking } from '../../types/transit';
import { Modal } from '../common/Modal';
import { RouteTypeBadge, TravelClassBadge } from '../common/Badge';
import { QrCodeIcon, BusIcon, MetroIcon, DownloadIcon } from '../common/Icons';

interface TicketCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  passenger?: Passenger;
  trip?: Trip;
  route?: Route;
  payment?: Payment;
  booking?: Booking;
}

export const TicketCardModal: React.FC<TicketCardModalProps> = ({
  isOpen,
  onClose,
  ticket,
  passenger,
  trip,
  route,
  payment,
  booking,
}) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Transit Pass" maxWidth="md">
      <div className="space-y-4">
        {/* Boarding Pass Container */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl p-5 shadow-xl border border-zinc-700 relative overflow-hidden">
          {/* Top Pass Header */}
          <div className="flex items-center justify-between border-b border-zinc-700/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
                {route?.type === 'Metro' ? <MetroIcon size={16} /> : <BusIcon size={16} />}
              </div>
              <div>
                <span className="font-bold text-xs tracking-wider">TRANSITFLOW PASS</span>
                <span className="block text-[9px] text-zinc-400">OFFICIAL TRANSIT PASSENGER TICKET</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-blue-400">{ticket.ticket_id}</span>
              <span className="block text-[9px] text-zinc-400">Issued: {ticket.issue_date}</span>
            </div>
          </div>

          {/* Passenger and Route row */}
          <div className="py-4 space-y-3">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Passenger</span>
              <span className="text-sm font-bold text-white">
                {passenger ? `${passenger.first_name} ${passenger.last_name}` : ticket.passenger_id}
              </span>
              <span className="block text-[11px] text-zinc-400">{passenger?.email}</span>
            </div>

            <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Corridor / Route</span>
                <span className="text-xs font-semibold text-zinc-100">{route?.name || 'Central Corridor'}</span>
                <div className="mt-1 flex items-center gap-1.5">
                  {route && <RouteTypeBadge type={route.type} />}
                  <TravelClassBadge travelClass={ticket.travel_class} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Seat</span>
                <span className="text-lg font-mono font-extrabold text-white">
                  {booking?.seat_number || 'A01'}
                </span>
              </div>
            </div>

            {/* Schedule & Times */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-700/50">
                <span className="text-[9px] text-zinc-400 block uppercase">Travel Date</span>
                <span className="font-mono font-semibold">{trip?.date || ticket.issue_date}</span>
              </div>
              <div className="bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-700/50">
                <span className="text-[9px] text-zinc-400 block uppercase">Time Slot</span>
                <span className="font-mono font-semibold">
                  {trip?.start_time} - {trip?.end_time}
                </span>
              </div>
            </div>

            {/* Fare and Payment Info */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-400 block">Payment Mode: {payment?.mode || 'UPI'}</span>
                <span className="font-mono text-[10px] text-zinc-400">Ref: {payment?.txn_reference_no || 'TXN-OK'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">Total Fare</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ${payment ? payment.amount.toFixed(2) : '40.00'}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Barcode Representation */}
          <div className="pt-3 border-t border-dashed border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <QrCodeIcon size={36} className="text-white" />
              <div>
                <span className="font-mono text-[10px] block text-zinc-300">VALID PASSENGER TICKET</span>
                <span className="font-mono text-[9px] text-zinc-400">Scan at automated fare gate</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
              {ticket.ticket_type}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 shadow-xs"
          >
            <DownloadIcon size={14} /> Print / Save Pass
          </button>
        </div>
      </div>
    </Modal>
  );
};
