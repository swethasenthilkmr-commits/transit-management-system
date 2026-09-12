# TransitFlow - Public Bus & Metro Transit Management System (Front-End)

A modern, minimalist, responsive Front-End Management System built for **Public Bus and Metro Transit Operations**.

Designed with **Inter typography, soft gray/zinc backgrounds, subtle 1px borders, and high-contrast action elements**. All operations are driven by modular local state with `localStorage` persistence and exportable TypeScript models ready for backend API attachment.

---

## Quick Start (Running on Windows)

Open **PowerShell** or **Command Prompt** in this folder:

```powershell
# 1. Navigate to the project folder
cd "C:\Users\Dhaksha B\.gemini\antigravity\scratch\transit-management-system"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The system will start at `http://localhost:3000` (or `5173`) with full interactive mock data seeded.

---

## Architectural Breakdown & Core Modules

### 1. Passenger Management
- **Main Entity Table & Form**: `Passenger ID`, `First Name`, `Last Name`, `Email`, `Gender` (`M` / `F` / `Other`), `DOB`, `Door No`, `Street`, `City`, `State`, `PIN`.
- **Contact Sub-Entity (`PASSENGER_CONTACT`)**: Multivalued phone numbers with dynamic tag add/remove controls.
- **Search & Filter**: Search by full name, email, city, PIN, or any linked phone number.

### 2. Route & Network Management
- **Routes**: `Route ID`, `Name`, `Type` (Bus / Metro dropdown), `Total Distance` (km, numeric validation).
- **Stations**: `Station ID`, `Station Name`, `City`, `Area`, `Landmark`.
- **Route Stations (M:N Mapping)**: Interactive modal allowing dispatchers to assign stations to routes with configurable **Stop Order** (Move Up / Down, Append Stop, Distance from start).

### 3. Fleet & Driver Management
- **Vehicle Types**: `Type ID`, `Name`, `Capacity` (pax threshold), `Fuel Type` (`Diesel`, `Electric`, `CNG`, `Hybrid`).
- **Drivers**: `Driver ID`, `Name`, `License No`, `DOB`, and Multivalued Contact Numbers.
- **Vehicles**: `Vehicle ID`, `Registration No`, `Manufacture Date`, `Color`, `Type Selector`, and **Assigned Driver Selector** with **1:1 Constraint visual alerts** (indicates if a driver is currently assigned elsewhere).

### 4. Trip Scheduling & Stops
- **Trips**: `Trip ID`, `Date`, `Start Time`, `End Time`, `Assigned Route`, `Assigned Vehicle`, `Status`.
- **Trip Stops (Weak Entity)**: Visual step-by-step progress timeline displaying each station stop with Arrival & Departure times, origin/terminal markers, inline time editing, and a "Sync From Route Pattern" one-click distributor.

### 5. Bookings, Tickets & Payments
- **Bookings (Passenger M:N Trip)**: Reservation modal linking Passenger, Scheduled Trip, Seat Number, and Date.
- **Payments**: `Payment ID`, `Mode` (`UPI`, `Card`, `Cash`, `NetBanking`), `Amount`, `Date`, `Txn Reference No`, `Status`.
- **Tickets**: `Ticket ID`, Passenger & Trip selection (linked to Booking), `Issue Date`, `Ticket Type` (`Regular`, `Daily Pass`, `Weekly Pass`, `Monthly Pass`), `Travel Class` (`General`, `AC`, `Metro Express`), and `Payment ID`.
- **Digital Boarding Pass**: Printable/downloadable pass view with QR code mock, seat number, route branding, and payment reference.

---

## Seed Data Preloaded

- **Passengers**:
  - `P001`: Anu Kumar, `anu@gmail.com`, F, `2007-06-09`, 12 Anna St, Chennai, TN, 600001 (Phone: `9876543210`)
  - `P002`: Arun Raj, `arun@gmail.com`, M, `2006-03-15`, 24 MG Road, Chennai, TN, 600002 (Phones: `9876543211`, `9840112233`)
  - `P003`: Kavitha Venkatesh, `kavitha.v@gmail.com`, F, `1998-11-04`, Chennai, TN (Phone: `9444123456`)
  - `P004`: David Wilson, `david.wilson@corp.com`, M, `1992-04-20`, Chennai, TN (Phone: `9940567890`)
- **Routes**:
  - `R001`: Chennai Central Bus Line, Bus, 15.00 km
  - `R003`: Airport Express Metro, Metro, 20.00 km
  - `R002`: Tambaram - Koyambedu Express, Bus, 28.50 km
  - `R004`: Blue Line Metro Corridor, Metro, 32.00 km
- **Stations**:
  - `S001`: Chennai Central, Chennai, Central, Railway Station
  - `S003`: Chennai International Airport, Chennai, Meenambakkam, Airport
  - `S002`: Guindy Junction, Chennai, Guindy, Kathipara Cloverleaf
  - `S004`: Koyambedu Inter-State, Chennai, CMBT Terminus
  - `S005`: T. Nagar Hub, Chennai, Panagal Park Circle
- **Vehicles & Drivers**:
  - `VT01`: City Bus Standard, Capacity: 40, Diesel
  - `VT02`: Metro Train 4-Car Formation, Capacity: 240, Electric
  - `D001`: Ravi Kumar, DL1001, DOB: `1985-02-10`, Contacts: [`9840123456`, `9840123457`]
  - `D002`: Priya Sundaram, DL1002, DOB: `1990-11-22`, Contacts: [`9840998877`]
  - `V001`: TN01AB1234, Color: Ocean Blue, Type: VT01, Driver: D001 (1:1 assigned)
  - `V002`: METRO-EXP-01, Color: Silver & Indigo, Type: VT02, Driver: D002 (1:1 assigned)
- **Trips & Bookings**:
  - `T001`: `2026-08-20`, 08:00 to 08:45, Route: R001, Vehicle: V001
  - `Booking B001`: Passenger P001, Trip T001, Seat A01, Date: 2026-08-20
  - `Payment PAY001`: Mode: UPI, Amount: $40.00, Date: 2026-08-18, Ref: TXN98765432
  - `Ticket TK001`: Passenger P001, Trip T001, Booking B001, Issue: 2026-08-18, Type: Regular, Class: General, Payment PAY001

---

## Global Features & Operational Controls

1. **Global Search**: Search bar in the top navigation filters across active entity records in real time.
2. **Reset Seed State**: "Reset Data" button in header restores initial mock seed data and clears local modifications.
3. **JSON Export**: "Export" button in header downloads the entire system state as a clean `.json` backup.
4. **Delete Safety**: Every delete operation across all 11 entities triggers an explicit confirmation dialog before modifying state.
5. **Connecting to a Real Backend**:
   All entities are typed in `src/types/transit.ts`. Replace the state handlers in `src/context/TransitContext.tsx` with standard `fetch()` or `axios` calls to your REST / GraphQL backend.
