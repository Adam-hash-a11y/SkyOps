import express from "express";
import { generateToken } from "../controller/auth.controller";
export const authRouter = express.Router();

authRouter.get("/", generateToken);
