import mongoose from "mongoose";
import { FlightModel } from "./src/model/flight.model";
import { PassengerModel } from "./src/model/passenger.model";
import { TicketModel } from "./src/model/ticket.model";
import {
  createFlightService,
  deleteFlightService,
} from "./src/service/flightService";
import {
  createPassengerService,
  deletePassengerService,
} from "./src/service/passengerService";
import {
  bookTicketService,
  cancelTicketService,
} from "./src/service/ticketService";
import { FlightBody } from "./src/types/flight.types";
import { PassengerBody } from "./src/types/passenger.types";
import { TicketBody } from "./src/types/ticket.types";

interface SeedTicket {
  flightNumber: string;
  passportNumber: string;
  seatNumber: string;
  class: TicketBody["class"];
  cancel: boolean;
}

const flightsData: FlightBody[] = [
  {
    flightNumber: "SKYOPS-101",
    airline: "Lufthansa",
    route: { origin: "TUN", destination: "FRA" },
    schedule: {
      departureTime: new Date("2026-12-05T08:00:00Z"),
      arrivalTime: new Date("2026-12-05T11:00:00Z"),
    },
    status: "scheduled",
    firstSeats: 4,
    businessSeats: 8,
    economySeats: 30,
  },
  {
    flightNumber: "SKYOPS-102",
    airline: "TunisAir",
    route: { origin: "TUN", destination: "CDG" },
    schedule: {
      departureTime: new Date("2026-12-06T14:30:00Z"),
      arrivalTime: new Date("2026-12-06T17:30:00Z"),
    },
    status: "delayed",
    firstSeats: 2,
    businessSeats: 6,
    economySeats: 20,
  },
  {
    flightNumber: "SKYOPS-103",
    airline: "AirFrance",
    route: { origin: "CDG", destination: "DUS" },
    schedule: {
      departureTime: new Date("2026-12-07T10:15:00Z"),
      arrivalTime: new Date("2026-12-07T18:45:00Z"),
    },
    status: "cancelled",
    firstSeats: 2,
    businessSeats: 4,
    economySeats: 10,
  },
  {
    flightNumber: "SKYOPS-104",
    airline: "Iberia",
    route: { origin: "MAD", destination: "TUN" },
    schedule: {
      departureTime: new Date("2026-11-10T06:00:00Z"),
      arrivalTime: new Date("2026-11-10T08:30:00Z"),
    },
    status: "landed",
    firstSeats: 2,
    businessSeats: 4,
    economySeats: 10,
  },
  {
    // fully booked: Book button disabled
    flightNumber: "SKYOPS-105",
    airline: "Transavia",
    route: { origin: "ORY", destination: "TUN" },
    schedule: {
      departureTime: new Date("2026-12-08T09:00:00Z"),
      arrivalTime: new Date("2026-12-08T10:30:00Z"),
    },
    status: "scheduled",
    firstSeats: 1,
    businessSeats: 0,
    economySeats: 2,
  },
  {
    // 9 of 10 seats booked: orange progress bar
    flightNumber: "SKYOPS-106",
    airline: "TunisAir",
    route: { origin: "TUN", destination: "MUC" },
    schedule: {
      departureTime: new Date("2026-12-09T12:00:00Z"),
      arrivalTime: new Date("2026-12-09T15:00:00Z"),
    },
    status: "scheduled",
    firstSeats: 0,
    businessSeats: 0,
    economySeats: 10,
  },
  {
    // no tickets: empty state on the details page
    flightNumber: "SKYOPS-107",
    airline: "Lufthansa",
    route: { origin: "FRA", destination: "MAD" },
    schedule: {
      departureTime: new Date("2026-12-10T07:00:00Z"),
      arrivalTime: new Date("2026-12-10T08:30:00Z"),
    },
    status: "scheduled",
    firstSeats: 2,
    businessSeats: 4,
    economySeats: 12,
  },
  {
    flightNumber: "SKYOPS-108",
    airline: "Eurowings",
    route: { origin: "DUS", destination: "TUN" },
    schedule: {
      departureTime: new Date("2026-12-11T16:00:00Z"),
      arrivalTime: new Date("2026-12-11T19:00:00Z"),
    },
    status: "scheduled",
    firstSeats: 1,
    businessSeats: 3,
    economySeats: 8,
  },
];

