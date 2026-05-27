import { Request, Response } from "express";
import {
  createPassengerService,
  getPassengerByPassportNumberService,
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
