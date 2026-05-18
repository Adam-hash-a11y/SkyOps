import { Request, Response } from "express";
import { createFlightService } from "../service/flightService";
import { FlightBody } from "../types/flight.types";

export const createFlight = async (req: Request, res: Response) => {
  const result = await createFlightService(req.body as FlightBody);

  return res.status(200).json({ flight: result });
};
