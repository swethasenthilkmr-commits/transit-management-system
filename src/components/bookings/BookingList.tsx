import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Booking, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { BookingModal } from './BookingModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StatusBadge, RouteTypeBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, TicketIcon } from '../common/Icons';

export const BookingList: React.FC = () => {
  const {
    bookings,
    passengers,
    trips,
    routes,
    addBooking,
    updateBooking,
    deleteBooking,
    globalSearch,
    setActiveTab,
  } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (booking: Booking) => {
    setDeleteTarget(booking);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteBooking(deleteTarget.booking_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (booking: Booking) => {
    if (editingBooking) {
      updateBooking(booking);
    } else {
      addBooking(booking);
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      key: 'booking_id',
      header: 'Booking ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.booking_id}
        </span>
      ),
    },
    {
      key: 'passenger',
      header: 'Passenger (M:N)',
      render: (row) => {
        const p = passengers.find((item) => item.passenger_id === row.passenger_id);
        if (!p) return <span className="text-zinc-400">{row.passenger_id}</span>;
        return (
          <div>
            <div className="font-semibold text-zinc-900">
              {p.first_name} {p.last_name}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">{p.passenger_id} · {p.email}</div>
          </div>
        );
      },
    },
    {
      key: 'trip',
      header: 'Trip & Route',
      render: (row) => {
        const t = trips.find((item) => item.trip_id === row.trip_id);
        if (!t) return <span className="text-zinc-400">{row.trip_id}</span>;
        const r = routes.find((item) => item.route_id === t.route_id);
        return (
          <div>
            <div className="flex items-center gap-1.5 font-medium text-zinc-800">
              {r && <RouteTypeBadge type={r.type} />}
              <span>{r?.name || t.route_id}</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Trip <span className="font-mono font-semibold">{t.trip_id}</span> ({t.start_time}-{t.end_time})
            </div>
          </div>
        );
      },
    },
    {
      key: 'seat_number',
      header: 'Seat No',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-xs bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded border border-zinc-200">
          {row.seat_number}
        </span>
      ),
    },
    {
      key: 'booking_date',
      header: 'Booking Date',
      width: '110px',
      render: (row) => <span className="text-zinc-500 font-mono text-[11px]">{row.booking_date}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      width: '120px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('tickets');
            }}
            title="Go to Tickets"
            className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <TicketIcon size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row);
            }}
            title="Edit Booking"
            className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <EditIcon size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePromptDelete(row);
            }}
            title="Delete Booking"
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Passenger Bookings (M:N)</h2>
          <p className="text-xs text-zinc-500">
            Passenger reservations, seat assignments, and scheduled trip manifests
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> New Booking
        </button>
      </div>

      <DataTable
        data={bookings}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter bookings by ID, passenger, trip, seat..."
        initialSortField="booking_id"
        initialSortOrder="asc"
        emptyMessage="No bookings recorded"
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialBooking={editingBooking}
        existingIds={bookings.map((b) => b.booking_id)}
        passengers={passengers}
        trips={trips}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Booking Record"
        message={`Are you sure you want to delete booking ${deleteTarget?.booking_id}? Any tickets linked to this booking will need to be re-referenced.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
