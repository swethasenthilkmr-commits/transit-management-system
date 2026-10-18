import { Payment } from "../types/transit";

const API_URL = "http://localhost:8081/api/payments";

export const getPayments = async (): Promise<Payment[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addPaymentApi = async (payment: Payment) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });
};

export const updatePaymentApi = async (payment: Payment) => {
  await fetch(`${API_URL}/${payment.payment_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });
};

export const deletePaymentApi = async (id: string) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};