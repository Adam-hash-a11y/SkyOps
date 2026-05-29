/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  bookTicketService,
  cancelTicketService,
  getTicketsService,
  getTicketByIdService,
} from "../../src/service/ticketService";

import * as ticketRepo from "../../src/repository/ticket.repository";
import { FlightModel } from "../../src/model/flight.model";
import { PassengerModel } from "../../src/model/passenger.model";

jest.mock("../../src/repository/ticket.repository");
jest.mock("../../src/model/flight.model");
jest.mock("../../src/model/passenger.model");

const mockFlight = {
  _id: "flight1",
  seats: { total: 100, booked: 10 },
};

const mockPassenger = { _id: "pass1" };

describe("bookTicketService", () => {
  afterEach(() => jest.clearAllMocks());

  it("should book ticket successfully", async () => {
    // Given
    (FlightModel.findById as jest.Mock).mockResolvedValue(mockFlight);
    (PassengerModel.findById as jest.Mock).mockResolvedValue(mockPassenger);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);
    (ticketRepo.saveTicket as jest.Mock).mockResolvedValue({ id: "ticket1" });

    const data = {
      flight: "flight1",
      passenger: "pass1",
      seatNumber: "A1",
      class: "economy",
      price: 100,
    };

    // When
    const result = await bookTicketService(data as any);

    // Then
    expect(result).toBeDefined();
  });

  it("should throw when flight not found", async () => {
    // Given
    (FlightModel.findById as jest.Mock).mockResolvedValue(null);

    const data = { flight: "x" };

    // When + Then
    await expect(bookTicketService(data as any)).rejects.toThrow(
      "flight not found",
    );
  });
});

describe("cancelTicketService", () => {
  afterEach(() => jest.clearAllMocks());

  it("should cancel ticket successfully", async () => {
    // Given
    (ticketRepo.findTicketById as jest.Mock).mockResolvedValue({
      flight: "flight1",
      status: "confirmed",
    });

    (ticketRepo.cancelTicketById as jest.Mock).mockResolvedValue({
      status: "cancelled",
    });

    // When
    const result = await cancelTicketService("id1");

    // Then
    expect(result).toBeDefined();
  });

  it("should throw if ticket already cancelled", async () => {
    // Given
    (ticketRepo.findTicketById as jest.Mock).mockResolvedValue({
      status: "cancelled",
    });

    // When + Then
    await expect(cancelTicketService("id1")).rejects.toThrow(
      "ticket already cancelled",
    );
  });
});

describe("getTicketsService", () => {
  it("should return passenger tickets", async () => {
    // Given
    (ticketRepo.findTicketsByPassenger as jest.Mock).mockResolvedValue([]);

    // When
    const result = await getTicketsService({ passengerId: "pass1" });

    // Then
    expect(result).toEqual([]);
  });

  it("should return flight tickets", async () => {
    // Given
    (ticketRepo.findTicketsByFlight as jest.Mock).mockResolvedValue([]);

    // When
    const result = await getTicketsService({ flightId: "flight1" });

    // Then
    expect(result).toEqual([]);
  });
});

describe("getTicketByIdService", () => {
  it("should return ticket", async () => {
    // Given
    (ticketRepo.findTicketById as jest.Mock).mockResolvedValue({ id: "t1" });

    // When
    const result = await getTicketByIdService("id1");

    // Then
    expect(result).toBeDefined();
  });
});
