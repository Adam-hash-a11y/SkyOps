import express from "express";
import {
  createPassenger,
  deletePassenger,
  getPassenger,
} from "../controller/passenger.controller";
import { validateCreatePassenger } from "../middleware/ValidatePassengerCreation.middleware";
import { validatePassportNumber } from "../middleware/validatePassportNumber.middleware";

export const passengersRouter = express.Router();

passengersRouter.post("/", validateCreatePassenger, createPassenger);
passengersRouter.get("/:passportNumber", validatePassportNumber, getPassenger);
passengersRouter.delete(
  "/:passportNumber",
  validatePassportNumber,
  deletePassenger,
);
