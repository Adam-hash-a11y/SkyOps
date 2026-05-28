import express from "express";
import {
  createPassenger,
  deletePassenger,
  getPassenger,
  getPassengers,
} from "../controller/passenger.controller";
import { validateCreatePassenger } from "../middleware/ValidatePassengerCreation.middleware";
import { validatePassportNumber } from "../middleware/validatePassportNumber.middleware";
import { validateGetPassengers } from "../middleware/validateGetPassengers.middleware";

export const passengersRouter = express.Router();

passengersRouter.post("/", validateCreatePassenger, createPassenger);
passengersRouter.get("/", validateGetPassengers, getPassengers);
passengersRouter.get("/:passportNumber", validatePassportNumber, getPassenger);
passengersRouter.delete(
  "/:passportNumber",
  validatePassportNumber,
  deletePassenger,
);
