import { Request, Response } from "express";
import { createFlightService } from "../service/flightService";
import { FlightBody } from "../types/flight.types";

export const createFlight = async (req: Request, res: Response) => {
  try {
    const result = await createFlightService(req.body as FlightBody);
    return res.status(201).json({ flight: result });
  } catch (error) {
    return res.status(409).json({ message: (error as Error).message });
  }
};
