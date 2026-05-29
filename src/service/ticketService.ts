import { FlightModel } from "../model/flight.model";
import { PassengerModel } from "../model/passenger.model";
import {
  saveTicket,
  findTicketByFlightAndSeat,
  cancelTicketById,
  findAllTickets,
  findTicketById,
  findTicketsByPassenger,
  findTicketsByFlight,
} from "../repository/ticket.repository";
import { TicketBody } from "../types/ticket.types";

export const bookTicketService = async (data: TicketBody) => {
  const flight = await FlightModel.findById(data.flight);
  if (!flight) throw new Error("flight not found");

  const passenger = await PassengerModel.findById(data.passenger);
  if (!passenger) throw new Error("passenger not found");

  const seatTaken = await findTicketByFlightAndSeat(
    data.flight,
    data.seatNumber,
  );
  if (seatTaken) throw new Error("seat already booked on this flight");

  if (!flight.seats) {
    throw new Error("flight seats information missing");
  }

  if (flight.seats.booked >= flight.seats.total) {
    throw new Error("flight is fully booked");
  }

  const ticket = await saveTicket(data);

  await FlightModel.findByIdAndUpdate(data.flight, {
    $inc: { "seats.booked": 1 },
  });

  return ticket;
};

export const cancelTicketService = async (id: string) => {
  const existingTicket = await findTicketById(id);

  if (!existingTicket) {
    throw new Error("ticket not found");
  }

  if (existingTicket.status === "cancelled") {
    throw new Error("ticket already cancelled");
  }

  const ticket = await cancelTicketById(id);

  await FlightModel.findByIdAndUpdate(existingTicket.flight, {
    $inc: { "seats.booked": -1 },
  });

  return ticket;
};

export const getTicketsService = async (filters: {
  passengerId?: string;
  flightId?: string;
}) => {
  if (filters.passengerId) {
    return await findTicketsByPassenger(filters.passengerId);
  }

  if (filters.flightId) {
    return await findTicketsByFlight(filters.flightId);
  }

  return await findAllTickets();
};

export const getTicketByIdService = async (id: string) => {
  return await findTicketById(id);
};
