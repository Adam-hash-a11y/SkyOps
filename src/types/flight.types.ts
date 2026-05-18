export type FlightStatus = "scheduled" | "delayed" | "cancelled" | "landed";

export type FlightBody = {
  flightNumber: string;
  airline: string;
  route: {
    origin: string;
    destination: string;
  };
  schedule: {
    departureTime: Date;
    arrivalTime: Date;
  };
  status: FlightStatus;
  seats: {
    total: number;
    booked: number;
  };
};
