import {
  deleteFlightByNumber,
  findFlightByNumber,
  findFlightsByFilters,
  saveFlight,
} from "../repository/flight.repository";
import { FlightBody, FlightStatus } from "../types/flight.types";

export const createFlightService = async (flight: FlightBody) => {
  const isExistingFlight = await findFlightByNumber(flight.flightNumber);
  if (isExistingFlight) {
    throw new Error("flight number already exists");
  }
  return await saveFlight(flight);
};

export const getFlightByFlightNumber = async (flightNumber: string) => {
  return await findFlightByNumber(flightNumber);
};

export const getFlightsByFilters = async (filters: {
  origin?: string;
  destination?: string;
  status?: FlightStatus;
  sortBy?: string;
}) => {
  return await findFlightsByFilters(filters);
};

export const deleteFlightService = async (flightNumber: string) => {
  return await deleteFlightByNumber(flightNumber);
};
