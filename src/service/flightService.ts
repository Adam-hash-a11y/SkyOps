import {
  deleteFlightByNumber,
  findFlightByNumber,
  findFlightsByFilters,
  saveFlight,
  updateFlightByFlightNumber,
} from "../repository/flight.repository";
import { FlightBody, FlightStatus, Seat } from "../types/flight.types";

const countSeats = (flight: {
  firstSeats: Seat[];
  businessSeats: Seat[];
  economySeats: Seat[];
}) => {
  const allSeats = flight.firstSeats.concat(
    flight.businessSeats,
    flight.economySeats,
  );

  let bookedSeats = 0;
  for (const element of allSeats) {
    if (element.availability === false) {
      bookedSeats++;
    }
  }

  return { totalSeats: allSeats.length, bookedSeats };
};

export const createFlightService = async (flight: FlightBody) => {
  const isExistingFlight = await findFlightByNumber(flight.flightNumber);
  if (isExistingFlight) {
    throw new Error("flight number already exists");
  }

  const firstSeats: Seat[] = [];
  for (let i = 1; i <= flight.firstSeats; i++) {
    firstSeats.push({ seat: "A" + i, availability: true });
  }

  const businessSeats: Seat[] = [];
  for (let i = 1; i <= flight.businessSeats; i++) {
    businessSeats.push({ seat: "B" + i, availability: true });
  }

  const economySeats: Seat[] = [];
  for (let i = 1; i <= flight.economySeats; i++) {
    economySeats.push({ seat: "C" + i, availability: true });
  }

  const savedFlight = await saveFlight({
    ...flight,
    firstSeats,
    businessSeats,
    economySeats,
  });
  return { ...savedFlight.toObject(), ...countSeats(savedFlight) };
};

export const getFlightByFlightNumber = async (flightNumber: string) => {
  const flight = await findFlightByNumber(flightNumber);
  if (!flight) {
    return null;
  }
  return { ...flight.toObject(), ...countSeats(flight) };
};

export const getFlightsByFilters = async (filters: {
  origin?: string;
  destination?: string;
  status?: FlightStatus;
  sortBy?: string;
}) => {
  const flights = await findFlightsByFilters(filters);

  const result = [];
  for (const element of flights) {
    result.push({ ...element.toObject(), ...countSeats(element) });
  }
  return result;
};

export const deleteFlightService = async (flightNumber: string) => {
  return await deleteFlightByNumber(flightNumber);
};

export const updateFlightService = async (
  flightNumber: string,
  updates: Partial<FlightBody>,
) => {
  const existingFlight = await findFlightByNumber(flightNumber);
  if (!existingFlight) {
    return null;
  }
  const updatedFlight = await updateFlightByFlightNumber(flightNumber, updates);
  if (!updatedFlight) {
    return null;
  }
  return { ...updatedFlight.toObject(), ...countSeats(updatedFlight) };
};
