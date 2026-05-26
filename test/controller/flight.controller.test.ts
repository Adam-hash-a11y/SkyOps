/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import { app } from "../../app";
import * as flightService from "../../src/service/flightService";

jest.mock("../../src/service/flightService");

const mockedCreateFlightService = jest.mocked(
  flightService.createFlightService,
);
const mockedGetFlightsByFilters = jest.mocked(
  flightService.getFlightsByFilters,
);
const mockedGetFlightByFlightNumber = jest.mocked(
  flightService.getFlightByFlightNumber,
);
const mockedUpdateFlightService = jest.mocked(
  flightService.updateFlightService,
);
const mockedDeleteFlightService = jest.mocked(
  flightService.deleteFlightService,
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
describe("GET /api/flights", () => {
  it("should return all flights", async () => {
    // Given
    const mockFlights = [{ flightNumber: "SKYOPS-101" }];
    mockedGetFlightsByFilters.mockResolvedValue(mockFlights as any);

    // When
    const result = await request(app).get("/api/flights");

    // Then
    expect(result.status).toBe(200);
    expect(result.body.flights).toBeDefined();
  });

  it("should return 400 for invalid query param", async () => {
    // When
    const result = await request(app).get("/api/flights?unknown=value");

    // Then
    expect(result.status).toBe(400);
  });
});

describe("GET /api/flights/:flightNumber", () => {
  it("should return a flight when found", async () => {
    // Given
    const mockFlight = { flightNumber: "SKYOPS-101" };
    mockedGetFlightByFlightNumber.mockResolvedValue(mockFlight as any);

    // When
    const result = await request(app).get("/api/flights/SKYOPS-101");

    // Then
    expect(result.status).toBe(200);
  });

  it("should return 404 when flight not found", async () => {
    // Given
    mockedGetFlightByFlightNumber.mockResolvedValue(null);

    // When
    const result = await request(app).get("/api/flights/SKYOPS-999");

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("flight not found");
  });
});

describe("PATCH /api/flights/:flightNumber", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a flight and return 200", async () => {
    // Given
    const mockFlight = { flightNumber: "SKYOPS-101", status: "delayed" };
    mockedUpdateFlightService.mockResolvedValue(mockFlight as any);

    // When
    const result = await request(app)
      .patch("/api/flights/SKYOPS-101")
      .send({ status: "delayed" });

    // Then
    expect(result.status).toBe(200);
    expect(result.body.flight).toBeDefined();
  });

  it("should return 404 when flight not found", async () => {
    // Given
    mockedUpdateFlightService.mockResolvedValue(null);

    // When
    const result = await request(app)
      .patch("/api/flights/SKYOPS-999")
      .send({ status: "delayed" });

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("flight not found");
  });

  it("should return 400 for invalid body", async () => {
    // When
    const result = await request(app)
      .patch("/api/flights/SKYOPS-101")
      .send({ flightNumber: "SKYOPS-999" });

    // Then
    expect(result.status).toBe(400);
  });
});

describe("DELETE /api/flights/:flightNumber", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a flight and return 200", async () => {
    // Given
    const mockFlight = { flightNumber: "SKYOPS-101" };
    mockedDeleteFlightService.mockResolvedValue(mockFlight as any);

    // When
    const result = await request(app).delete("/api/flights/SKYOPS-101");

    // Then
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("flight deleted successfully");
  });

  it("should return 404 when flight not found", async () => {
    // Given
    mockedDeleteFlightService.mockResolvedValue(null);

    // When
    const result = await request(app).delete("/api/flights/SKYOPS-999");

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("flight not found");
  });

  it("should return 400 for invalid flight number", async () => {
    // When
    const result = await request(app).delete("/api/flights/INVALID");

    // Then
    expect(result.status).toBe(400);
  });
});
