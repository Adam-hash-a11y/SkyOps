import { Request, Response, NextFunction } from "express";

export const validateGetSeats = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const seatClass = req.query.class;

  if (
    seatClass !== undefined &&
    seatClass !== "first" &&
    seatClass !== "business" &&
    seatClass !== "economy"
  ) {
    res
      .status(400)
      .json({ message: "class must be first, business or economy" });
    return;
  }
  next();
};
