import { Request, Response, NextFunction } from "express";
import {
  isValidBatchBody,
  isValidSeatNumber,
  isValidTicketClass,
} from "../validator/ticket.validator";

import { BatchTicketBody } from "../types/ticket.types";

export const validateBatchBooking = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidBatchBody(req.body)) {
    return res.status(400).json({ message: "invalid or missing fields" });
  }

  const body = req.body as BatchTicketBody;

  const seats: string[] = [];
  const passengers: string[] = [];

  for (const ticket of body.tickets) {
    if (!isValidSeatNumber(ticket.seatNumber)) {
      return res.status(400).json({
        message: "seat number must be valid format (e.g A12)",
      });
    }

    if (!isValidTicketClass(ticket.class)) {
      return res.status(400).json({
        message: "class must be economy, business or first",
      });
    }

    if (ticket.class === "first" && !ticket.seatNumber.startsWith("A")) {
      return res.status(400).json({
        message: "first class seats start with A",
      });
    }

    if (ticket.class === "business" && !ticket.seatNumber.startsWith("B")) {
      return res.status(400).json({
        message: "business class seats start with B",
      });
    }

    if (ticket.class === "economy" && !ticket.seatNumber.startsWith("C")) {
      return res.status(400).json({
        message: "economy class seats start with C",
      });
    }

    if (seats.includes(ticket.seatNumber)) {
      return res.status(400).json({
        message: "the same seat cannot be twice in one batch",
      });
    }

    if (passengers.includes(ticket.passenger)) {
      return res.status(400).json({
        message: "the same passenger cannot be twice in one batch",
      });
    }

    seats.push(ticket.seatNumber);
    passengers.push(ticket.passenger);
  }

  next();
};
