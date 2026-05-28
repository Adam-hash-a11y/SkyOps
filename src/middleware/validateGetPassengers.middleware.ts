import { Request, Response, NextFunction } from "express";
import {
  isValidName,
  isValidNationality,
  isValidPassengerQueryParams,
  isValidSortByFirstname,
} from "../validator/passenger.validator";

export const validateGetPassengers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidPassengerQueryParams(req.query)) {
    return res.status(400).json({ message: "invalid query params" });
  }

  const { firstName, lastName, nationality, sortBy } = req.query;
  if (firstName && !isValidName(firstName as string)) {
    return res.status(400).json({
      message:
        "first name must contain only letters and be at least 3 characters",
    });
  }
  if (lastName && !isValidName(lastName as string)) {
    return res.status(400).json({
      message:
        "last name must contain only letters and be at least 3 characters",
    });
  }
  if (nationality && !isValidNationality(nationality as string)) {
    res.status(400).json({
      message:
        "Nationality must be 2 uppercase letters and valid ISO country code",
    });
  }

  if (sortBy && !isValidSortByFirstname(sortBy as string)) {
    return res.status(400).json({ message: "sorting must be by firstName" });
  }
  next();
};
