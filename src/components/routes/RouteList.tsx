import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Route, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { RouteModal } from './RouteModal';
import { RouteStationsModal } from './RouteStationsModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { RouteTypeBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, StationIcon } from '../common/Icons';

export const RouteList: React.FC = () => {
  const {
    routes,
    stations,
    addRoute,
    updateRoute,
    deleteRoute,
    getStationsForRoute,
    saveRouteStations,
    globalSearch,
  } = useTransit();

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedRouteForStops, setSelectedRouteForStops] = useState<Route | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Route | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setIsRouteModalOpen(true);
  };

  const handleOpenEdit = (route: Route) => {
    setEditingRoute(route);
    setIsRouteModalOpen(true);
  };

  const handleOpenStops = (route: Route) => {
    setSelectedRouteForStops(route);
    setIsStopsModalOpen(true);
  };

  const handlePromptDelete = (route: Route) => {
    setDeleteTarget(route);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteRoute(deleteTarget.route_id);
      setDeleteTarget(null);
    }
  };

  const handleSaveRoute = (route: Route) => {
    if (editingRoute) {
      updateRoute(route);
    } else {
      addRoute(route);
    }
  };

  const columns: ColumnDef<Route>[] = [
    {
      key: 'route_id',
      header: 'Route ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.route_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Route Name',
      render: (row) => (
        <div className="font-semibold text-zinc-900">
          {row.name}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Transit Type',
      width: '120px',
      render: (row) => <RouteTypeBadge type={row.type} />,
    },
    {
      key: 'total_distance',
      header: 'Distance (km)',
      align: 'right',
      width: '130px',
      render: (row) => (
        <span className="font-mono font-semibold text-zinc-800">
          {row.total_distance.toFixed(2)} km
        </span>
      ),
    },
    {
      key: 'stops_count',
      header: 'Assigned Stops (M:N)',
      sortable: false,
      render: (row) => {
        const stops = getStationsForRoute(row.route_id);
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenStops(row);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <StationIcon size={13} />
            <span>{stops.length} Stations (Order & Stops)</span>
          </button>
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
            title="Edit Route"
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
            title="Delete Route"
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
          <h2 className="text-sm font-bold text-zinc-900">Transit Routes</h2>
          <p className="text-xs text-zinc-500">
            Define bus lines and metro corridors, track distances, and manage station stop sequences
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Add Route
        </button>
      </div>

      {/* Table */}
      <DataTable
        data={routes}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter routes by ID, name, or type..."
        initialSortField="route_id"
        initialSortOrder="asc"
        emptyMessage="No routes found"
      />

      {/* Add/Edit Modal */}
      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSave={handleSaveRoute}
        initialRoute={editingRoute}
        existingIds={routes.map((r) => r.route_id)}
      />

      {/* M:N Station Ordering Modal */}
      <RouteStationsModal
        isOpen={isStopsModalOpen}
        onClose={() => setIsStopsModalOpen(false)}
        route={selectedRouteForStops}
        allStations={stations}
        initialAssigned={selectedRouteForStops ? getStationsForRoute(selectedRouteForStops.route_id) : []}
        onSave={saveRouteStations}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Route Record"
        message={`Are you sure you want to delete route ${deleteTarget?.route_id} (${deleteTarget?.name})? All station stop mappings for this route will also be removed.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
