import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { VehicleType, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { VehicleTypeModal } from './VehicleTypeModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FuelBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, TagIcon } from '../common/Icons';

export const VehicleTypeList: React.FC = () => {
  const {
    vehicleTypes,
    vehicles,
    addVehicleType,
    updateVehicleType,
    deleteVehicleType,
    globalSearch,
  } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<VehicleType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: VehicleType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (type: VehicleType) => {
    setDeleteTarget(type);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteVehicleType(deleteTarget.type_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (type: VehicleType) => {
    if (editingType) {
      updateVehicleType(type);
    } else {
      addVehicleType(type);
    }
  };

  const columns: ColumnDef<VehicleType>[] = [
    {
      key: 'type_id',
      header: 'Type ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.type_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Vehicle Model / Class',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
            <TagIcon size={13} />
          </div>
          <span className="font-semibold text-zinc-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Seating Capacity',
      align: 'right',
      width: '140px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-800">
          {row.capacity} <span className="text-zinc-400 font-normal text-[11px]">Passengers</span>
        </span>
      ),
    },
    {
      key: 'fuel_type',
      header: 'Propulsion / Fuel',
      width: '130px',
      render: (row) => <FuelBadge fuel={row.fuel_type} />,
    },
    {
      key: 'active_vehicles',
      header: 'Fleet Count',
      sortable: false,
      render: (row) => {
        const count = vehicles.filter((v) => v.type_id === row.type_id).length;
        return (
          <span className="text-xs text-zinc-600">
            <span className="font-bold text-zinc-900 font-mono">{count}</span> vehicle{count === 1 ? '' : 's'} registered
          </span>
        );
      },
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
            title="Edit Type"
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
            title="Delete Type"
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
          <h2 className="text-sm font-bold text-zinc-900">Vehicle Types & Specs</h2>
          <p className="text-xs text-zinc-500">
            Passenger capacity thresholds, fuel systems, and vehicle classifications
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Add Vehicle Type
        </button>
      </div>

      <DataTable
        data={vehicleTypes}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter vehicle types by ID, model, fuel..."
        initialSortField="type_id"
        initialSortOrder="asc"
        emptyMessage="No vehicle types configured"
      />

      <VehicleTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialType={editingType}
        existingIds={vehicleTypes.map((vt) => vt.type_id)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle Type"
        message={`Are you sure you want to delete vehicle type ${deleteTarget?.type_id} (${deleteTarget?.name})?`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
