import { Request, Response } from "express";
import {
  createPassengerService,
  deletePassengerService,
  getPassengerByPassportNumberService,
  getPassengersByFilters,
  updatePassengerService,
} from "../service/passengerService";
import { PassengerBody } from "../types/passenger.types";

export const createPassenger = async (req: Request, res: Response) => {
  try {
    const result = await createPassengerService(req.body as PassengerBody);
    return res.status(201).json({ passenger: result });
  } catch (error) {
    return res.status(409).json({ message: (error as Error).message });
  }
};

export const getPassenger = async (
  req: Request<{ passportNumber: string }>,
  res: Response,
) => {
  const result = await getPassengerByPassportNumberService(
    req.params.passportNumber,
  );
  if (!result) {
    return res.status(404).json({ message: "passenger not found" });
  }
  return res.status(200).json(result);
};

export const getPassengers = async (req: Request, res: Response) => {
  const { nationality, firstName, lastName, sortBy } = req.query;

  const result = await getPassengersByFilters({
    nationality: nationality as string,
    firstName: firstName as string,
    lastName: lastName as string,
    sortBy: sortBy as string,
  });

  return res.status(200).json({ passengers: result });
};

export const deletePassenger = async (
  req: Request<{ passportNumber: string }>,
  res: Response,
) => {
  const result = await deletePassengerService(req.params.passportNumber);
  if (!result) {
    return res.status(404).json({ message: "passenger not found" });
  }
  return res.status(200).json({ message: "passenger deleted successfully" });
};

export const updatePassenger = async (
  req: Request<{ passportNumber: string }>,
  res: Response,
) => {
  const result = await updatePassengerService(
    req.params.passportNumber,
    req.body as Partial<PassengerBody>,
  );

  if (!result) {
    return res.status(404).json({ message: "Passenger not found" });
  }

  return res.status(200).json({
    message: "passenger updated successfully",
    passenger: result,
  });
};
