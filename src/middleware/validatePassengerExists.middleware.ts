import { Request, Response, NextFunction } from "express";
import { findPassengerById } from "../repository/passenger.repository";
import { TicketBody } from "../types/ticket.types";

export const validatePassengerExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ticket = req.body as TicketBody;

  const passenger = await findPassengerById(ticket.passenger);
  if (!passenger) {
    return res.status(404).json({ message: "passenger not found" });
  }

  next();
};
