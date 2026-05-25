import { Request, Response, NextFunction } from "express";
import {
  isValidAirline,
  isValidDepartureArrival,
  isValidOriginDestination,
  isValidSeats,
  isValidStatus,
  isValidUpdateFlightBody,
} from "../validator/flight.validator";

export const validateUpdateFlight = (
  req: Request<{ flightNumber: string }>,
  res: Response,
  next: NextFunction,
) => {
  const flight = req.body;

  if (Object.keys(flight).length === 0) {
    return res.status(400).json({ message: "no fields to update" });
  }

  if (!isValidUpdateFlightBody(flight)) {
    return res.status(400).json({ message: "unknown fields are not allowed" });
  }

  if (flight.airline !== undefined && !isValidAirline(flight.airline)) {
    return res
      .status(400)
      .json({ message: "airline must be exactly 6 alphabetic characters." });
  }

  if (flight.route !== undefined && !isValidOriginDestination(flight.route)) {
    return res.status(400).json({
      message:
        "origin and destination must be 3 valid uppercase country letters and must be different",
    });
  }

  if (
    flight.schedule !== undefined &&
    !isValidDepartureArrival(flight.schedule)
  ) {
    return res.status(400).json({
      message:
        "departure and arrival times must be valid and departure must be before arrival",
    });
  }

  if (flight.status !== undefined && !isValidStatus(flight.status)) {
    return res.status(400).json({
      message: "status must be scheduled, delayed, cancelled or landed",
    });
  }

  if (flight.seats !== undefined && !isValidSeats(flight.seats)) {
    return res.status(400).json({
      message:
        "seats total must be positive number and booked cannot exceed total",
    });
  }

  next();
};
    