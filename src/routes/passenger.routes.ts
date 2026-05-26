import express from "express";
import { createPassenger } from "../controller/passenger.controller";
import { validateCreatePassenger } from "../middleware/ValidatePassengerCreation.middleware";

export const passengersRouter = express.Router();

passengersRouter.post("/", validateCreatePassenger, createPassenger);
