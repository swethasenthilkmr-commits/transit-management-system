import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Vehicle, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { VehicleModal } from './VehicleModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FuelBadge, Badge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, VehicleIcon, DriverIcon } from '../common/Icons';

export const VehicleList: React.FC = () => {
  const {
    vehicles,
    vehicleTypes,
    drivers,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    globalSearch,
  } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (vehicle: Vehicle) => {
    setDeleteTarget(vehicle);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteVehicle(deleteTarget.vehicle_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (vehicle: Vehicle) => {
    if (editingVehicle) {
      updateVehicle(vehicle);
    } else {
      addVehicle(vehicle);
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      key: 'vehicle_id',
      header: 'Vehicle ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.vehicle_id}
        </span>
      ),
    },
    {
      key: 'registration_no',
      header: 'Registration No',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
            <VehicleIcon size={13} />
          </div>
          <span className="font-mono font-bold text-zinc-900 tracking-wide">
            {row.registration_no}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Vehicle Type & Capacity',
      render: (row) => {
        const vt = vehicleTypes.find((t) => t.type_id === row.type_id);
        if (!vt) return <span className="text-zinc-400">Unknown ({row.type_id})</span>;
        return (
          <div>
            <div className="font-semibold text-zinc-800">{vt.name}</div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span>{vt.capacity} Pax</span>
              <span>·</span>
              <FuelBadge fuel={vt.fuel_type} />
            </div>
          </div>
        );
      },
    },
    {
      key: 'color',
      header: 'Color',
      width: '120px',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-zinc-700">
          <span
            className="w-2.5 h-2.5 rounded-full border border-zinc-300"
            style={{
              backgroundColor:
                row.color.toLowerCase().includes('blue')
                  ? '#3b82f6'
                  : row.color.toLowerCase().includes('green')
                  ? '#10b981'
                  : row.color.toLowerCase().includes('silver')
                  ? '#94a3b8'
                  : row.color.toLowerCase().includes('white')
                  ? '#f8fafc'
                  : '#71717a',
            }}
          />
          {row.color}
        </span>
      ),
    },
    {
      key: 'driver_id',
      header: 'Assigned Driver (1:1)',
      render: (row) => {
        const driver = drivers.find((d) => d.driver_id === row.driver_id);
        if (driver) {
          return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-900 border border-zinc-200">
              <DriverIcon size={13} className="text-blue-600" />
              <span className="font-medium">{driver.name}</span>
              <span className="font-mono text-[10px] text-zinc-400">({driver.driver_id})</span>
            </div>
          );
        }
        return (
          <Badge variant="warning">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Unassigned (Pool)
          </Badge>
        );
      },
    },
    {
      key: 'manufacture_date',
      header: 'Mfg Date',
      width: '110px',
      render: (row) => (
        <span className="text-zinc-500 font-mono text-[11px]">{row.manufacture_date}</span>
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
            title="Edit Vehicle"
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
            title="Delete Vehicle"
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
          <h2 className="text-sm font-bold text-zinc-900">Vehicle Fleet Registry</h2>
          <p className="text-xs text-zinc-500">
            Active rolling stock, license plates, passenger capacities, and 1:1 dedicated drivers
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Add Vehicle
        </button>
      </div>

      <DataTable
        data={vehicles}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter vehicles by ID, plate, color, driver..."
        initialSortField="vehicle_id"
        initialSortOrder="asc"
        emptyMessage="No vehicles registered in the fleet"
      />

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialVehicle={editingVehicle}
        existingIds={vehicles.map((v) => v.vehicle_id)}
        vehicleTypes={vehicleTypes}
        drivers={drivers}
        allVehicles={vehicles}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle Record"
        message={`Are you sure you want to delete vehicle ${deleteTarget?.vehicle_id} (${deleteTarget?.registration_no}) from the fleet?`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
