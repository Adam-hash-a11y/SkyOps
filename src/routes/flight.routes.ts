import express from "express";
import { createFlight } from "../controller/flight.controller";
import { validateCreateFlight } from "../middleware/flight.middleware";

export const flightsRouter = express.Router();

flightsRouter.post("/", validateCreateFlight, createFlight);
