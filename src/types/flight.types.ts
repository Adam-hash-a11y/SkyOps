export type FlightStatus = "scheduled" | "delayed" | "cancelled" | "landed";

export type Seat = {
  seat: string;
  availability: boolean;
};

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
  firstSeats: number;
  businessSeats: number;
  economySeats: number;
};

export type SavedFlightBody = {
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
  firstSeats: Seat[];
  businessSeats: Seat[];
  economySeats: Seat[];
};
