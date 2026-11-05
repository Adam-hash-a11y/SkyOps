import mongoose from "mongoose";

const Schema = mongoose.Schema;

const seatSchema = new Schema(
  {
    seat: { type: String, required: true },
    availability: { type: Boolean, required: true, default: true },
  },
  { _id: false },
);

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

    firstSeats: { type: [seatSchema], required: true, default: [] },
    businessSeats: { type: [seatSchema], required: true, default: [] },
    economySeats: { type: [seatSchema], required: true, default: [] },
  },
  { timestamps: true },
);

export const FlightModel = mongoose.model("Flight", flightSchema);
