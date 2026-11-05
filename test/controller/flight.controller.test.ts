/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import jwt from "jsonwebtoken";
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
const mockedGetFreeSeatsService = jest.mocked(
  flightService.getFreeSeatsService,
); // NEW

const validBody = {
  flightNumber: "SKYOPS-101",
  airline: "Lufthansa",
  route: { origin: "TUN", destination: "FRA" },
  schedule: {
    departureTime: new Date("2026-06-01T08:00:00"),
    arrivalTime: new Date("2026-06-01T11:00:00"),
  },
  status: "scheduled",
  firstSeats: 2,
  businessSeats: 0,
  economySeats: 3,
};
const token = jwt.sign({}, process.env.JWT_SECRET as string);

describe("POST /api/flights", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a flight and return 201", async () => {
    // Given
    mockedCreateFlightService.mockResolvedValue(validBody as any);

    // When
    const result = await request(app)
      .post("/api/flights")
      .send(validBody)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(201);
  });

  it("should return 409 for duplicate flight number", async () => {
    // Given
    mockedCreateFlightService.mockRejectedValue(
      new Error("flight number already exists"),
    );

    // When
    const result = await request(app)
      .post("/api/flights")
      .send(validBody)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(409);
    expect(result.body.message).toBe("flight number already exists");
  });

  it("should return 400 for invalid body", async () => {
    // Given
    const body = { ...validBody, flightNumber: 123 };

    // When
    const result = await request(app)
      .post("/api/flights")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

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
    const result = await request(app)
      .post("/api/flights")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

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
    const result = await request(app)
      .post("/api/flights")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(400);
  });

  it("should return 400 when all seat counts are 0", async () => {
    // Given
    const body = {
      ...validBody,
      firstSeats: 0,
      businessSeats: 0,
      economySeats: 0,
    };

    // When
    const result = await request(app)
      .post("/api/flights")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(400);
  });

  it("should return 400 when a seat count is above 500", async () => {
    // Given
    const body = { ...validBody, economySeats: 501 };

    // When
    const result = await request(app)
      .post("/api/flights")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

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
    const result = await request(app)
      .get("/api/flights")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(200);
    expect(result.body.flights).toBeDefined();
  });

  it("should return 400 for invalid query param", async () => {
    // When
    const result = await request(app)
      .get("/api/flights?unknown=value")
      .set("Authorization", `Bearer ${token}`);

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
    const result = await request(app)
      .get("/api/flights/SKYOPS-101")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(200);
  });

  it("should return 404 when flight not found", async () => {
    // Given
    mockedGetFlightByFlightNumber.mockResolvedValue(null);

    // When
    const result = await request(app)
      .get("/api/flights/SKYOPS-999")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("flight not found");
  });
});

describe("GET /api/flights/:flightNumber/seats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the free seats and return 200", async () => {
    // Given
    const mockSeats = {
      seats: [{ seat: "A1", class: "first" }],
      counts: { first: 1, business: 0, economy: 0 },
    };
    mockedGetFreeSeatsService.mockResolvedValue(mockSeats);

    // When
    const result = await request(app)
      .get("/api/flights/SKYOPS-101/seats")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(200);
    expect(result.body.seats).toBeDefined();
    expect(result.body.counts).toBeDefined();
  });

  it("should pass the class filter to the service", async () => {
    // Given
    mockedGetFreeSeatsService.mockResolvedValue({
      seats: [],
      counts: { first: 0, business: 0, economy: 0 },
    });

    // When
    const result = await request(app)
      .get("/api/flights/SKYOPS-101/seats?class=first")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(200);
    expect(mockedGetFreeSeatsService).toHaveBeenCalledWith(
      "SKYOPS-101",
      "first",
    );
  });

  it("should return 400 for an invalid class", async () => {
    // When
    const result = await request(app)
      .get("/api/flights/SKYOPS-101/seats?class=test")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "class must be first, business or economy",
    );
  });

  it("should return 400 for an invalid flight number", async () => {
    // When
    const result = await request(app)
      .get("/api/flights/test/seats")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(400);
  });

  it("should return 404 when flight not found", async () => {
    // Given
    mockedGetFreeSeatsService.mockResolvedValue(null);

    // When
    const result = await request(app)
      .get("/api/flights/SKYOPS-999/seats")
      .set("Authorization", `Bearer ${token}`);

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
      .send({ status: "delayed" })
      .set("Authorization", `Bearer ${token}`);

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
      .send({ status: "delayed" })
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("flight not found");
  });

  it("should return 400 for invalid body", async () => {
    // When
    const result = await request(app)
      .patch("/api/flights/SKYOPS-101")
      .send({ flightNumber: "SKYOPS-999" })
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(400);
  });

  it("should return 400 when a seat field is in the body", async () => {
    // When
    const result = await request(app)
      .patch("/api/flights/SKYOPS-101")
      .send({ firstSeats: 5 })
      .set("Authorization", `Bearer ${token}`);

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
    const result = await request(app)
      .delete("/api/flights/SKYOPS-101")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("flight deleted successfully");
  });

  it("should return 404 when flight not found", async () => {
    // Given
    mockedDeleteFlightService.mockResolvedValue(null);

    // When
    const result = await request(app)
      .delete("/api/flights/SKYOPS-999")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("flight not found");
  });

  it("should return 400 for invalid flight number", async () => {
    // When
    const result = await request(app)
      .delete("/api/flights/INVALID")
      .set("Authorization", `Bearer ${token}`);

    // Then
    expect(result.status).toBe(400);
  });
});
