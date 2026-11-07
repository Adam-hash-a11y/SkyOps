import { Request, Response, NextFunction } from "express";
import { findFlightById } from "../repository/flight.repository";
import { TicketBody } from "../types/ticket.types";
import { Seat } from "../types/flight.types";

export const validateSeatExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ticket = req.body as TicketBody;

  const flight = await findFlightById(ticket.flight);
  if (!flight) {
    return res.status(404).json({ message: "flight not found" });
  }

  let classSeats: Seat[] = [];
  if (ticket.class === "first") {
    classSeats = flight.firstSeats;
  }
  if (ticket.class === "business") {
    classSeats = flight.businessSeats;
  }
  if (ticket.class === "economy") {
    classSeats = flight.economySeats;
  }

  const seatExists = classSeats.find((seat) => seat.seat === ticket.seatNumber);
  if (!seatExists) {
    return res
      .status(400)
      .json({ message: "seat does not exist in this class" });
  }

  next();
};
