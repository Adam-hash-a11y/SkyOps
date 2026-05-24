import { Request, Response } from "express";
import {
  createFlightService,
  deleteFlightService,
  getFlightByFlightNumber,
  getFlightsByFilters,
} from "../service/flightService";
import { FlightBody, FlightStatus } from "../types/flight.types";

export const createFlight = async (req: Request, res: Response) => {
  try {
    const result = await createFlightService(req.body as FlightBody);
    return res.status(201).json({ flight: result });
  } catch (error) {
    return res.status(409).json({ message: (error as Error).message });
  }
};

export const getFlight = async (
  req: Request<{ flightNumber: string }>,
  res: Response,
) => {
  const result = await getFlightByFlightNumber(req.params.flightNumber);
  if (!result) {
    return res.status(404).json({ message: "flight not found" });
  }
  return res.status(200).json(result);
};

export const getFlights = async (req: Request, res: Response) => {
  const { status, origin, destination, sortBy } = req.query;

  const result = await getFlightsByFilters({
    origin: origin as string,
    destination: destination as string,
    status: status as FlightStatus,
    sortBy: sortBy as string,
  });

  return res.status(200).json({ flights: result });
};

export const deleteFlight = async (
  req: Request<{ flightNumber: string }>,
  res: Response,
) => {
  const result = await deleteFlightService(req.params.flightNumber);
  if (!result) {
    return res.status(404).json({ message: "flight not found" });
  }
  return res.status(200).json({ message: "flight deleted successfully" });
};
