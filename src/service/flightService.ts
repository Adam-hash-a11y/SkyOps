import { saveFlight } from "../repository/flight.repository";
import { FlightBody } from "../types/flight.types";

export const createFlightService = async (flight: FlightBody) => {
  return await saveFlight(flight);
};