// one passenger per nationality, plus one without tickets
const passengersData: PassengerBody[] = [
  {
    firstName: "Lena",
    lastName: "Fischer",
    passportNumber: "DE7731902",
    nationality: "DE",
    dateOfBirth: new Date("1992-11-02"),
    email: "lena.fischer@example.com",
    phoneNumber: "+4915194300275",
  },
  {
    firstName: "Amine",
    lastName: "Trabelsi",
    passportNumber: "TN4408231",
    nationality: "TN",
    dateOfBirth: new Date("1995-03-14"),
    email: "amine.trabelsi@example.com",
    phoneNumber: "+21698123456",
  },
  {
    firstName: "Camille",
    lastName: "Dubois",
    passportNumber: "FR5520917",
    nationality: "FR",
    dateOfBirth: new Date("1988-07-21"),
    email: "camille.dubois@example.com",
    phoneNumber: "+33612345678",
  },
  {
    firstName: "James",
    lastName: "Carter",
    passportNumber: "US9083345",
    nationality: "US",
    dateOfBirth: new Date("1985-01-30"),
    email: "james.carter@example.com",
    phoneNumber: "+12025550173",
  },
  {
    firstName: "Oliver",
    lastName: "Smith",
    passportNumber: "GB3321876",
    nationality: "GB",
    dateOfBirth: new Date("1990-09-09"),
    email: "oliver.smith@example.com",
    phoneNumber: "+447911123456",
  },
  {
    firstName: "Giulia",
    lastName: "Rossi",
    passportNumber: "IT6643120",
    nationality: "IT",
    dateOfBirth: new Date("1993-05-17"),
    email: "giulia.rossi@example.com",
    phoneNumber: "+393123456789",
  },
  {
    firstName: "Carlos",
    lastName: "Garcia",
    passportNumber: "ES2210984",
    nationality: "ES",
    dateOfBirth: new Date("1987-12-04"),
    email: "carlos.garcia@example.com",
    phoneNumber: "+34612345678",
  },
  {
    firstName: "Emma",
    lastName: "Tremblay",
    passportNumber: "CA7712093",
    nationality: "CA",
    dateOfBirth: new Date("1996-02-25"),
    email: "emma.tremblay@example.com",
    phoneNumber: "+14165550123",
  },
  {
    firstName: "Yassine",
    lastName: "Alaoui",
    passportNumber: "MA1198764",
    nationality: "MA",
    dateOfBirth: new Date("1991-08-11"),
    email: "yassine.alaoui@example.com",
    phoneNumber: "+212612345678",
  },
  {
    firstName: "Noah",
    lastName: "Becker",
    passportNumber: "DE1156782",
    nationality: "DE",
    dateOfBirth: new Date("2000-06-06"),
    email: "noah.becker@example.com",
    phoneNumber: "+4915112345678",
  },
];

// created only to be deleted: their tickets show "Deleted flight" / "Deleted passenger"
const temporaryFlight: FlightBody = {
  flightNumber: "SKYOPS-999",
  airline: "TemporaryAir",
  route: { origin: "TUN", destination: "ORY" },
  schedule: {
    departureTime: new Date("2026-12-20T10:00:00Z"),
    arrivalTime: new Date("2026-12-20T13:00:00Z"),
  },
  status: "scheduled",
  firstSeats: 1,
  businessSeats: 1,
  economySeats: 1,
};

const temporaryPassenger: PassengerBody = {
  firstName: "Temporary",
  lastName: "Passenger",
  passportNumber: "XX0000001",
  nationality: "FR",
  dateOfBirth: new Date("1999-01-01"),
  email: "temporary.passenger@example.com",
  phoneNumber: "+33698765432",
};

