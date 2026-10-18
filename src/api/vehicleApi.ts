
import { Vehicle } from "../types/transit";

const API_URL = "http://localhost:8081/api/vehicles";

interface ApiVehicle {
  REGISTRATION_NO?: string;
  MANUFACTURE_DATE?: string;
  COLOR?: string;
  VEHICLE_TYPE_ID?: string;
  DRIVER_ID?: string | null;
}

interface ApiResponse<T> {
  value?: T[];
  Count?: number;
}

const mapVehicle = (row: ApiVehicle): Vehicle => ({
  vehicle_id: row.REGISTRATION_NO ?? "",
  registration_no: row.REGISTRATION_NO ?? "",
  manufacture_date: row.MANUFACTURE_DATE ?? "",
  color: row.COLOR ?? "",
  type_id: row.VEHICLE_TYPE_ID ?? "",
  driver_id: row.DRIVER_ID ?? null,
});

export const getVehicles = async (): Promise<Vehicle[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch vehicles: ${res.status}`);
  }

  const data: ApiResponse<ApiVehicle> | ApiVehicle[] = await res.json();

  // The backend currently returns { value: [...], Count: 5 }.
  const rows = Array.isArray(data) ? data : data.value ?? [];

  return rows.map(mapVehicle);
};

export const addVehicleApi = async (vehicle: Vehicle) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      REGISTRATION_NO: vehicle.registration_no,
      MANUFACTURE_DATE: vehicle.manufacture_date,
      COLOR: vehicle.color,
      VEHICLE_TYPE_ID: vehicle.type_id,
      DRIVER_ID: vehicle.driver_id,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to add vehicle: ${res.status}`);
  }
};

export const updateVehicleApi = async (vehicle: Vehicle) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(vehicle.registration_no)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        REGISTRATION_NO: vehicle.registration_no,
        MANUFACTURE_DATE: vehicle.manufacture_date,
        COLOR: vehicle.color,
        VEHICLE_TYPE_ID: vehicle.type_id,
        DRIVER_ID: vehicle.driver_id,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update vehicle: ${res.status}`);
  }
};

export const deleteVehicleApi = async (id: string) => {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete vehicle: ${res.status}`);
  }
};
