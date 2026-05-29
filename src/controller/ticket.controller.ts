import { Request, Response } from "express";
import { bookTicketService, cancelTicketService, getTicketByIdService, getTicketsService } from "../service/ticketService";
import { TicketBody } from "../types/ticket.types";

export const bookTicket = async (req: Request, res: Response) => {
  try {
    const result = await bookTicketService(req.body as TicketBody);
    return res.status(201).json({ ticket: result });
  } catch (error) {
    return res.status(409).json({ message: (error as Error).message });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const { passengerId, flightId } = req.query;

  const result = await getTicketsService({
    passengerId: passengerId as string,
    flightId: flightId as string,
  });

  return res.status(200).json({ tickets: result });
};
export const getTicket = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const ticket = await getTicketByIdService(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      message: "ticket not found",
    });
  }

  return res.status(200).json({
    ticket,
  });
};

export const cancelTicket = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const result = await cancelTicketService(req.params.id);

    return res.status(200).json({
      message: "ticket cancelled successfully",
      ticket: result,
    });
  } catch (error) {
    return res.status(404).json({
      message: (error as Error).message,
    });
  }
};
