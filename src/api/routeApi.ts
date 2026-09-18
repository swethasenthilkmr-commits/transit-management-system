import { Route } from '../types/transit';

const API_URL = 'http://localhost:8081/api/routes';

export async function getRoutes(): Promise<Route[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch routes');
  }

  const data = await response.json();

  return data.map((r: any) => ({
    route_id: r.ROUTE_ID,
    name: r.ROUTE_NAME,
    type: r.ROUTE_TYPE,
    total_distance: Number(r.TOTAL_DISTANCE),
  }));
}

export async function addRouteApi(route: Route) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route_id: route.route_id,
      route_name: route.name,
      route_type: route.type,
      total_distance: route.total_distance,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add route');
  }
}

export async function updateRouteApi(route: Route) {
  const response = await fetch(
    `${API_URL}/${route.route_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route_name: route.name,
        route_type: route.type,
        total_distance: route.total_distance,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update route');
  }
}

export async function deleteRouteApi(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete route');
  }
}