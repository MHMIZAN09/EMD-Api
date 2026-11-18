import type {
  AmbulanceStatus,
  AmbulanceType,
} from "../../../generated/prisma/enums";

export interface IAmbulancePayload {
  licensePlate: string;
  model: string;
  manufacturer?: string;
  year?: number;
  type: AmbulanceType;
  capacity: number;
  status: AmbulanceStatus;
  latitude?: number;
  longitude?: number;
  baseFare: string;
  perKmFare: string;
}

export interface IAmbulanceStatusPayload {
  status: AmbulanceStatus;
}

export interface IAmbulanceLocationPayload {
  latitude: number;
  longitude: number;
}

export interface IAmbulanceUpdatePayload {
  licensePlate?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  type?: AmbulanceType;
  capacity?: number;
  status?: AmbulanceStatus;
  latitude?: number;
  longitude?: number;
  baseFare?: string;
  perKmFare?: string;
}
