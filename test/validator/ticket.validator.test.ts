/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  isValidTicketBody,
  isValidSeatNumber,
  isValidTicketClass,
  isValidTicketPrice,
  isValidTicketQuery,
  isValidTicketId,
} from "../../src/validator/ticket.validator";

describe("test isValidTicketBody validator function", () => {
  it("should return true for valid ticket body", () => {
    // Given
    const body = {
      flight: "664f1c2a9b1c2d3e4f5a6b7c",
      passenger: "664f1c2a9b1c2d3e4f5a6b8d",
      seatNumber: "A12",
      class: "economy",
      price: 120,
    };

    // When
    const result = isValidTicketBody(body as any);

    // Then
    expect(result).toBe(true);
  });

  it("should return false when extra field exists", () => {
    // Given
    const body = {
      flight: "664f1c2a9b1c2d3e4f5a6b7c",
      passenger: "664f1c2a9b1c2d3e4f5a6b8d",
      seatNumber: "A12",
      class: "economy",
      price: 120,
      status: "confirmed",
    };

    // When
    const result = isValidTicketBody(body as any);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when missing required field", () => {
    // Given
    const body = {
      flight: "664f1c2a9b1c2d3e4f5a6b7c",
      seatNumber: "A12",
      class: "economy",
      price: 120,
    };

    // When
    const result = isValidTicketBody(body as any);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidSeatNumber validator function", () => {
  it("should return true for valid seat number", () => {
    // Given
    const seat = "A12";

    // When
    const result = isValidSeatNumber(seat);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid format", () => {
    // Given
    const seat = "12A";

    // When
    const result = isValidSeatNumber(seat);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for wrong type", () => {
    // Given
    const seat = 123;

    // When
    const result = isValidSeatNumber(seat as any);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidTicketClass validator function", () => {
  it("should return true for economy", () => {
    // Given
    const cls = "economy";

    // When
    const result = isValidTicketClass(cls);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid class", () => {
    // Given
    const cls = "vip";

    // When
    const result = isValidTicketClass(cls as any);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidTicketPrice validator function", () => {
  it("should return true for valid price", () => {
    // Given
    const price = 120;

    // When
    const result = isValidTicketPrice(price);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for negative price", () => {
    // Given
    const price = -50;

    // When
    const result = isValidTicketPrice(price);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for wrong type", () => {
    // Given
    const price = "120";

    // When
    const result = isValidTicketPrice(price as any);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidTicketQuery validator function", () => {
  it("should return true for valid query", () => {
    // Given
    const query = { flightId: "abc", passengerId: "xyz" };

    // When
    const result = isValidTicketQuery(query);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid query key", () => {
    // Given
    const query = { status: "confirmed" };

    // When
    const result = isValidTicketQuery(query);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidTicketId validator function", () => {
  it("should return true for valid mongo id", () => {
    // Given
    const id = "664f1c2a9b1c2d3e4f5a6b7c";

    // When
    const result = isValidTicketId(id);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid id", () => {
    // Given
    const id = "123";

    // When
    const result = isValidTicketId(id);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for non-string id", () => {
    // Given
    const id = 123;

    // When
    const result = isValidTicketId(id as any);

    // Then
    expect(result).toBe(false);
  });
});
