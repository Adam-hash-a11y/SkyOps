import express from "express";

import {
  bookBatch,
  bookTicket,
  cancelTicket,
  getTicket,
  getTickets,
} from "../controller/ticket.controller";

import { validateTicketBooking } from "../middleware/validateTicketBooking.middleware";
import { validateGetTickets } from "../middleware/validateGetTickets.middleware";
import { validateTicketId } from "../middleware/validateTicketId.middleware";
import { validateCancelTicket } from "../middleware/validateUpdateTicket.middleware";
import { authMiddleware } from "../middleware/auth.middelware";
import { validateSeatExists } from "../middleware/validateSeatExists.middleware";
import { validatePassengerExists } from "../middleware/validatePassengerExists.middleware";
import { validateBatchBooking } from "../middleware/validateBatchBooking.middleware";
import { validateBatchExists } from "../middleware/validateBatchExists.middleware";

export const ticketsRouter = express.Router();
ticketsRouter.use(authMiddleware);
ticketsRouter.post(
  "/",
  validateTicketBooking,
  validatePassengerExists,
  validateSeatExists,
  bookTicket,
);
ticketsRouter.get("/", validateGetTickets, getTickets);

ticketsRouter.get("/:id", validateTicketId, getTicket);

ticketsRouter.patch(
  "/:id",
  validateTicketId,
  validateCancelTicket,
  cancelTicket,
);

ticketsRouter.post(
  "/batch",
  validateBatchBooking,
  validateBatchExists,
  bookBatch,
);
