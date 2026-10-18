
import { Ticket } from "../types/transit";

const API_URL = "http://localhost:8081/api/tickets";

const mapTicket = (row: any): Ticket => ({
  ticket_id: row.ticket_id ?? row.TICKET_ID,
  passenger_id: row.passenger_id ?? row.PASSENGER_ID,
  trip_id: row.trip_id ?? row.TRIP_ID,
  issue_date: row.issue_date ?? row.ISSUE_DATE,
  ticket_type: row.ticket_type ?? row.TICKET_TYPE,
  travel_class: row.travel_class ?? row.TRAVEL_CLASS,
});

export const getTickets = async (): Promise<Ticket[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`Failed to load tickets: ${res.status}`);
  }

  const rows = await res.json();
  return rows.map(mapTicket);
};

export const addTicketApi = async (ticket: Ticket) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });

  if (!res.ok) {
    throw new Error(`Failed to add ticket: ${res.status} ${await res.text()}`);
  }
};

export const updateTicketApi = async (ticket: Ticket) => {
  const res = await fetch(`${API_URL}/${ticket.ticket_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });

  if (!res.ok) {
    throw new Error(`Failed to update ticket: ${res.status} ${await res.text()}`);
  }
};

export const deleteTicketApi = async (id: string) => {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete ticket: ${res.status} ${await res.text()}`);
  }
};