const ticketsData: SeedTicket[] = [
  // SKYOPS-101: all three classes, one cancelled
  {
    flightNumber: "SKYOPS-101",
    passportNumber: "DE7731902",
    seatNumber: "A1",
    class: "first",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-101",
    passportNumber: "TN4408231",
    seatNumber: "B1",
    class: "business",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-101",
    passportNumber: "FR5520917",
    seatNumber: "C1",
    class: "economy",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-101",
    passportNumber: "US9083345",
    seatNumber: "C2",
    class: "economy",
    cancel: true,
  },
  // SKYOPS-102: delayed
  {
    flightNumber: "SKYOPS-102",
    passportNumber: "GB3321876",
    seatNumber: "A1",
    class: "first",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-102",
    passportNumber: "IT6643120",
    seatNumber: "C5",
    class: "economy",
    cancel: false,
  },
  // SKYOPS-103: cancelled flight
  {
    flightNumber: "SKYOPS-103",
    passportNumber: "ES2210984",
    seatNumber: "C1",
    class: "economy",
    cancel: true,
  },
  // SKYOPS-104: landed flight
  {
    flightNumber: "SKYOPS-104",
    passportNumber: "CA7712093",
    seatNumber: "B2",
    class: "business",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-104",
    passportNumber: "MA1198764",
    seatNumber: "C3",
    class: "economy",
    cancel: false,
  },
  // SKYOPS-105: fully booked
  {
    flightNumber: "SKYOPS-105",
    passportNumber: "DE7731902",
    seatNumber: "A1",
    class: "first",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-105",
    passportNumber: "TN4408231",
    seatNumber: "C1",
    class: "economy",
    cancel: false,
  },
  {
    flightNumber: "SKYOPS-105",
    passportNumber: "FR5520917",
    seatNumber: "C2",
    class: "economy",
    cancel: false,
  },
  // SKYOPS-108
  {
    flightNumber: "SKYOPS-108",
    passportNumber: "MA1198764",
    seatNumber: "A1",
    class: "first",
    cancel: false,
  },
];

const seed = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("seed must not run in production");
  }

  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  await TicketModel.deleteMany({});
  await FlightModel.deleteMany({});
  await PassengerModel.deleteMany({});
  console.log("Old data deleted");

  // ids of the created documents, found by flight number and passport number
  const flightIds: Record<string, string> = {};
  const passengerIds: Record<string, string> = {};

  for (const flight of flightsData) {
    const created = await createFlightService(flight); // NOSONAR sequential on purpose
    flightIds[flight.flightNumber] = created._id.toString();
  }

  for (const passenger of passengersData) {
    const created = await createPassengerService(passenger); // NOSONAR sequential on purpose
    passengerIds[passenger.passportNumber] = created._id.toString();
  }

  // SKYOPS-106: 9 passengers, 9 economy seats, one each
  for (let i = 0; i < 9; i++) {
    ticketsData.push({
      flightNumber: "SKYOPS-106",
      passportNumber: passengersData[i].passportNumber,
      seatNumber: "C" + (i + 1),
      class: "economy",
      cancel: false,
    });
  }

  for (const item of ticketsData) {
    // NOSONAR sequential on purpose: every booking changes the same flight
    const ticket = await bookTicketService({
      flight: flightIds[item.flightNumber],
      passenger: passengerIds[item.passportNumber],
      seatNumber: item.seatNumber,
      class: item.class,
      status: "confirmed",
    });
    if (item.cancel) {
      await cancelTicketService(ticket._id.toString()); // NOSONAR sequential on purpose
    }
  }
  console.log("Flights, passengers and tickets created");

  // tickets that end up with a deleted flight or a deleted passenger
  const tempFlight = await createFlightService(temporaryFlight);
  const tempPassenger = await createPassengerService(temporaryPassenger);

  await bookTicketService({
    flight: tempFlight._id.toString(),
    passenger: passengerIds["DE7731902"],
    seatNumber: "B1",
    class: "business",
    status: "confirmed",
  });
  await bookTicketService({
    flight: flightIds["SKYOPS-108"],
    passenger: tempPassenger._id.toString(),
    seatNumber: "C1",
    class: "economy",
    status: "confirmed",
  });

  await deleteFlightService(temporaryFlight.flightNumber);
  await deletePassengerService(temporaryPassenger.passportNumber);
  console.log("Deleted flight and deleted passenger tickets created");
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
