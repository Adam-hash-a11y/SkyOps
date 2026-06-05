import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function generateToken(req: Request, res: Response) {
  try {
    const token = jwt.sign(
      { user: "skyops" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
