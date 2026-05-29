import { TicketModel } from "../model/ticket.model";
import { TicketBody } from "../types/ticket.types";

export const saveTicket = async (ticket: TicketBody) => {
  try {
    const doc = new TicketModel(ticket);
    return await doc.save();
  } catch (error) {
    throw new Error("Error saving ticket", { cause: error });
  }
};

export const findAllTickets = async () => {
  return await TicketModel.find().populate("flight").populate("passenger");
};

export const findTicketById = async (id: string) => {
  return await TicketModel.findById(id)
    .populate("flight")
    .populate("passenger");
};

export const findTicketByFlightAndSeat = async (
  flightId: string,
  seatNumber: string,
) => {
  return await TicketModel.findOne({ flight: flightId, seatNumber });
};

export const findTicketsByPassenger = async (passengerId: string) => {
  return await TicketModel.find({ passenger: passengerId }).populate("flight");
};

export const findTicketsByFlight = async (flightId: string) => {
  return await TicketModel.find({ flight: flightId }).populate("passenger");
};

export const cancelTicketById = async (id: string) => {
  return await TicketModel.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { new: true },
  );
};
