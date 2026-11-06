import { Request, Response, NextFunction } from "express";
import { findFlightById } from "../repository/flight.repository";
import { findPassengerById } from "../repository/passenger.repository";
import { BatchTicketBody } from "../types/ticket.types";
import { Seat } from "../types/flight.types";

export const validateBatchExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body as BatchTicketBody;

  const flight = await findFlightById(body.flight);
  if (!flight) {
    return res.status(404).json({ message: "flight not found" });
  }

  for (const ticket of body.tickets) {
    const passenger = await findPassengerById(ticket.passenger);
    if (!passenger) {
      return res.status(404).json({ message: "passenger not found" });
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

    const seatExists = classSeats.find(
      (seat) => seat.seat === ticket.seatNumber,
    );
    if (!seatExists) {
      return res
        .status(400)
        .json({ message: "seat does not exist in this class" });
    }
  }

  next();
};
