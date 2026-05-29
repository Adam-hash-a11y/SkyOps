import { Request, Response, NextFunction } from "express";

export const validateCancelTicket = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status } = req.body;

  if (Object.keys(req.body).length !== 1) {
    return res.status(400).json({
      message: "only status update is allowed",
    });
  }

  if (status !== "cancelled") {
    return res.status(400).json({
      message: "status must be cancelled",
    });
  }

  next();
};
