import { app } from "./app";
import { connectDB } from "./src/config/database";
import dotenv from "dotenv";
dotenv.config();

connectDB();
app.listen(5100, () => {
  console.log("running on http://localhost:5100/ \n Welcome to SkyOps");
});
