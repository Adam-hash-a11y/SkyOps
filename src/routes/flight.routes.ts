import express from "express";
import {
  createFlight,
  getFlight,
  getFlights,
} from "../controller/flight.controller";
import { validateCreateFlight } from "../middleware/flight.middleware";
import { validateGetFlights } from "../middleware/validateGetFlights.middleware";

export const flightsRouter = express.Router();

flightsRouter.post("/", validateCreateFlight, createFlight);
flightsRouter.get("/", validateGetFlights, getFlights);
flightsRouter.get("/:flightNumber", getFlight);
