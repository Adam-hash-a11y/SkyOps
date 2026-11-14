import { Request, Response, NextFunction } from "express";
import {
  isValidTicketBody,
  isValidSeatNumber,
  isValidTicketClass,
} from "../validator/ticket.validator";

import { TicketBody } from "../types/ticket.types";

export const validateTicketBooking = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidTicketBody(req.body)) {
    return res.status(400).json({ message: "invalid or missing fields" });
  }

  const ticket = req.body as TicketBody;

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

  next();
};
