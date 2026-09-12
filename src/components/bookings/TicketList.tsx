import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Ticket, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { TicketModal } from './TicketModal';
import { TicketCardModal } from './TicketCardModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TravelClassBadge, Badge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, TicketIcon, QrCodeIcon } from '../common/Icons';

export const TicketList: React.FC = () => {
  const {
    tickets,
    passengers,
    trips,
    routes,
    bookings,
    payments,
    addTicket,
    updateTicket,
    deleteTicket,
    globalSearch,
  } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const [selectedTicketForPass, setSelectedTicketForPass] = useState<Ticket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleOpenPass = (ticket: Ticket) => {
    setSelectedTicketForPass(ticket);
    setIsPassModalOpen(true);
  };

  const handlePromptDelete = (ticket: Ticket) => {
    setDeleteTarget(ticket);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTicket(deleteTarget.ticket_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (ticket: Ticket) => {
    if (editingTicket) {
      updateTicket(ticket);
    } else {
      addTicket(ticket);
    }
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      key: 'ticket_id',
      header: 'Ticket ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.ticket_id}
        </span>
      ),
    },
    {
      key: 'passenger',
      header: 'Passenger',
      render: (row) => {
        const p = passengers.find((item) => item.passenger_id === row.passenger_id);
        if (!p) return <span className="text-zinc-400">{row.passenger_id}</span>;
        return (
          <div>
            <div className="font-semibold text-zinc-900">
              {p.first_name} {p.last_name}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">{p.email}</div>
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
            <span className="font-semibold text-zinc-800">{r?.name || t.route_id}</span>
            <div className="text-[11px] text-zinc-500 font-mono">
              Trip {t.trip_id} ({t.start_time}-{t.end_time})
            </div>
          </div>
        );
      },
    },
    {
      key: 'type_class',
      header: 'Ticket Type & Class',
      render: (row) => (
        <div className="flex flex-col gap-1 items-start">
          <Badge variant="neutral">{row.ticket_type}</Badge>
          <TravelClassBadge travelClass={row.travel_class} />
        </div>
      ),
    },
    {
      key: 'payment_id',
      header: 'Payment Reference',
      render: (row) => {
        const pay = payments.find((p) => p.payment_id === row.payment_id);
        if (!pay) return <span className="font-mono text-zinc-400">{row.payment_id}</span>;
        return (
          <div>
            <div className="font-mono font-bold text-emerald-700 text-xs">
              ${pay.amount.toFixed(2)}{' '}
              <span className="text-[10px] text-zinc-400 font-normal">via {pay.mode}</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-400">{pay.txn_reference_no}</div>
          </div>
        );
      },
    },
    {
      key: 'issue_date',
      header: 'Issue Date',
      width: '105px',
      render: (row) => <span className="text-zinc-500 font-mono text-[11px]">{row.issue_date}</span>,
    },
    {
      key: 'pass_action',
      header: 'Digital Pass',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPass(row);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors border border-zinc-200"
        >
          <QrCodeIcon size={14} className="text-zinc-600" />
          <span>View Pass</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      width: '100px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row);
            }}
            title="Edit Ticket"
            className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <EditIcon size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePromptDelete(row);
            }}
            title="Delete Ticket"
            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  // Resolve references for selected pass modal
  const passPassenger = selectedTicketForPass
    ? passengers.find((p) => p.passenger_id === selectedTicketForPass.passenger_id)
    : undefined;

  const passTrip = selectedTicketForPass
    ? trips.find((t) => t.trip_id === selectedTicketForPass.trip_id)
    : undefined;

  const passRoute = passTrip
    ? routes.find((r) => r.route_id === passTrip.route_id)
    : undefined;

  const passPayment = selectedTicketForPass
    ? payments.find((p) => p.payment_id === selectedTicketForPass.payment_id)
    : undefined;

  const passBooking = selectedTicketForPass
    ? bookings.find((b) => b.booking_id === selectedTicketForPass.booking_id)
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Ticket Issuance & Boarding Passes</h2>
          <p className="text-xs text-zinc-500">
            Validated passenger travel authority linked to trips, seat reservations, and fare settlements
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Issue New Ticket
        </button>
      </div>

      <DataTable
        data={tickets}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter tickets by ID, passenger, trip, type..."
        initialSortField="ticket_id"
        initialSortOrder="asc"
        emptyMessage="No tickets issued"
      />

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialTicket={editingTicket}
        existingIds={tickets.map((t) => t.ticket_id)}
        passengers={passengers}
        trips={trips}
        bookings={bookings}
        payments={payments}
      />

      <TicketCardModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        ticket={selectedTicketForPass}
        passenger={passPassenger}
        trip={passTrip}
        route={passRoute}
        payment={passPayment}
        booking={passBooking}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Ticket Record"
        message={`Are you sure you want to void and delete ticket ${deleteTarget?.ticket_id}?`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
