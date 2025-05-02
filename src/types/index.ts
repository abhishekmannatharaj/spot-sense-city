
export type UserType = "vehicle_owner" | "space_owner";

export interface User {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface ParkingSpot {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  hourlyRate: number;
  dailyRate?: number;
  images: string[];
  safetyScore: number;
  safetyLabels: string[];
  availableFrom: string;
  availableTo: string;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  parkingSpotId: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: Date;
}

export interface SafetyAnalysisResult {
  score: number;
  labels: string[];
}
