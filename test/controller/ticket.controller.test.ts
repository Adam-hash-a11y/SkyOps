/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../app";
import * as ticketService from "../../src/service/ticketService";
import * as flightRepository from "../../src/repository/flight.repository";

jest.mock("../../src/service/ticketService");
jest.mock("../../src/repository/flight.repository");

const mockedBookTicket = jest.mocked(ticketService.bookTicketService);
const mockedGetTickets = jest.mocked(ticketService.getTicketsService);
const mockedGetTicketById = jest.mocked(ticketService.getTicketByIdService);
const mockedCancelTicket = jest.mocked(ticketService.cancelTicketService);
const mockedFindFlightById = jest.mocked(flightRepository.findFlightById);

const validTicket = {
  flight: "6a19aa7c02eacf3878cca9cd",
  passenger: "6a19aa9702eacf3878cca9ce",
  seatNumber: "C12",
  class: "economy",
};

const mockFlight = {
  economySeats: [{ seat: "C12", availability: true }],
  businessSeats: [],
  firstSeats: [],
};
const token = jwt.sign({}, process.env.JWT_SECRET as string);

describe("POST /api/tickets", () => {
  afterEach(() => jest.clearAllMocks());

  it("should book a ticket and return 201", async () => {
    // Given
    mockedFindFlightById.mockResolvedValue(mockFlight as any);
    mockedBookTicket.mockResolvedValue(validTicket as any);

    // When
    const res = await request(app)
      .post("/api/tickets")
      .send(validTicket)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(201);
  });

  it("should return 400 for invalid body", async () => {
    // Given
    const badBody = { flight: 123 };

    // When
    const res = await request(app)
      .post("/api/tickets")
      .send(badBody)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(400);
  });

  it("should return 400 when the client sends a price", async () => {
    // Given
    const body = { ...validTicket, price: 1 };

    // When
    const res = await request(app)
      .post("/api/tickets")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("invalid or missing fields");
  });

  it("should return 400 when the seat letter does not match the class", async () => {
    // Given
    const body = { ...validTicket, seatNumber: "A1" };

    // When
    const res = await request(app)
      .post("/api/tickets")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(400);
  });

  it("should return 400 when the seat does not exist in this class", async () => {
    // Given
    mockedFindFlightById.mockResolvedValue(mockFlight as any);
    const body = { ...validTicket, seatNumber: "C99" };

    // When
    const res = await request(app)
      .post("/api/tickets")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("seat does not exist in this class");
  });

  it("should return 404 when the flight does not exist", async () => {
    // Given
    mockedFindFlightById.mockResolvedValue(null);

    // When
    const res = await request(app)
      .post("/api/tickets")
      .send(validTicket)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("flight not found");
  });
});

describe("GET /api/tickets", () => {
  it("should return all tickets", async () => {
    // Given
    mockedGetTickets.mockResolvedValue([validTicket] as any);

    // When
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(200);
    expect(res.body.tickets).toBeDefined();
  });
});

describe("GET /api/tickets/:id", () => {
  it("should return ticket", async () => {
    // Given
    mockedGetTicketById.mockResolvedValue(validTicket as any);

    // When
    const res = await request(app)
      .get("/api/tickets/6a19aac202eacf3878cca9cf")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(200);
  });

  it("should return 404 when not found", async () => {
    // Given
    mockedGetTicketById.mockResolvedValue(null);

    // When
    const res = await request(app)
      .get("/api/tickets/6a19aac202eacf3878cca9cf")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/tickets/:id", () => {
  it("should cancel ticket", async () => {
    // Given
    mockedCancelTicket.mockResolvedValue({
      ...validTicket,
      status: "cancelled",
    } as any);

    // When
    const res = await request(app)
      .patch("/api/tickets/6a19aac202eacf3878cca9cf")
      .send({ status: "cancelled" })
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(200);
  });

  it("should return 400 for invalid id", async () => {
    // Given
    const invalidId = "invalid";

    // When
    const res = await request(app)
      .patch(`/api/tickets/${invalidId}`)
      .send({ status: "cancelled" })
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(res.status).toBe(400);
  });
});
