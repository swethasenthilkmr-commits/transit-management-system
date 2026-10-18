import { Driver } from "../types/transit";

const API_URL = "http://localhost:8081/api/drivers";

interface ApiDriver {
  DRIVER_ID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  LICENSE_NO: string;
  DOB: string;
  PHONE_NO: string | null;
}

const mapDriver = (row: ApiDriver): Driver => ({
  driver_id: row.DRIVER_ID ?? "",
  name: [row.FIRST_NAME, row.LAST_NAME].filter(Boolean).join(" "),
  license_no: row.LICENSE_NO ?? "",
  dob: (row.DOB ?? "").toString().slice(0, 10),
  phone_numbers: row.PHONE_NO ? [row.PHONE_NO] : [],
});

async function checkResponse(res: Response, action: string) {
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${action} failed (${res.status}): ${detail}`);
  }
}

const toApiBody = (driver: Driver) => {
  const parts = driver.name.trim().split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");

  return {
    driver_id: driver.driver_id,
    first_name: firstName,
    last_name: lastName,
    license_no: driver.license_no,
    dob: driver.dob,
    phone_no: driver.phone_numbers?.filter(Boolean)[0] ?? "",
  };
};

export const getDrivers = async (): Promise<Driver[]> => {
  const res = await fetch(API_URL);
  await checkResponse(res, "Loading drivers");

  const rows: ApiDriver[] = await res.json();
  return rows.map(mapDriver);
};

export const addDriverApi = async (driver: Driver) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiBody(driver)),
  });

  await checkResponse(res, "Adding driver");
};

export const updateDriverApi = async (driver: Driver) => {
  const res = await fetch(
    `${API_URL}/${encodeURIComponent(driver.driver_id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiBody(driver)),
    }
  );

  await checkResponse(res, "Updating driver");
};

export const deleteDriverApi = async (id: string) => {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  await checkResponse(res, "Deleting driver");
};