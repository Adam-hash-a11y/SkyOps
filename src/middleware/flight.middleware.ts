import { Request, Response, NextFunction } from "express";
import {
  isValidFlightBody,
  isValidOriginDestination,
  isValidDepartureArrival,
  isValidStatus,
  isValidSeats,
  isValidFlightNumber,
  isValidAirline,
} from "../validator/flight.validator";
import { FlightBody } from "../types/flight.types";

export const validateCreateFlight = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidFlightBody(req.body)) {
    return res.status(400).json({ message: "invalid or missing fields" });
  }

  const flight = req.body as FlightBody;

  if (!isValidFlightNumber(flight.flightNumber)) {
    return res.status(400).json({
      message: "flight number must be a string and starts with SKYOPS-",
    });
  }
  if (!isValidAirline(flight.airline)) {
    return res
      .status(400)
      .json({ message: "airline must be exactly 6 alphabetic characters." });
  }
  if (!isValidOriginDestination(flight.route)) {
    return res.status(400).json({
      message:
        "origin and destination must be 3 valid uppercase country letters and must be different",
    });
  }

  if (!isValidDepartureArrival(flight.schedule)) {
    return res.status(400).json({
      message:
        "departure and arrival times must be valid and departure must be before arrival",
    });
  }

  if (!isValidStatus(flight.status)) {
    return res.status(400).json({
      message: "status must be scheduled, delayed, cancelled or landed",
    });
  }

  if (!isValidSeats(flight.seats)) {
    return res.status(400).json({
      message:
        "seats total must be positive number and booked cannot exceed total",
    });
  }

  next();
};
