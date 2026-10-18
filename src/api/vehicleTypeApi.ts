
import { VehicleType, FuelType } from "../types/transit";
const API_URL = "http://localhost:8081/api/vehicle-types";

interface ApiVehicleType {
  VEHICLE_TYPE_ID?: string;
  TYPE_NAME?: string;
  CAPACITY?: number;
  FUEL_TYPE?: string;
}

interface ApiResponse {
  value?: ApiVehicleType[];
  Count?: number;
}

export const getVehicleTypes = async (): Promise<VehicleType[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle types: ${res.status}`);
  }

  const data: ApiResponse | ApiVehicleType[] = await res.json();
  const rows = Array.isArray(data) ? data : data.value ?? [];

  return rows.map((row) => ({
    type_id: row.VEHICLE_TYPE_ID ?? "",
    name: row.TYPE_NAME ?? "",
    capacity: Number(row.CAPACITY ?? 0),
    fuel_type: (row.FUEL_TYPE ?? "Diesel") as FuelType,
  }));
};

export const addVehicleTypeApi = async (type: VehicleType) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      VEHICLE_TYPE_ID: type.type_id,
      TYPE_NAME: type.name,
      CAPACITY: type.capacity,
      FUEL_TYPE: type.fuel_type,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to add vehicle type: ${res.status}`);
  }
};

export const updateVehicleTypeApi = async (type: VehicleType) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(type.type_id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        VEHICLE_TYPE_ID: type.type_id,
        TYPE_NAME: type.name,
        CAPACITY: type.capacity,
        FUEL_TYPE: type.fuel_type,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update vehicle type: ${res.status}`);
  }
};

export const deleteVehicleTypeApi = async (id: string) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete vehicle type: ${res.status}`);
  }
};
