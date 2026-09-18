import { Station } from '../types/transit';

const API_URL = 'http://localhost:8081/api/stations';

export async function getStations(): Promise<Station[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch stations');
  }

  const data = await response.json();

  return data.map((s: any) => ({
    station_id: s.STATION_ID,
    name: s.STATION_NAME,
    city: s.CITY,
    area: s.AREA,
    landmark: s.LANDMARK,
  }));
}

export async function addStationApi(station: Station) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      station_id: station.station_id,
      station_name: station.name,
      city: station.city,
      area: station.area,
      landmark: station.landmark,
      route_id: null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add station');
  }
}

export async function updateStationApi(station: Station) {
  const response = await fetch(
    `${API_URL}/${station.station_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        station_name: station.name,
        city: station.city,
        area: station.area,
        landmark: station.landmark,
        route_id: null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update station');
  }
}

export async function deleteStationApi(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete station');
  }
}