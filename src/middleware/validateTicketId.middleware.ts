import { Request, Response, NextFunction } from "express";
import { isValidTicketId } from "../validator/ticket.validator";

export const validateTicketId = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidTicketId(req.params.id)) {
    return res.status(400).json({
      message: "invalid ticket id",
    });
  }

  next();
};
    