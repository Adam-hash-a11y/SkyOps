import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },
    seatNumber: { type: String, required: true },
    class: {
      type: String,
      enum: ["economy", "business", "first"],
      required: true,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      required: true,
    },
  },
  { timestamps: true },
);

ticketSchema.index({ flight: 1, seatNumber: 1 }, { unique: true });

export const TicketModel = mongoose.model("Ticket", ticketSchema);
