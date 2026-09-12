import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Passenger, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { PassengerModal } from './PassengerModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Badge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, PhoneIcon } from '../common/Icons';

export const PassengerList: React.FC = () => {
  const { passengers, addPassenger, updatePassenger, deletePassenger, globalSearch } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Passenger | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingPassenger(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (passenger: Passenger) => {
    setEditingPassenger(passenger);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (passenger: Passenger) => {
    setDeleteTarget(passenger);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deletePassenger(deleteTarget.passenger_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (passenger: Passenger) => {
    if (editingPassenger) {
      updatePassenger(passenger);
    } else {
      addPassenger(passenger);
    }
  };

  const columns: ColumnDef<Passenger>[] = [
    {
      key: 'passenger_id',
      header: 'ID',
      width: '90px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.passenger_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Passenger Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-zinc-900">
            {row.first_name} {row.last_name}
          </div>
          <div className="text-[11px] text-zinc-400 font-normal">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      width: '80px',
      render: (row) => (
        <Badge variant={row.gender === 'F' ? 'info' : row.gender === 'M' ? 'neutral' : 'warning'}>
          {row.gender}
        </Badge>
      ),
    },
    {
      key: 'dob',
      header: 'Date of Birth',
      width: '110px',
      render: (row) => <span className="text-zinc-600 font-mono text-[11px]">{row.dob}</span>,
    },
    {
      key: 'address',
      header: 'Address',
      render: (row) => (
        <div className="text-zinc-600 text-xs max-w-xs truncate" title={`${row.door_no}, ${row.street}, ${row.city}, ${row.state} - ${row.pin}`}>
          {row.door_no}, {row.street}, <span className="font-medium text-zinc-700">{row.city}</span> ({row.pin})
        </div>
      ),
    },
    {
      key: 'phone_numbers',
      header: 'Contacts (Multivalued)',
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-1 items-center">
          {row.phone_numbers && row.phone_numbers.length > 0 ? (
            row.phone_numbers.map((phone, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 font-mono text-[11px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200"
              >
                <PhoneIcon size={11} className="text-zinc-400" />
                {phone}
              </span>
            ))
          ) : (
            <span className="text-zinc-400 text-xs italic">No contacts</span>
          )}
        </div>
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
            title="Edit Passenger"
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
            title="Delete Passenger"
            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Module Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Passenger Directory</h2>
          <p className="text-xs text-zinc-500">
            Manage passenger master records, demographics, and multivalued contact phone numbers
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Add Passenger
        </button>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={passengers}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter by name, email, city, or phone..."
        initialSortField="passenger_id"
        initialSortOrder="asc"
        emptyMessage="No passenger records match the criteria"
      />

      {/* Add / Edit Form Modal */}
      <PassengerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialPassenger={editingPassenger}
        existingIds={passengers.map((p) => p.passenger_id)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Passenger Record"
        message={`Are you sure you want to delete passenger ${deleteTarget?.passenger_id} (${deleteTarget?.first_name} ${deleteTarget?.last_name})? This will also remove their associated multivalued contact records.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
