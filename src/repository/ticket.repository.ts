import { SavedTicketBody } from "../types/ticket.types";
import { TicketModel } from "../model/ticket.model";

export const saveTicket = async (ticket: SavedTicketBody) => {
  try {
    const doc = new TicketModel(ticket);
    return await doc.save();
  } catch (error) {
    throw new Error("Error saving ticket", { cause: error });
  }
};

export const findAllTickets = async () => {
  return await TicketModel.find()
    .populate("flight", "flightNumber airline route schedule status")
    .populate("passenger");
};

export const findTicketById = async (id: string) => {
  return await TicketModel.findById(id)
    .populate("flight", "flightNumber airline route schedule status")
    .populate("passenger");
};

export const findTicketByFlightAndSeat = async (
  flightId: string,
  seatNumber: string,
) => {
  return await TicketModel.findOne({ flight: flightId, seatNumber });
};

export const findTicketsByPassenger = async (passengerId: string) => {
  return await TicketModel.find({ passenger: passengerId })
    .populate("flight", "flightNumber airline route schedule status")
    .populate("passenger");
};

export const findTicketsByFlight = async (flightId: string) => {
  return await TicketModel.find({ flight: flightId })
    .populate("flight", "flightNumber airline route schedule status")
    .populate("passenger");
};

export const cancelTicketById = async (id: string) => {
  return await TicketModel.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { returnDocument: "after" },
  );
};
