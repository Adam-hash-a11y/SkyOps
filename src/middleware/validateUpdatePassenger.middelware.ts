import { Request, Response, NextFunction } from "express";
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidName,
  isValidNationality,
  isValidPassportNumber,
  isValidPhoneNumber,
  isValidUpdatePassengerBody,
} from "../validator/passenger.validator";
import { PassengerBody } from "../types/passenger.types";

export const validateUpdatePassenger = (
  req: Request<{ passportNumber: string }>,
  res: Response,
  next: NextFunction,
) => {
  const passenger = req.body as PassengerBody;
  if (Object.keys(passenger).length === 0) {
    return res.status(400).json({ message: "no fields to update" });
  }
  if (!isValidUpdatePassengerBody(passenger)) {
    return res.status(400).json({ message: "unknown fields are not allowed" });
  }
  if (passenger.firstName !== undefined && !isValidName(passenger.firstName)) {
    return res.status(400).json({
      message:
        "first name must contain only letters and be at least 3 characters",
    });
  }
  if (passenger.lastName !== undefined && !isValidName(passenger.lastName)) {
    return res.status(400).json({
      message:
        "last name must contain only letters and be at least 3 characters",
    });
  }
  if (
    passenger.nationality !== undefined &&
    !isValidNationality(passenger.nationality)
  ) {
    res.status(400).json({
      message:
        "Nationality must be 2 uppercase letters and valid ISO country code",
    });
  }
  if (
    passenger.passportNumber !== undefined &&
    !isValidPassportNumber(passenger.passportNumber)
  ) {
    res.status(400).json({
      message: "passport number must be at least 6 characters",
    });
  }
  if (
    passenger.dateOfBirth !== undefined &&
    !isValidDateOfBirth(passenger.dateOfBirth)
  ) {
    res.status(400).json({
      message: "date of birth must be a valid past date",
    });
  }
  if (passenger.email !== undefined && !isValidEmail(passenger.email)) {
    res.status(400).json({
      message: "email must be a valid email address",
    });
  }
  if (
    passenger.phoneNumber !== undefined &&
    !isValidPhoneNumber(passenger.phoneNumber)
  ) {
    res.status(400).json({
      message: "phone number must be a valid mobile number",
    });
  }
  next();
};
