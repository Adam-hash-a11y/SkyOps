import express from "express";
import {
  createPassenger,
  deletePassenger,
  getPassenger,
  getPassengers,
  updatePassenger,
} from "../controller/passenger.controller";
import { validateCreatePassenger } from "../middleware/ValidatePassengerCreation.middleware";
import { validatePassportNumber } from "../middleware/validatePassportNumber.middleware";
import { validateGetPassengers } from "../middleware/validateGetPassengers.middleware";
import { validateUpdatePassenger } from "../middleware/validateUpdatePassenger.middelware";
import { authMiddleware } from "../middleware/auth.middelware";

export const passengersRouter = express.Router();
passengersRouter.use(authMiddleware)
passengersRouter.post("/", validateCreatePassenger, createPassenger);
passengersRouter.get("/", validateGetPassengers, getPassengers);
passengersRouter.get("/:passportNumber", validatePassportNumber, getPassenger);
passengersRouter.delete(
  "/:passportNumber",
  validatePassportNumber,
  deletePassenger,
);
passengersRouter.patch(
  "/:passportNumber",
  validatePassportNumber,
  validateUpdatePassenger,
  updatePassenger,
);
