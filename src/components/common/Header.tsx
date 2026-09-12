import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { SearchIcon, RefreshIcon, DownloadIcon, MenuIcon, PlusIcon } from './Icons';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenQuickAdd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenQuickAdd }) => {
  const { globalSearch, setGlobalSearch, resetData, exportJSON, activeTab } = useTransit();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Transit System Overview';
      case 'passengers':
        return 'Passenger Management';
      case 'routes':
        return 'Transit Routes';
      case 'stations':
        return 'Station Directory';
      case 'fleet-vehicles':
        return 'Vehicle Fleet';
      case 'fleet-drivers':
        return 'Transit Drivers';
      case 'fleet-types':
        return 'Vehicle Types & Specs';
      case 'trips':
        return 'Trip Schedules & Timeline';
      case 'bookings':
        return 'Passenger Bookings';
      case 'tickets':
        return 'Ticket Issuance & Passes';
      case 'payments':
        return 'Payment Transactions';
      default:
        return 'Transit Management';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile menu toggle + Active section title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon size={20} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-zinc-900 leading-tight">
              {getTabTitle()}
            </h1>
            <p className="hidden sm:block text-[11px] text-zinc-400 font-medium">
              Public Bus & Metro Relational Management System
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <SearchIcon size={16} />
            </span>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Global Search (Name, ID, Route, Registration, Phone)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-zinc-100/80 border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenQuickAdd && (
            <button
              type="button"
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
            >
              <PlusIcon size={14} />
              <span className="hidden sm:inline">Add Record</span>
            </button>
          )}

          <button
            type="button"
            onClick={exportJSON}
            title="Export full data state as JSON"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <DownloadIcon size={14} />
            <span className="hidden lg:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            title="Reset database to initial seed mock data"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
          >
            <RefreshIcon size={14} />
            <span className="hidden lg:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation for Seed Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-zinc-200 shadow-xl space-y-3">
            <h4 className="text-sm font-semibold text-zinc-900">Reset to Initial Seed Mock Data?</h4>
            <p className="text-xs text-zinc-500">
              This will restore all default seed records (P001, P002, R001, R003, S001, VT01, D001, etc.) and clear custom changes in localStorage.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
