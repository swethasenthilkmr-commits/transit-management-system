import { Passenger } from '../types/transit';

const API_URL = 'http://localhost:8081/api/passengers';

export async function getPassengers(): Promise<Passenger[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch passengers');
  }

  const data = await response.json();

  return data.map((p: any) => ({
    passenger_id: p.PASSENGER_ID,
    first_name: p.FIRST_NAME,
    last_name: p.LAST_NAME,
    email: p.EMAIL ?? '',
    gender: p.GENDER,
    dob: p.DOB ? p.DOB.substring(0, 10) : '',
    door_no: p.DOOR_NO ?? '',
    street: '',
    city: p.CITY ?? '',
    state: p.STATE ?? '',
    pin: p.PIN ?? '',
    phone_numbers: p.PHONE_NUMBERS
      ? p.PHONE_NUMBERS.split(',')
      : [],
  }));

}

export async function addPassengerApi(passenger: Passenger) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      passenger_id: passenger.passenger_id,
      first_name: passenger.first_name,
      last_name: passenger.last_name,
      email: passenger.email,
      gender: passenger.gender,
      dob: passenger.dob,
      door_no: passenger.door_no,
      city: passenger.city,
      state: passenger.state,
      pin: passenger.pin,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add passenger');
  }
}

export async function updatePassengerApi(passenger: Passenger) {
  const response = await fetch(
    `${API_URL}/${passenger.passenger_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: passenger.first_name,
        last_name: passenger.last_name,
        email: passenger.email,
        gender: passenger.gender,
        dob: passenger.dob,
        door_no: passenger.door_no,
        city: passenger.city,
        state: passenger.state,
        pin: passenger.pin,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update passenger');
  }
}

export async function deletePassengerApi(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete passenger');
  }
}