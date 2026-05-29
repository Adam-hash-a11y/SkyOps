import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Request<{ id: number | string }>,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // @ts-expect-error: user is added by auth middleware after JWT verification
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: err });
  }
}
