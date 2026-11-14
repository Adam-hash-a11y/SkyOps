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
import { findFlightById } from "../repository/flight.repository";

import { TICKET_PRICES } from "../constants/ticketPrices";
import { Seat } from "../types/flight.types";
import { BatchTicketBody, TicketBody } from "../types/ticket.types";

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

  let classSeats: Seat[] = [];
  if (data.class === "first") {
    classSeats = flight.firstSeats;
  }
  if (data.class === "business") {
    classSeats = flight.businessSeats;
  }
  if (data.class === "economy") {
    classSeats = flight.economySeats;
  }

  const bookedSeat = classSeats.find((seat) => seat.seat === data.seatNumber);
  if (!bookedSeat) throw new Error("seat does not exist in this class");
  if (!bookedSeat.availability) throw new Error("seat is not available");

  const price = TICKET_PRICES[data.class];

  const ticket = await saveTicket({ ...data, price });

  bookedSeat.availability = false;
  await flight.save();

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

export const bookBatchService = async (data: BatchTicketBody) => {
  const flight = await findFlightById(data.flight);
  if (!flight) throw new Error("flight not found");

  const seatsToBook: Seat[] = [];

  for (const item of data.tickets) {
    const seatTaken = await findTicketByFlightAndSeat(
      data.flight,
      item.seatNumber,
    );
    if (seatTaken) {
      throw new Error(
        "seat " + item.seatNumber + " already booked on this flight",
      );
    }

    let classSeats: Seat[] = [];
    if (item.class === "first") {
      classSeats = flight.firstSeats;
    }
    if (item.class === "business") {
      classSeats = flight.businessSeats;
    }
    if (item.class === "economy") {
      classSeats = flight.economySeats;
    }

    const seat = classSeats.find((s) => s.seat === item.seatNumber);
    if (!seat) throw new Error("seat does not exist in this class");
    if (!seat.availability) {
      throw new Error("seat " + item.seatNumber + " is not available");
    }

    seatsToBook.push(seat);
  }

  const tickets = [];

  for (let i = 0; i < data.tickets.length; i++) {
    const item = data.tickets[i];
    const ticket = await saveTicket({
      flight: data.flight,
      passenger: item.passenger,
      seatNumber: item.seatNumber,
      class: item.class,
      price: TICKET_PRICES[item.class],
      status: "confirmed",
    });
    seatsToBook[i].availability = false;
    tickets.push(ticket);
  }

  await flight.save();

  return tickets;
};
