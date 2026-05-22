import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import { connectDB } from "./src/config/database";

connectDB().then(() =>
  app.listen(5100, () => {
    console.log("running on http://localhost:5100/");
  }),
);
