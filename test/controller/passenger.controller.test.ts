/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import { app } from "../../app";
import * as passengerService from "../../src/service/passengerService";

jest.mock("../../src/service/passengerService");

const mockedCreatePassengerService = jest.mocked(
  passengerService.createPassengerService,
);
const mockedGetPassengerByPassportNumberService = jest.mocked(
  passengerService.getPassengerByPassportNumberService,
);
const mockedDeletePassengerService = jest.mocked(
  passengerService.deletePassengerService,
);

const validBody = {
  firstName: "Adam",
  lastName: "Hamdi",
  passportNumber: "TN123456",
  nationality: "TN",
  dateOfBirth: new Date("1995-03-15"),
  email: "adam.hamdi@email.com",
  phoneNumber: "21656532009",
};

describe("POST /api/passengers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a passenger and return 201", async () => {
    // Given
    mockedCreatePassengerService.mockResolvedValue(validBody as any);

    // When
    const result = await request(app).post("/api/passengers").send(validBody);

    // Then
    expect(result.status).toBe(201);
  });

  it("should return 409 if passenger passport already exists", async () => {
    // Given
    mockedCreatePassengerService.mockRejectedValue(
      new Error("Passenger already exists"),
    );

    // When
    const result = await request(app).post("/api/passengers").send(validBody);

    // Then
    expect(result.status).toBe(409);
    expect(result.body.message).toBe("Passenger already exists");
  });

  it("should return 409 if passenger email already exists", async () => {
    // Given
    mockedCreatePassengerService.mockRejectedValue(
      new Error("email already exists"),
    );

    // When
    const result = await request(app).post("/api/passengers").send(validBody);

    // Then
    expect(result.status).toBe(409);
    expect(result.body.message).toBe("email already exists");
  });

  it("should return 400 for invalid firstName", async () => {
    // Given
    const body = { ...validBody, firstName: 123 };

    // When
    const result = await request(app).post("/api/passengers").send(body);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "first name must contain only letters and be at least 3 characters",
    );
  });
  it("should return 400 for invalid lastName", async () => {
    // Given
    const body = { ...validBody, lastName: 123 };

    // When
    const result = await request(app).post("/api/passengers").send(body);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "last name must contain only letters and be at least 3 characters",
    );
  });
  it("should return 400 for invalid passportNumber", async () => {
    // Given
    const body = { ...validBody, passportNumber: "TN11" };

    // When
    const result = await request(app).post("/api/passengers").send(body);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "passport number must be at least 6 characters",
    );
  });
  it("should return 400 for invalid Nationality", async () => {
    // Given
    const body = { ...validBody, nationality: "TN11" };

    // When
    const result = await request(app).post("/api/passengers").send(body);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "Nationality must be 2 uppercase letters and valid ISO country code",
    );
  });
  it("should return 400 for invalid dateOfBirth", async () => {
    // Given
    const body = { ...validBody, dateOfBirth: "2090-05-27" };

    // When
    const result = await request(app).post("/api/passengers").send(body);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe("date of birth must be a valid past date");
  });
  it("should return 400 for invalid phoneNumber", async () => {
    // Given
    const body = { ...validBody, phoneNumber: "abc867453" };

    // When
    const result = await request(app).post("/api/passengers").send(body);

    // Then
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "phone number must be a valid mobile number",
    );
  });
});

describe("GET /api/passengers/:passportNumber", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return a passenger when found", async () => {
    // Given
    const mockPassenger = { passportNumber: "TN9875434" };
    mockedGetPassengerByPassportNumberService.mockResolvedValue(
      mockPassenger as any,
    );

    // When
    const result = await request(app).get("/api/passengers/TN9875434");

    // Then
    expect(result.status).toBe(200);
  });
  it("should return 404 when passenger not found", async () => {
    //Given
    mockedGetPassengerByPassportNumberService.mockResolvedValue(null);

    //When
    const result = await request(app).get("/api/passengers/TNodfugdo6784");

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("passenger not found");
  });
});

describe("DELETE /api/passengers/:passportNumber", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should delete a passenger and return 200", async () => {
    // Given
    const mockPassenger = { passportNumber: "TN9875434" };
    mockedDeletePassengerService.mockResolvedValue(mockPassenger as any);

    // When
    const result = await request(app).delete("/api/passengers/TN9875434");

    // Then
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("passenger deleted successfully");
  });
  it("should return 404 when passenger not found", async () => {
    //Given
    mockedDeletePassengerService.mockResolvedValue(null);

    //When
    const result = await request(app).delete("/api/passengers/TNodfugdo6784");

    // Then
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("passenger not found");
  });
});
