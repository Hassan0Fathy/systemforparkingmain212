export interface CarRegistrationData {
  plateNumber: string;
  ownerName: string;
}

export interface CarRegistrationResponse {
  car: {
    id: string;
    plateNumber: string;
    ownerName: string;
    qrValue: string;
    qrCode: string;
  };
  qrCode: string;
}

export interface ScanResponse {
  message: string;
  type: "checkin" | "checkout" | "already";
  fee?: number;
  visit?: any;
}

export interface Visit {
  id: string;
  plateNumber: string;
  ownerName: string;
  checkInTime: string;
  checkOutTime: string | null;
  duration: number | null;
  fee: number | null;
  isCheckedIn: boolean;
}

export const registerCar = async (data: CarRegistrationData): Promise<CarRegistrationResponse> => {
  const res = await fetch("/api/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to register car");
  }
  
  return res.json();
};

export const scanQRCode = async (qrCode: string): Promise<ScanResponse> => {
  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrCode }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to scan QR code");
  }
  
  return res.json();
};

export const getVisits = async (): Promise<Visit[]> => {
  const res = await fetch("/api/visits");
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch visits");
  }
  
  return res.json();
};

export const exportVisits = () => {
  window.location.href = "/api/visits/export";
};
