import {
  findFlightByNumber,
  saveFlight,
} from "../repository/flight.repository";
import { FlightBody } from "../types/flight.types";

export const createFlightService = async (flight: FlightBody) => {
  const isExistingFlight = await findFlightByNumber(flight.flightNumber);
  if (isExistingFlight) {
    throw new Error("flight number already exists");
  }
  return await saveFlight(flight);
};
