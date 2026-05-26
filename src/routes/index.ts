import express from "express";
import { flightsRouter } from "./flight.routes";
import { passengersRouter } from "./passenger.routes";

export const router = express.Router();

router.use("/flights", flightsRouter);
router.use("/passengers", passengersRouter)
