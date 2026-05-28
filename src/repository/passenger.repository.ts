import { PassengerModel } from "../model/passenger.model";
import { PassengerBody } from "../types/passenger.types";

export const savePassenger = async (passenger: PassengerBody) => {
  try {
    const doc = new PassengerModel(passenger);
    return await doc.save();
  } catch (error) {
    throw new Error("Error saving passenger", { cause: error });
  }
};

export const findPassengerByPassport = async (passportNumber: string) => {
  return await PassengerModel.findOne({ passportNumber });
};

export const findPassengerByEmail = async (email: string) => {
  return await PassengerModel.findOne({ email });
};

export const deletePassengerByPassportNumber = async (
  passportNumber: string,
) => {
  return await PassengerModel.findOneAndDelete({ passportNumber });
};

export const findPassengersByFilters = async (filters: {
  nationality?: string;
  firstName?: string;
  lastName?: string;
  sortBy?: string;
}) => {
  const filter: Record<string, string> = {};
  if (filters.nationality) {
    filter.nationality = filters.nationality;
  }
  if (filters.firstName) {
    filter.firstName = filters.firstName;
  }
  if (filters.lastName) {
    filter.lastName = filters.lastName;
  }
  return await PassengerModel.find(filter).sort(
    filters.sortBy === "firstName" ? { firstName: 1 } : {},
  );
};

export const updatePassengerByPassportNumber = async (
  passportNumber: string,
  updates: Partial<PassengerBody>,
) => {
  return await PassengerModel.findOneAndUpdate(
    { passportNumber },
    { $set: updates },
    { returnDocument: "after" },
  );
};
