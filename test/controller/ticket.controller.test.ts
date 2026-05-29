/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../app";
import * as ticketService from "../../src/service/ticketService";

jest.mock("../../src/service/ticketService");

const mockedBookTicket = jest.mocked(ticketService.bookTicketService);
const mockedGetTickets = jest.mocked(ticketService.getTicketsService);
const mockedGetTicketById = jest.mocked(ticketService.getTicketByIdService);
const mockedCancelTicket = jest.mocked(ticketService.cancelTicketService);

const validTicket = {
  flight: "6a19aa7c02eacf3878cca9cd",
  passenger: "6a19aa9702eacf3878cca9ce",
  seatNumber: "A12",
  class: "economy",
  price: 120,
};
const token = jwt.sign({}, process.env.JWT_SECRET as string);

describe("POST /api/tickets", () => {
  afterEach(() => jest.clearAllMocks());

  it("should book a ticket and return 201", async () => {
    // Given
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
