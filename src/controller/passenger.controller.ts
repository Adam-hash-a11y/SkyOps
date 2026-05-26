import { Request, Response } from "express";
import { createPassengerService } from "../service/passengerService";
import { PassengerBody } from "../types/passenger.types";

export const createPassenger = async (req: Request, res: Response) => {
  try {
    const result = await createPassengerService(req.body as PassengerBody);
    return res.status(201).json({ passenger: result });
  } catch (error) {
    return res.status(409).json({ message: (error as Error).message });
  }
};
