import { Request, Response, NextFunction } from "express";
import {
  isValidTicketBody,
  isValidSeatNumber,
  isValidTicketClass,
  isValidTicketPrice,
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

  if (!isValidTicketPrice(ticket.price)) {
    return res.status(400).json({
      message: "price must be a positive number",
    });
  }

  next();
};
