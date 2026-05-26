import mongoose, { Schema } from "mongoose";

const passengerSchema = new Schema(
  {
    passportNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nationality: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true },
);

export const PassengerModel = mongoose.model("Passenger", passengerSchema);
