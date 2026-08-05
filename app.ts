import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { router } from "./src/routes";
import cors from "cors";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    xDownloadOptions: false,

    frameguard: { action: "deny" },

    hidePoweredBy: true,

    noSniff: true,

    xssFilter: true,

    hsts: {
      maxAge: 15552000, // 180 days
      includeSubDomains: true,
    },
  }),
);
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10000,
    statusCode: 429,
    message: {
      success: false,
      error: "Slow down, Please try again in 5 minutes.",
      retryAfter: "5 minutes",
    },
    legacyHeaders: false,
    standardHeaders: "draft-7",
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Skyops" });
});

app.use("/api", router);
