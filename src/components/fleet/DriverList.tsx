import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Driver, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { DriverModal } from './DriverModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Badge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, PhoneIcon, DriverIcon, VehicleIcon } from '../common/Icons';

export const DriverList: React.FC = () => {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver, globalSearch } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (driver: Driver) => {
    setDeleteTarget(driver);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDriver(deleteTarget.driver_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (driver: Driver) => {
    if (editingDriver) {
      updateDriver(driver);
    } else {
      addDriver(driver);
    }
  };

  const columns: ColumnDef<Driver>[] = [
    {
      key: 'driver_id',
      header: 'Driver ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.driver_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Driver Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
            <DriverIcon size={13} />
          </div>
          <span className="font-semibold text-zinc-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'license_no',
      header: 'Commercial License',
      width: '140px',
      render: (row) => (
        <span className="font-mono font-semibold text-zinc-800 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[11px]">
          {row.license_no}
        </span>
      ),
    },
    {
      key: 'dob',
      header: 'DOB',
      width: '110px',
      render: (row) => (
        <span className="text-zinc-500 font-mono text-[11px]">{row.dob}</span>
      ),
    },
    {
      key: 'assigned_vehicle',
      header: 'Current Assignment (1:1)',
      render: (row) => {
        const assignedVehicle = vehicles.find((v) => v.driver_id === row.driver_id);
        if (assignedVehicle) {
          return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200/60 font-medium text-xs">
              <VehicleIcon size={13} className="text-blue-600" />
              <span>{assignedVehicle.registration_no}</span>
              <span className="font-mono text-[10px] text-blue-500">({assignedVehicle.vehicle_id})</span>
            </div>
          );
        }
        return (
          <Badge variant="neutral">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Standby / Unassigned
          </Badge>
        );
      },
    },
    {
      key: 'phone_numbers',
      header: 'Contact Numbers (Multivalued)',
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.phone_numbers && row.phone_numbers.length > 0 ? (
            row.phone_numbers.map((phone, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-mono bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200"
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
            title="Edit Driver"
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
            title="Delete Driver"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Commercial Drivers</h2>
          <p className="text-xs text-zinc-500">
            Certified transit operators, license credentials, and dedicated vehicle assignments
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Add Driver
        </button>
      </div>

      <DataTable
        data={drivers}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter drivers by name, ID, license, or phone..."
        initialSortField="driver_id"
        initialSortOrder="asc"
        emptyMessage="No drivers registered"
      />

      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialDriver={editingDriver}
        existingIds={drivers.map((d) => d.driver_id)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Driver Record"
        message={`Are you sure you want to delete driver ${deleteTarget?.driver_id} (${deleteTarget?.name})? If they are currently assigned to a vehicle, that vehicle will become unassigned.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
