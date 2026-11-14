/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  bookTicketService,
  cancelTicketService,
  getTicketsService,
  getTicketByIdService,
  bookBatchService,
} from "../../src/service/ticketService";

import * as ticketRepo from "../../src/repository/ticket.repository";
import * as flightRepo from "../../src/repository/flight.repository";
import { FlightModel } from "../../src/model/flight.model";
import { PassengerModel } from "../../src/model/passenger.model";

jest.mock("../../src/repository/ticket.repository");
jest.mock("../../src/model/flight.model");
jest.mock("../../src/model/passenger.model");
jest.mock("../../src/repository/flight.repository");

const mockFlight = {
  _id: "flight1",
  firstSeats: [{ seat: "A1", availability: true }],
  businessSeats: [{ seat: "B1", availability: true }],
  economySeats: [
    { seat: "C1", availability: true },
    { seat: "C2", availability: false },
  ],
  save: jest.fn(),
};

const mockPassenger = { _id: "pass1" };

describe("bookTicketService", () => {
  beforeEach(() => {
    mockFlight.economySeats[0].availability = true;
    mockFlight.economySeats[1].availability = false;
  });

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
      seatNumber: "C1",
      class: "economy",
    };

    // When
    const result = await bookTicketService(data as any);

    // Then
    expect(result).toBeDefined();
    expect(ticketRepo.saveTicket).toHaveBeenCalledWith({
      ...data,
      price: 200,
    });
  });

  it("should set the seat availability to false and save the flight", async () => {
    // Given
    (FlightModel.findById as jest.Mock).mockResolvedValue(mockFlight);
    (PassengerModel.findById as jest.Mock).mockResolvedValue(mockPassenger);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);
    (ticketRepo.saveTicket as jest.Mock).mockResolvedValue({ id: "ticket1" });

    const data = {
      flight: "flight1",
      passenger: "pass1",
      seatNumber: "C1",
      class: "economy",
    };

    // When
    await bookTicketService(data as any);

    // Then
    expect(mockFlight.economySeats[0].availability).toBe(false);
    expect(mockFlight.save).toHaveBeenCalled();
  });

  it("should throw when seat is already booked", async () => {
    // Given
    (FlightModel.findById as jest.Mock).mockResolvedValue(mockFlight);
    (PassengerModel.findById as jest.Mock).mockResolvedValue(mockPassenger);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue({
      id: "ticket1",
    });

    const data = {
      flight: "flight1",
      passenger: "pass1",
      seatNumber: "C1",
      class: "economy",
    };

    // When + Then
    await expect(bookTicketService(data as any)).rejects.toThrow(
      "seat already booked on this flight",
    );
  });

  it("should throw when seat does not exist in this class", async () => {
    // Given
    (FlightModel.findById as jest.Mock).mockResolvedValue(mockFlight);
    (PassengerModel.findById as jest.Mock).mockResolvedValue(mockPassenger);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);

    const data = {
      flight: "flight1",
      passenger: "pass1",
      seatNumber: "C99",
      class: "economy",
    };

    // When + Then
    await expect(bookTicketService(data as any)).rejects.toThrow(
      "seat does not exist in this class",
    );
  });

  it("should throw when seat is not available", async () => {
    // Given
    (FlightModel.findById as jest.Mock).mockResolvedValue(mockFlight);
    (PassengerModel.findById as jest.Mock).mockResolvedValue(mockPassenger);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);

    const data = {
      flight: "flight1",
      passenger: "pass1",
      seatNumber: "C2",
      class: "economy",
    };

    // When + Then
    await expect(bookTicketService(data as any)).rejects.toThrow(
      "seat is not available",
    );
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

describe("bookBatchService", () => {
  afterEach(() => jest.clearAllMocks());

  it("should throw when flight not found", async () => {
    // Given
    (flightRepo.findFlightById as jest.Mock).mockResolvedValue(null);

    const data = { flight: "x", tickets: [] };

    // When + Then
    await expect(bookBatchService(data as any)).rejects.toThrow(
      "flight not found",
    );
  });

  it("should throw when a seat is already booked", async () => {
    // Given
    (flightRepo.findFlightById as jest.Mock).mockResolvedValue(mockFlight);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue({
      id: "ticket1",
    });

    const data = {
      flight: "flight1",
      tickets: [{ passenger: "pass1", seatNumber: "C1", class: "economy" }],
    };

    // When + Then
    await expect(bookBatchService(data as any)).rejects.toThrow(
      "seat C1 already booked on this flight",
    );
  });

  it("should throw when a seat does not exist in this class", async () => {
    // Given
    (flightRepo.findFlightById as jest.Mock).mockResolvedValue(mockFlight);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);

    const data = {
      flight: "flight1",
      tickets: [{ passenger: "pass1", seatNumber: "C99", class: "economy" }],
    };

    // When + Then
    await expect(bookBatchService(data as any)).rejects.toThrow(
      "seat does not exist in this class",
    );
  });

  it("should throw when a seat is not available", async () => {
    // Given
    (flightRepo.findFlightById as jest.Mock).mockResolvedValue(mockFlight);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);

    const data = {
      flight: "flight1",
      tickets: [{ passenger: "pass1", seatNumber: "C2", class: "economy" }],
    };

    // When + Then
    await expect(bookBatchService(data as any)).rejects.toThrow(
      "seat C2 is not available",
    );
  });

  it("should save nothing when one seat of the batch is bad", async () => {
    // Given
    (flightRepo.findFlightById as jest.Mock).mockResolvedValue(mockFlight);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "ticket1" });

    const data = {
      flight: "flight1",
      tickets: [
        { passenger: "pass1", seatNumber: "A1", class: "first" },
        { passenger: "pass2", seatNumber: "C1", class: "economy" },
      ],
    };

    // When + Then
    await expect(bookBatchService(data as any)).rejects.toThrow(
      "seat C1 already booked on this flight",
    );
    expect(ticketRepo.saveTicket).not.toHaveBeenCalled();
  });

  it("should book all seats with the price of their class", async () => {
    // Given
    (flightRepo.findFlightById as jest.Mock).mockResolvedValue(mockFlight);
    (ticketRepo.findTicketByFlightAndSeat as jest.Mock).mockResolvedValue(null);
    (ticketRepo.saveTicket as jest.Mock).mockResolvedValue({ id: "ticket1" });

    const data = {
      flight: "flight1",
      tickets: [
        { passenger: "pass1", seatNumber: "A1", class: "first" },
        { passenger: "pass2", seatNumber: "B1", class: "business" },
        { passenger: "pass3", seatNumber: "C1", class: "economy" },
      ],
    };

    // When
    const result = await bookBatchService(data as any);

    // Then
    expect(result).toHaveLength(3);
    expect(ticketRepo.saveTicket).toHaveBeenCalledTimes(3);
    expect(ticketRepo.saveTicket).toHaveBeenCalledWith({
      flight: "flight1",
      passenger: "pass1",
      seatNumber: "A1",
      class: "first",
      price: 900,
      status: "confirmed",
    });
    expect(ticketRepo.saveTicket).toHaveBeenCalledWith({
      flight: "flight1",
      passenger: "pass2",
      seatNumber: "B1",
      class: "business",
      price: 500,
      status: "confirmed",
    });
    expect(ticketRepo.saveTicket).toHaveBeenCalledWith({
      flight: "flight1",
      passenger: "pass3",
      seatNumber: "C1",
      class: "economy",
      price: 200,
      status: "confirmed",
    });
    expect(mockFlight.firstSeats[0].availability).toBe(false);
    expect(mockFlight.businessSeats[0].availability).toBe(false);
    expect(mockFlight.economySeats[0].availability).toBe(false);
    expect(mockFlight.save).toHaveBeenCalled();
  });
});
