import express from "express";
import { createFlight } from "../controller/flight.controller";

export const flightsRouter = express.Router();

flightsRouter.post("/", createFlight); 
