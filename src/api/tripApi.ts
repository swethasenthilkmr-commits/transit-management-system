import { Trip } from "../types/transit";

const API_URL = "http://localhost:8081/api/trips";

interface ApiTrip {
  TRIP_ID: string;
  TRIP_DATE: string;
  START_TIME: string;
  END_TIME: string;
  ROUTE_ID: string;
}

const mapTrip = (row: ApiTrip): Trip => ({
  trip_id: row.TRIP_ID ?? "",
  date: (row.TRIP_DATE ?? "").toString().slice(0, 10),
  start_time: row.START_TIME ?? "",
  end_time: row.END_TIME ?? "",
  route_id: row.ROUTE_ID ?? "",
});

async function checkResponse(res: Response, action: string) {
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${action} failed (${res.status}): ${detail}`);
  }
}

export const getTrips = async (): Promise<Trip[]> => {
  const res = await fetch(API_URL);
  await checkResponse(res, "Loading trips");

  const rows: ApiTrip[] = await res.json();
  return rows.map(mapTrip);
};

const toApiBody = (trip: Trip) => ({
  trip_id: trip.trip_id,
  trip_date: trip.date,
  start_time: trip.start_time,
  end_time: trip.end_time,
  route_id: trip.route_id,
});

export const addTripApi = async (trip: Trip) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiBody(trip)),
  });

  await checkResponse(res, "Adding trip");
};

export const updateTripApi = async (trip: Trip) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(trip.trip_id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiBody(trip)),
    }
  );

  await checkResponse(res, "Updating trip");
};

export const deleteTripApi = async (id: string) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );

  await checkResponse(res, "Deleting trip");
};