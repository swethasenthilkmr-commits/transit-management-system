import { Booking, Passenger, Trip } from "../types/transit";

const API_URL = "http://localhost:8081/api/bookings";

interface ApiBooking {
  PASSENGER_ID: string | number;
  TRIP_ID: string | number;
  PASSENGER_NAME: string;
  TRIP_DATE: string;
  SEAT_NO: string | number;
  BOOKING_DATE: string;
}

async function checkResponse(res: Response, action: string) {
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${action} failed (${res.status}): ${detail}`);
  }
}

const mapBooking = (row: ApiBooking): Booking => ({
  booking_id: `${row.PASSENGER_ID}_${row.TRIP_ID}`,
  passenger_id: String(row.PASSENGER_ID ?? ""),
  trip_id: String(row.TRIP_ID ?? ""),
  seat_number: String(row.SEAT_NO ?? ""),
  booking_date: String(row.BOOKING_DATE ?? "").slice(0, 10),
  status: "Confirmed" as Booking["status"],
});

export const getBookings = async (): Promise<Booking[]> => {
  const res = await fetch(API_URL);
  await checkResponse(res, "Loading bookings");

  const rows: ApiBooking[] = await res.json();
  return rows.map(mapBooking);
};

function toApiBody(
  booking: Booking,
  passengers: Passenger[],
  trips: Trip[]
) {
  const passenger = passengers.find(
    (p) => p.passenger_id === booking.passenger_id
  );
  const trip = trips.find((t) => t.trip_id === booking.trip_id);

  if (!passenger) {
    throw new Error("Selected passenger was not found.");
  }

  if (!trip) {
    throw new Error("Selected trip was not found.");
  }

  return {
    passenger_id: booking.passenger_id,
    trip_id: booking.trip_id,
    passenger_name: `${passenger.first_name} ${passenger.last_name}`.trim(),
    trip_date: trip.date,
    seat_no: booking.seat_number,
    booking_date: booking.booking_date,
  };
}

export const addBookingApi = async (
  booking: Booking,
  passengers: Passenger[],
  trips: Trip[]
) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiBody(booking, passengers, trips)),
  });

  await checkResponse(res, "Adding booking");
};

export const updateBookingApi = async (
  booking: Booking,
  passengers: Passenger[],
  trips: Trip[]
) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(booking.passenger_id)}/${encodeURIComponent(booking.trip_id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiBody(booking, passengers, trips)),
    }
  );

  await checkResponse(res, "Updating booking");
};

export 
const deleteBookingApi = async (passengerId: string, tripId: string) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(passengerId)}/${encodeURIComponent(tripId)}`,
    { method: "DELETE" }
  );

  await checkResponse(res, "Deleting booking");
};