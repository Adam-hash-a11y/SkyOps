import validator from "validator";
import { FlightBody, FlightStatus } from "../types/flight.types";

export const isValidDepartureArrival = (schedule: {
  arrivalTime: Date;
  departureTime: Date;
}): boolean => {
  if (!schedule) return false;
  if (!schedule.arrivalTime || !schedule.departureTime) return false;

  const departure = new Date(schedule.departureTime);
  const arrival = new Date(schedule.arrivalTime);
  if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime()))
    return false;
  return departure < arrival;
};

export const isValidAirline = (airline: unknown): boolean => {
  if (typeof airline !== "string") return false;
  if (!validator.isAlpha(airline)) return false;
  if (airline.length < 5) return false;
  return true;
};

export const isValidIATA = (code: string): boolean => {
  if (!code) return false;
  if (code.length !== 3) return false;
  if (!validator.isAlpha(code)) return false;
  if (code !== code.toUpperCase()) return false;
  return true;
};

export const isValidQueryParams = (query: Record<string, unknown>): boolean => {
  for (const key of Object.keys(query)) {
    if (
      key !== "status" &&
      key !== "origin" &&
      key !== "destination" &&
      key !== "sortBy"
    )
      return false;
  }
  return true;
};
export const isValidSortByDepatureTime = (sortKey: string): boolean => {
  if (typeof sortKey !== "string") return false;
  return sortKey === "departureTime";
};

export const isValidOriginDestination = (route: {
  origin: string;
  destination: string;
}): boolean => {
  if (!route) return false;
  if (!route.origin || !route.destination) return false;
  if (!validator.isAlpha(route.origin) || !validator.isAlpha(route.destination))
    return false;
  if (
    route.origin !== route.origin.toUpperCase() ||
    route.destination !== route.destination.toUpperCase()
  )
    return false;

  if (route.origin === route.destination) return false;

  if (route.origin.length != 3 || route.destination.length != 3) return false;

  return true;
};

export const isValidStatus = (status: FlightStatus): boolean => {
  if (typeof status !== "string") return false;

  return (
    status === "scheduled" ||
    status === "delayed" ||
    status === "cancelled" ||
    status === "landed"
  );
};

export const isValidFlightNumber = (flightNumber: unknown): boolean => {
  if (typeof flightNumber !== "string") return false;
  if (!flightNumber.startsWith("SKYOPS-")) return false;
  if (flightNumber.length <= 7) return false;
  return true;
};

export const isValidSeats = (seats: {
  booked: number;
  total: number;
}): boolean => {
  if (!seats) return false;
  if (!Number.isInteger(seats.total) || seats.total <= 0) return false;
  if (!Number.isInteger(seats.booked) || seats.booked < 0) return false;
  if (seats.booked > seats.total) return false;
  return true;
};

export const isValidFlightBody = (flight: FlightBody): boolean => {
  if (typeof flight !== "object" || flight === null) return false;
  for (const key of Object.keys(flight)) {
    if (
      key !== "flightNumber" &&
      key !== "airline" &&
      key !== "route" &&
      key !== "schedule" &&
      key !== "status" &&
      key !== "seats"
    )
      return false;
  }

  for (const key of Object.keys(flight.route)) {
    if (key !== "origin" && key !== "destination") return false;
  }
  for (const key of Object.keys(flight.schedule)) {
    if (key !== "departureTime" && key !== "arrivalTime") return false;
  }

  for (const key of Object.keys(flight.seats)) {
    if (key !== "total" && key !== "booked") return false;
  }

  if (
    flight.flightNumber === null ||
    flight.flightNumber === undefined ||
    flight.flightNumber === ""
  )
    return false;

  if (
    flight.airline === null ||
    flight.airline === undefined ||
    flight.airline === ""
  )
    return false;

  if (flight.route === null || flight.route === undefined) return false;

  if (flight.schedule === null || flight.schedule === undefined) return false;

  if (flight.status === null || flight.status === undefined) return false;

  if (flight.seats === null || flight.seats === undefined) return false;

  return true;
};

export const isValidUpdateFlightBody = (flight: FlightBody): boolean => {
  if (typeof flight !== "object" || flight === null) return false;

  for (const key of Object.keys(flight)) {
    if (
      key !== "airline" &&
      key !== "route" &&
      key !== "schedule" &&
      key !== "status" &&
      key !== "seats"
    )
      return false;
  }

  if (flight.route !== undefined) {
    for (const key of Object.keys(flight.route)) {
      if (key !== "origin" && key !== "destination") return false;
    }
  }

  if (flight.schedule !== undefined) {
    for (const key of Object.keys(flight.schedule)) {
      if (key !== "departureTime" && key !== "arrivalTime") return false;
    }
  }

  if (flight.seats !== undefined) {
    for (const key of Object.keys(flight.seats)) {
      if (key !== "total" && key !== "booked") return false;
    }
  }

  return true;
};
