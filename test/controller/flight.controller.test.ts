/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import { app } from "../../app";
import * as flightService from "../../src/service/flightService";

jest.mock("../../src/service/flightService");

const mockedCreateFlightService = jest.mocked(
  flightService.createFlightService,
);

const validBody = {
  flightNumber: "SKYOPS-101",
  airline: "Lufthansa",
  route: { origin: "TUN", destination: "FRA" },
  schedule: {
    departureTime: new Date("2026-06-01T08:00:00"),
    arrivalTime: new Date("2026-06-01T11:00:00"),
  },
  status: "scheduled",
  seats: { total: 180, booked: 0 },
};

describe("POST /api/flights", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a flight and return 201", async () => {
    // Given
    mockedCreateFlightService.mockResolvedValue(validBody as any);

    // When
    const result = await request(app).post("/api/flights").send(validBody);

    // Then
    expect(result.status).toBe(201);
  });

  it("should return 409 for duplicate flight number", async () => {
    // Given
    mockedCreateFlightService.mockRejectedValue(
      new Error("flight number already exists"),
    );

    // When
    const result = await request(app).post("/api/flights").send(validBody);

    // Then
    expect(result.status).toBe(409);
    expect(result.body.message).toBe("flight number already exists");
  });

  it("should return 400 for invalid body", async () => {
    // Given
    const body = { ...validBody, flightNumber: 123 };

    // When
    const result = await request(app).post("/api/flights").send(body);

    // Then
    expect(result.status).toBe(400);
  });

  it("should return 400 when departure is after arrival", async () => {
    // Given
    const body = {
      ...validBody,
      schedule: {
        departureTime: "2026-06-01 11:00",
        arrivalTime: "2026-06-01 08:00",
      },
    };

    // When
    const result = await request(app).post("/api/flights").send(body);

    // Then
    expect(result.status).toBe(400);
  });

  it("should return 400 when origin equals destination", async () => {
    // Given
    const body = {
      ...validBody,
      route: { origin: "TUN", destination: "TUN" },
    };

    // When
    const result = await request(app).post("/api/flights").send(body);

    // Then
    expect(result.status).toBe(400);
  });
});
