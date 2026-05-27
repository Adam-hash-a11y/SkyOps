import { Request, Response, NextFunction } from "express";
import { isValidPassportNumber } from "../validator/passenger.validator";

export const validatePassportNumber = (
  req: Request<{ passportNumber: string }>,
  res: Response,
  next: NextFunction,
): void => {
  if (!isValidPassportNumber(req.params.passportNumber)) {
    res.status(400).json({
      message: "passport number must be at least 6 characters",
    });
    return;
  }
  next();
};
