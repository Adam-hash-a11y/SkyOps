import mongoose from "mongoose";

const Schema = mongoose.Schema;

const flightSchema = new Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    airline: { type: String, required: true },
    route: {
      origin: { type: String, required: true },
      destination: { type: String, required: true },
    },
    schedule: {
      departureTime: { type: Date, required: true },
      arrivalTime: { type: Date, required: true },
    },
    status: {
      type: String,
      enum: ["scheduled", "delayed", "cancelled", "landed"],
      default: "scheduled",
      required: true,
    },
    seats: {
      total: { type: Number, required: true },
      booked: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true },
);

export const FlightModel = mongoose.model("Flight", flightSchema);
