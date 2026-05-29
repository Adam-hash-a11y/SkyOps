import { Request, Response, NextFunction } from "express";
import { isValidTicketQuery } from "../validator/ticket.validator";

export const validateGetTickets = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidTicketQuery(req.query)) {
    return res.status(400).json({ message: "invalid query param(s)" });
  }

  next();
};
