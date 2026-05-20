import { FlightModel } from "../model/flight.model";
import { FlightBody } from "../types/flight.types";

export const saveFlight = async (flight: FlightBody) => {
  try {
    const doc = new FlightModel(flight);
    return await doc.save();
  } catch (error) {
    throw new Error(`Error saving flight: ${(error as Error).message}`);
  }
};

export const findFlightByNumber = async (flightNumber: string) => {
  return await FlightModel.findOne({ flightNumber });
};
