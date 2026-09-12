import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { ActiveTab } from '../../types/transit';
import {
  DashboardIcon,
  UsersIcon,
  RouteIcon,
  StationIcon,
  VehicleIcon,
  DriverIcon,
  TagIcon,
  TripIcon,
  BookingIcon,
  TicketIcon,
  PaymentIcon,
  BusIcon,
  CloseIcon,
} from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    passengers,
    routes,
    stations,
    vehicles,
    drivers,
    vehicleTypes,
    trips,
    bookings,
    tickets,
    payments,
  } = useTransit();

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <DashboardIcon size={18} />,
        },
      ],
    },
    {
      title: 'PASSENGER MANAGEMENT',
      items: [
        {
          id: 'passengers',
          label: 'Passengers',
          icon: <UsersIcon size={18} />,
          badge: passengers.length,
        },
      ],
    },
    {
      title: 'ROUTE & NETWORK',
      items: [
        {
          id: 'routes',
          label: 'Routes',
          icon: <RouteIcon size={18} />,
          badge: routes.length,
        },
        {
          id: 'stations',
          label: 'Stations',
          icon: <StationIcon size={18} />,
          badge: stations.length,
        },
      ],
    },
    {
      title: 'FLEET & DRIVERS',
      items: [
        {
          id: 'fleet-vehicles',
          label: 'Vehicles',
          icon: <VehicleIcon size={18} />,
          badge: vehicles.length,
        },
        {
          id: 'fleet-drivers',
          label: 'Drivers',
          icon: <DriverIcon size={18} />,
          badge: drivers.length,
        },
        {
          id: 'fleet-types',
          label: 'Vehicle Types',
          icon: <TagIcon size={18} />,
          badge: vehicleTypes.length,
        },
      ],
    },
    {
      title: 'TRIP SCHEDULING',
      items: [
        {
          id: 'trips',
          label: 'Trips & Stops',
          icon: <TripIcon size={18} />,
          badge: trips.length,
        },
      ],
    },
    {
      title: 'BOOKINGS & FARES',
      items: [
        {
          id: 'bookings',
          label: 'Bookings',
          icon: <BookingIcon size={18} />,
          badge: bookings.length,
        },
        {
          id: 'tickets',
          label: 'Tickets',
          icon: <TicketIcon size={18} />,
          badge: tickets.length,
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: <PaymentIcon size={18} />,
          badge: payments.length,
        },
      ],
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/50 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-900 text-zinc-300 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-zinc-800`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <BusIcon size={18} />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                TRANSIT<span className="text-blue-400 font-semibold">FLOW</span>
              </span>
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                Metro & Bus Ops
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-zinc-400'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                            isActive
                              ? 'bg-blue-700/80 text-white'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info pill */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/20 text-center">
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-800/40 text-[11px] text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Frontend Mock State
            </span>
            <span className="font-mono text-[10px] text-zinc-400">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
