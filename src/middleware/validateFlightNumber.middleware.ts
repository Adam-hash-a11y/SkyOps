import { Request, Response, NextFunction } from "express";
import { isValidFlightNumber } from "../validator/flight.validator";

export const validateFlightNumber = (
  req: Request<{ flightNumber: string }>,
  res: Response,
  next: NextFunction,
): void => {
  if (!isValidFlightNumber(req.params.flightNumber)) {
    res
      .status(400)
      .json({
        message:
          "flight number must start with SKYOPS- followed by at least one character",
      });
    return;
  }
  next();
};
