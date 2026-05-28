import {
    deletePassengerByPassportNumber,
  findPassengerByEmail,
  findPassengerByPassport,
  findPassengersByFilters,
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

export const getPassengerByPassportNumberService = async (
  passportNumber: string,
) => {
  return await findPassengerByPassport(passportNumber);
};
export const getPassengersByFilters = async (filters: {
  nationality?: string;
  firstName?: string;
  lastName?: string;
  sortBy?: string;
}) => {
  return await findPassengersByFilters(filters);
};

export const deletePassengerService = async (passportNumber: string) => {
  return await deletePassengerByPassportNumber(passportNumber);
};
