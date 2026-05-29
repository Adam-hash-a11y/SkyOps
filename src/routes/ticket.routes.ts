import express from "express";

import {
  bookTicket,
  cancelTicket,
  getTicket,
  getTickets,
  //   getTickets,
  //   getTicket,
  //   cancelTicket,
} from "../controller/ticket.controller";

import { validateTicketBooking } from "../middleware/validateTicketBooking.middleware";
import { validateGetTickets } from "../middleware/validateGetTickets.middleware";
import { validateTicketId } from "../middleware/validateTicketId.middleware";
import { validateCancelTicket } from "../middleware/validateUpdateTicket.middleware";

export const ticketsRouter = express.Router();

ticketsRouter.post("/", validateTicketBooking, bookTicket);

ticketsRouter.get("/", validateGetTickets, getTickets);

ticketsRouter.get("/:id", validateTicketId, getTicket);

ticketsRouter.patch(
  "/:id",
  validateTicketId,
  validateCancelTicket,
  cancelTicket,
);
