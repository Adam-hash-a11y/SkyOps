import { FlightModel } from "../model/flight.model";
import { FlightBody, FlightStatus } from "../types/flight.types";

export const saveFlight = async (flight: FlightBody) => {
  try {
    const doc = new FlightModel(flight);
    return await doc.save();
  } catch (error) {
    throw new Error("Error saving flight", { cause: error });
  }
};

export const findFlightByNumber = async (flightNumber: string) => {
  return await FlightModel.findOne({ flightNumber });
};

export const findFlightsByFilters = async (filters: {
  origin?: string;
  destination?: string;
  status?: FlightStatus;
  sortBy?: string;
}) => {
  const filter: Record<string, string> = {};
  if (filters.origin) {
    filter["route.origin"] = filters.origin.toUpperCase();
  }
  if (filters.destination) {
    filter["route.destination"] = filters.destination.toUpperCase();
  }
  if (filters.status) {
    filter.status = filters.status;
  }
  return await FlightModel.find(filter).sort(
    filters.sortBy === "departureTime" ? { "schedule.departureTime": 1 } : {},
  );
};

export const deleteFlightByNumber = async (flightNumber: string) => {
  return await FlightModel.findOneAndDelete({ flightNumber });
};
