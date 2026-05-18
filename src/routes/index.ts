import express from "express";
import { flightsRouter } from "./flight.routes";

export const router = express.Router();

router.use("/flights", flightsRouter);
