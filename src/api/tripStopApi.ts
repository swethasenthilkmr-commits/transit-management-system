import { TripStop } from "../types/transit";

const BASE_URL = "http://localhost:8081/api/trips";

export const getTripStops = async (tripId: string): Promise<TripStop[]> => {
  const res = await fetch(`${BASE_URL}/${tripId}/stops`);

  if (!res.ok) {
    throw new Error("Failed to fetch trip stops");
  }

  return res.json();
};

export const saveTripStopsApi = async (
  tripId: string,
  stops: TripStop[]
) => {
  // Remove existing stops first
  const deleteRes = await fetch(`${BASE_URL}/${tripId}/stops`, {
    method: "DELETE",
  });

  if (!deleteRes.ok) {
    throw new Error("Failed to clear existing trip stops");
  }

  if (stops.length === 0) {
    return;
  }

  const res = await fetch(`${BASE_URL}/${tripId}/stops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
  stops.map((stop) => ({
    stop_no: stop.stop_order,
    station_id: stop.station_id,
    arrival_time: stop.arrival_time,
    departure_time: stop.departure_time,
  }))
),
  });

  if (!res.ok) {
    throw new Error("Failed to save trip stops");
  }
};
