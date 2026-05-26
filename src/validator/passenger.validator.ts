import validator from "validator";
import { PassengerBody } from "../types/passenger.types";

export const isValidEmail = (email: string): boolean => {
  if (typeof email !== "string") return false;
  return validator.isEmail(email);
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (typeof phoneNumber !== "string") return false;
  return validator.isMobilePhone(phoneNumber);
};

export const isValidName = (name: string): boolean => {
  if (typeof name !== "string") return false;
  if (!validator.isAlpha(name, "en-US", { ignore: " " })) return false;
  if (name.length <= 2) return false;
  return true;
};

export const isValidPassportNumber = (passportNumber: string): boolean => {
  if (typeof passportNumber !== "string") return false;
  if (passportNumber.length < 6) return false;
  return true;
};

export const isValidDateOfBirth = (dateOfBirth: unknown): boolean => {
  if (!dateOfBirth) return false;
  const date = new Date(dateOfBirth as string);
  if (Number.isNaN(date.getTime())) return false;
  if (date >= new Date()) return false;
  return true;
};

export const isValidPassengerBody = (passenger: PassengerBody): boolean => {
  if (typeof passenger !== "object" || passenger === null) return false;

  for (const key of Object.keys(passenger)) {
    if (
      key !== "firstName" &&
      key !== "lastName" &&
      key !== "passportNumber" &&
      key !== "nationality" &&
      key !== "dateOfBirth" &&
      key !== "email" &&
      key !== "phoneNumber"
    )
      return false;
  }

  if (
    passenger.firstName === null ||
    passenger.firstName === undefined ||
    passenger.firstName === ""
  )
    return false;

  if (
    passenger.lastName === null ||
    passenger.lastName === undefined ||
    passenger.lastName === ""
  )
    return false;

  if (
    passenger.passportNumber === null ||
    passenger.passportNumber === undefined ||
    passenger.passportNumber === ""
  )
    return false;

  if (
    passenger.nationality === null ||
    passenger.nationality === undefined ||
    passenger.nationality === ""
  )
    return false;

  if (passenger.dateOfBirth === null || passenger.dateOfBirth === undefined)
    return false;

  if (
    passenger.email === null ||
    passenger.email === undefined ||
    passenger.email === ""
  )
    return false;

  if (
    passenger.phoneNumber === null ||
    passenger.phoneNumber === undefined ||
    passenger.phoneNumber === ""
  )
    return false;

  return true;
};

export const isValidNationality = (nationality: string): boolean => {
  const validNationality = nationality.toUpperCase().trim();
  const allowedNationalities = [
    "TN",
    "FR",
    "DE",
    "US",
    "GB",
    "IT",
    "ES",
    "CA",
    "MA",
  ];
  if (nationality !== validNationality) return false;
  return allowedNationalities.includes(validNationality);
};
