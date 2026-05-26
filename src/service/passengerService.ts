import {
  findPassengerByEmail,
  findPassengerByPassport,
  savePassenger,
} from "../repository/passenger.repository";
import { PassengerBody } from "../types/passenger.types";

export const createPassengerService = async (passenger: PassengerBody) => {
  const isExistingFlight = await findPassengerByPassport(
    passenger.passportNumber,
  );
  if (isExistingFlight) {
    throw new Error("Passenger already exists");
  }
  const existingEmail = await findPassengerByEmail(passenger.email);
  if (existingEmail) {
    throw new Error("email already exists");
  }
  return await savePassenger(passenger);
};
