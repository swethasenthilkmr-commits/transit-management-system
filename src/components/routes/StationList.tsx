import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Station, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { StationModal } from './StationModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { RouteTypeBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, StationIcon } from '../common/Icons';

export const StationList: React.FC = () => {
  const { stations, routes, routeStations, addStation, updateStation, deleteStation, globalSearch } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Station | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (station: Station) => {
    setEditingStation(station);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (station: Station) => {
    setDeleteTarget(station);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteStation(deleteTarget.station_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (station: Station) => {
    if (editingStation) {
      updateStation(station);
    } else {
      addStation(station);
    }
  };

  const columns: ColumnDef<Station>[] = [
    {
      key: 'station_id',
      header: 'Station ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.station_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Station Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
            <StationIcon size={13} />
          </div>
          <span className="font-semibold text-zinc-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      width: '110px',
      render: (row) => <span className="text-zinc-700">{row.city}</span>,
    },
    {
      key: 'area',
      header: 'Area / Sector',
      render: (row) => <span className="text-zinc-600">{row.area}</span>,
    },
    {
      key: 'landmark',
      header: 'Landmark',
      render: (row) => (
        <span className="text-zinc-500 italic text-xs">{row.landmark}</span>
      ),
    },
    {
      key: 'connected_routes',
      header: 'Serving Routes',
      sortable: false,
      render: (row) => {
        const matchingRoutes = routeStations
          .filter((rs) => rs.station_id === row.station_id)
          .map((rs) => routes.find((r) => r.route_id === rs.route_id))
          .filter(Boolean);

        return (
          <div className="flex flex-wrap gap-1">
            {matchingRoutes.length > 0 ? (
              matchingRoutes.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                >
                  <RouteTypeBadge type={r!.type} />
                  <span>{r!.route_id}</span>
                </span>
              ))
            ) : (
              <span className="text-zinc-400 text-[11px] italic">Not mapped</span>
            )}
          </div>
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
            title="Edit Station"
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
            title="Delete Station"
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
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Station Directory</h2>
          <p className="text-xs text-zinc-500">
            Transit hubs, metro terminals, roadside bus stands, and landmarks
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Add Station
        </button>
      </div>

      {/* Table */}
      <DataTable
        data={stations}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter stations by ID, name, city, or area..."
        initialSortField="station_id"
        initialSortOrder="asc"
        emptyMessage="No stations found"
      />

      {/* Add/Edit Modal */}
      <StationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialStation={editingStation}
        existingIds={stations.map((s) => s.station_id)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Station Record"
        message={`Are you sure you want to delete station ${deleteTarget?.station_id} (${deleteTarget?.name})? It will be automatically removed from any assigned route sequences.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
