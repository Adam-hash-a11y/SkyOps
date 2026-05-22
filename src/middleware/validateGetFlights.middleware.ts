import { Request, Response, NextFunction } from "express";
import {
  isValidIATA,
  isValidQueryParams,
  isValidSortByDepatureTime,
  isValidStatus,
} from "../validator/flight.validator";
import { FlightStatus } from "../types/flight.types";

export const validateGetFlights = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidQueryParams(req.query)) {
    return res.status(400).json({ message: "invalid query param(s)" });
  }
  const { status, origin, destination, sortBy } = req.query;

  if (status && !isValidStatus(status as FlightStatus)) {
    return res.status(400).json({
      message: "status must be scheduled, delayed, cancelled or landed",
    });
  }
  if (sortBy && !isValidSortByDepatureTime(sortBy as string)) {
    return res.status(400).json({
      message: "sorting must be departureTime",
    });
  }
  if (origin && !isValidIATA(origin as string)) {
    return res
      .status(400)
      .json({ message: "origin must be 3 uppercase letters" });
  }

  if (destination && !isValidIATA(destination as string)) {
    return res
      .status(400)
      .json({ message: "destination must be 3 uppercase letters" });
  }

  next();
};
