import { Request, Response, NextFunction } from "express";
import {
  isValidPassengerBody,
  isValidName,
  isValidPassportNumber,
  isValidDateOfBirth,
  isValidEmail,
  isValidPhoneNumber,
  isValidNationality,
} from "../validator/passenger.validator";
import { PassengerBody } from "../types/passenger.types";

export const validateCreatePassenger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidPassengerBody(req.body)) {
    return res.status(400).json({ message: "invalid or missing fields" });
  }

  const passenger = req.body as PassengerBody;

  if (!isValidName(passenger.firstName)) {
    return res.status(400).json({
      message:
        "first name must contain only letters and be at least 3 characters",
    });
  }

  if (!isValidName(passenger.lastName)) {
    return res.status(400).json({
      message:
        "last name must contain only letters and be at least 3 characters",
    });
  }

  if (!isValidPassportNumber(passenger.passportNumber)) {
    return res
      .status(400)
      .json({ message: "passport number must be at least 6 characters" });
  }

  if (!isValidDateOfBirth(passenger.dateOfBirth)) {
    return res
      .status(400)
      .json({ message: "date of birth must be a valid past date" });
  }

  if (!isValidEmail(passenger.email)) {
    return res
      .status(400)
      .json({ message: "email must be a valid email address" });
  }

  if (!isValidPhoneNumber(passenger.phoneNumber)) {
    return res
      .status(400)
      .json({ message: "phone number must be a valid mobile number" });
  }

  if (!isValidNationality(passenger.nationality)) {
    return res
      .status(400)
      .json({
        message:
          "Nationality must be 2 uppercase letters and valid ISO country code",
      });
  }

  next();
};
