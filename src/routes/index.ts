import express from "express";
import { flightsRouter } from "./flight.routes";
import { passengersRouter } from "./passenger.routes";
import { ticketsRouter } from "./ticket.routes";
import { authRouter } from "./auth.routes";

export const router = express.Router();

router.use("/flights", flightsRouter);
router.use("/passengers", passengersRouter);
router.use("/tickets", ticketsRouter);
router.use("/login", authRouter);
