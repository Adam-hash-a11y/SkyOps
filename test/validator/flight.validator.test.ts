import { FlightStatus } from "../../src/types/flight.types";
import {
  isValidFlightNumber,
  isValidAirline,
  isValidOriginDestination,
  isValidDepartureArrival,
  isValidStatus,
  isValidSeats,
} from "../../src/validator/flight.validator";

describe("test isValidFlightNumber validator function", () => {
  it("should return true for valid flight number", () => {
    // Given
    const flightNumber = "SKYOPS-101";

    // When
    const result = isValidFlightNumber(flightNumber);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for a number", () => {
    // Given
    const flightNumber = 123;

    // When
    const result = isValidFlightNumber(flightNumber);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when not starting with SKYOPS-", () => {
    // Given
    const flightNumber = "TUN-101";

    // When
    const result = isValidFlightNumber(flightNumber);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidAirline validator function", () => {
  it("should return true for valid airline name", () => {
    // Given
    const airline = "Lufthansa";

    // When
    const result = isValidAirline(airline);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for a number", () => {
    // Given
    const airline = 1;

    // When
    const result = isValidAirline(airline);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for less than 5 characters", () => {
    // Given
    const airline = "Air";

    // When
    const result = isValidAirline(airline);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidOriginDestination validator", () => {
  it("should return true for valid route", () => {
    // Given
    const route = { origin: "TUN", destination: "FRA" };

    // When
    const result = isValidOriginDestination(route);

    // Then
    expect(result).toBe(true);
  });

  it("should return false when origin equals destination", () => {
    // Given
    const route = { origin: "TUN", destination: "TUN" };

    // When
    const result = isValidOriginDestination(route);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when not uppercase", () => {
    // Given
    const route = { origin: "tun", destination: "FRA" };

    // When
    const result = isValidOriginDestination(route);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when not 3 characters", () => {
    // Given
    const route = { origin: "TUNN", destination: "FRA" };

    // When
    const result = isValidOriginDestination(route);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidDepartureArrival validator function", () => {
  it("should return true when departure is before arrival", () => {
    // Given
    const schedule = {
      departureTime: new Date("2026-06-01T08:00:00"),
      arrivalTime: new Date("2026-06-01T11:00:00"),
    };

    // When
    const result = isValidDepartureArrival(schedule);

    // Then
    expect(result).toBe(true);
  });

  it("should return false when departure is after arrival", () => {
    // Given
    const schedule = {
      departureTime: new Date("2026-06-01T11:00:00"),
      arrivalTime: new Date("2026-06-01T08:00:00"),
    };

    // When
    const result = isValidDepartureArrival(schedule);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when departure equals arrival", () => {
    // Given
    const schedule = {
      departureTime: new Date("2026-06-01T08:00:00"),
      arrivalTime: new Date("2026-06-01T08:00:00"),
    };

    // When
    const result = isValidDepartureArrival(schedule);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidStatus validator function", () => {
  it("should return true for scheduled", () => {
    // Given
    const status = "scheduled";

    // When
    const result = isValidStatus(status);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid status", () => {
    // Given
    const status = "flying";

    // When
    const result = isValidStatus(status as unknown as FlightStatus);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidSeats validator function", () => {
  it("should return true for valid seats", () => {
    // Given
    const seats = { total: 180, booked: 0 };

    // When
    const result = isValidSeats(seats);

    // Then
    expect(result).toBe(true);
  });

  it("should return false when booked exceeds total", () => {
    // Given
    const seats = { total: 100, booked: 150 };

    // When
    const result = isValidSeats(seats);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when total is 0", () => {
    // Given
    const seats = { total: 0, booked: 0 };

    // When
    const result = isValidSeats(seats);

    // Then
    expect(result).toBe(false);
  });
});
