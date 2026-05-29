import express from "express";
import {
  createFlight,
  deleteFlight,
  getFlight,
  getFlights,
  updateFlight,
} from "../controller/flight.controller";
import { validateCreateFlight } from "../middleware/flight.middleware";
import { validateGetFlights } from "../middleware/validateGetFlights.middleware";
import { validateFlightNumber } from "../middleware/validateFlightNumber.middleware";
import { validateUpdateFlight } from "../middleware/validateUpdateFlight.middleware";
import { authMiddleware } from "../middleware/auth.middelware";

export const flightsRouter = express.Router();

flightsRouter.use(authMiddleware);
flightsRouter.post("/", validateCreateFlight, createFlight);
flightsRouter.get("/", validateGetFlights, getFlights);
flightsRouter.get("/:flightNumber", getFlight);
flightsRouter.delete("/:flightNumber", validateFlightNumber, deleteFlight);
flightsRouter.patch(
  "/:flightNumber",
  validateFlightNumber,
  validateUpdateFlight,
  updateFlight,
);
