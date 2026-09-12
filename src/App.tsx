import React, { useState } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { PassengerList } from './components/passengers/PassengerList';
import { RouteList } from './components/routes/RouteList';
import { StationList } from './components/routes/StationList';
import { VehicleList } from './components/fleet/VehicleList';
import { DriverList } from './components/fleet/DriverList';
import { VehicleTypeList } from './components/fleet/VehicleTypeList';
import { TripList } from './components/trips/TripList';
import { BookingList } from './components/bookings/BookingList';
import { PaymentList } from './components/bookings/PaymentList';
import { TicketList } from './components/bookings/TicketList';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeTab } = useTransit();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'passengers':
        return <PassengerList />;
      case 'routes':
        return <RouteList />;
      case 'stations':
        return <StationList />;
      case 'fleet-vehicles':
        return <VehicleList />;
      case 'fleet-drivers':
        return <DriverList />;
      case 'fleet-types':
        return <VehicleTypeList />;
      case 'trips':
        return <TripList />;
      case 'bookings':
        return <BookingList />;
      case 'payments':
        return <PaymentList />;
      case 'tickets':
        return <TicketList />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-200">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TransitProvider>
      <MainLayout />
    </TransitProvider>
  );
};

export default App;
