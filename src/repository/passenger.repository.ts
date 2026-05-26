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
