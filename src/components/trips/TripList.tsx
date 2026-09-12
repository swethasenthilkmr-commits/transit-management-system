import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Trip, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { TripModal } from './TripModal';
import { TripStopsModal } from './TripStopsModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StatusBadge, RouteTypeBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, TimelineIcon, VehicleIcon } from '../common/Icons';

export const TripList: React.FC = () => {
  const {
    trips,
    routes,
    vehicles,
    stations,
    getStationsForRoute,
    getStopsForTrip,
    saveTripStops,
    addTrip,
    updateTrip,
    deleteTrip,
    globalSearch,
  } = useTransit();

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedTripForStops, setSelectedTripForStops] = useState<Trip | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingTrip(null);
    setIsTripModalOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setIsTripModalOpen(true);
  };

  const handleOpenStops = (trip: Trip) => {
    setSelectedTripForStops(trip);
    setIsStopsModalOpen(true);
  };

  const handlePromptDelete = (trip: Trip) => {
    setDeleteTarget(trip);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTrip(deleteTarget.trip_id);
      setDeleteTarget(null);
    }
  };

  const handleSaveTrip = (trip: Trip) => {
    if (editingTrip) {
      updateTrip(trip);
    } else {
      addTrip(trip);
    }
  };

  const columns: ColumnDef<Trip>[] = [
    {
      key: 'trip_id',
      header: 'Trip ID',
      width: '90px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.trip_id}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      width: '105px',
      render: (row) => (
        <span className="font-mono text-[11px] text-zinc-700">{row.date}</span>
      ),
    },
    {
      key: 'route_id',
      header: 'Assigned Route',
      render: (row) => {
        const route = routes.find((r) => r.route_id === row.route_id);
        if (!route) return <span className="text-zinc-400">Route {row.route_id}</span>;
        return (
          <div className="flex items-center gap-2">
            <RouteTypeBadge type={route.type} />
            <span className="font-semibold text-zinc-800">{route.name}</span>
          </div>
        );
      },
    },
    {
      key: 'window',
      header: 'Scheduled Window',
      width: '140px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[11px]">
          {row.start_time} &rarr; {row.end_time}
        </span>
      ),
    },
    {
      key: 'vehicle_id',
      header: 'Assigned Vehicle',
      render: (row) => {
        const vehicle = vehicles.find((v) => v.vehicle_id === row.vehicle_id);
        if (!vehicle) return <span className="text-zinc-400 text-xs italic">Unassigned</span>;
        return (
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-800">
            <VehicleIcon size={12} className="text-zinc-400" />
            <span>{vehicle.registration_no}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (row) => <StatusBadge status={row.status || 'Scheduled'} />,
    },
    {
      key: 'timeline',
      header: 'Weak Entity Stops',
      sortable: false,
      render: (row) => {
        const stops = getStopsForTrip(row.trip_id);
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenStops(row);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            <TimelineIcon size={13} />
            <span>Timeline ({stops.length} Stops)</span>
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
            title="Edit Trip"
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
            title="Delete Trip"
            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  const currentRouteForStops = selectedTripForStops
    ? routes.find((r) => r.route_id === selectedTripForStops.route_id)
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Trip Scheduling & Dispatch</h2>
          <p className="text-xs text-zinc-500">
            Timetable runs, vehicle dispatches, operational status, and weak entity station stops
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusIcon size={14} /> Schedule Trip
        </button>
      </div>

      <DataTable
        data={trips}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter trips by ID, date, route, vehicle..."
        initialSortField="trip_id"
        initialSortOrder="asc"
        emptyMessage="No trips currently scheduled"
      />

      {/* Add / Edit Trip Modal */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTrip}
        initialTrip={editingTrip}
        existingIds={trips.map((t) => t.trip_id)}
        routes={routes}
        vehicles={vehicles}
      />

      {/* Weak Entity Stops Visual Timeline Modal */}
      <TripStopsModal
        isOpen={isStopsModalOpen}
        onClose={() => setIsStopsModalOpen(false)}
        trip={selectedTripForStops}
        route={currentRouteForStops}
        allStations={stations}
        routeStations={
          selectedTripForStops ? getStationsForRoute(selectedTripForStops.route_id) : []
        }
        initialStops={selectedTripForStops ? getStopsForTrip(selectedTripForStops.trip_id) : []}
        onSaveStops={saveTripStops}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Scheduled Trip"
        message={`Are you sure you want to delete trip ${deleteTarget?.trip_id}? All associated weak entity trip stop timelines will also be removed.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
