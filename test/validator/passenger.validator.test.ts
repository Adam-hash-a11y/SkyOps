/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassengerBody } from "../../src/types/passenger.types";
import {
  isValidEmail,
  isValidPhoneNumber,
  isValidName,
  isValidPassportNumber,
  isValidDateOfBirth,
  isValidPassengerBody,
  isValidNationality,
  isValidPassengerQueryParams,
  isValidSortByFirstname,
  isValidUpdatePassengerBody,
} from "../../src/validator/passenger.validator";

describe("test isValidEmail validator function", () => {
  it("should return true for valid email", () => {
    // Given
    const email = "test@email.com";

    // When
    const result = isValidEmail(email);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid email", () => {
    // Given
    const email = "invalid-email";

    // When
    const result = isValidEmail(email);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidPhoneNumber validator function", () => {
  it("should return true for valid phone number", () => {
    // Given
    const phone = "+21656532009";

    // When
    const result = isValidPhoneNumber(phone);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for invalid phone number", () => {
    // Given
    const phone = "abc123";

    // When
    const result = isValidPhoneNumber(phone);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidName validator function", () => {
  it("should return true for valid name", () => {
    // Given
    const name = "Adam Hamdi";

    // When
    const result = isValidName(name);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for short name", () => {
    // Given
    const name = "Al";

    // When
    const result = isValidName(name);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for numbers in name", () => {
    // Given
    const name = "Adam123";

    // When
    const result = isValidName(name);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidPassportNumber validator function", () => {
  it("should return true for valid passport number", () => {
    // Given
    const passport = "TN123456";

    // When
    const result = isValidPassportNumber(passport);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for short passport number", () => {
    // Given
    const passport = "123";

    // When
    const result = isValidPassportNumber(passport);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidDateOfBirth validator function", () => {
  it("should return true for valid past date", () => {
    // Given
    const dob = "1995-06-01";

    // When
    const result = isValidDateOfBirth(dob);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for future date", () => {
    // Given
    const dob = "2999-01-01";

    // When
    const result = isValidDateOfBirth(dob);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for invalid date", () => {
    // Given
    const dob = "invalid-date";

    // When
    const result = isValidDateOfBirth(dob);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidPassengerBody validator function", () => {
  it("should return true for valid passenger body", () => {
    // Given
    const body = {
      firstName: "Adam",
      lastName: "Hamdi",
      passportNumber: "TN123456",
      nationality: "TN",
      dateOfBirth: new Date("1995-06-01T08:00:00"),
      email: "test@email.com",
      phoneNumber: "+21656532009",
    };

    // When
    const result = isValidPassengerBody(body);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for extra field in body", () => {
    // Given
    const body = {
      firstName: "Adam",
      lastName: "Hamdi",
      passportNumber: "TN123456",
      nationality: "TN",
      dateOfBirth: new Date("1995-06-01T08:00:00"),
      email: "test@email.com",
      phoneNumber: "+21656532009",
      extra: "field",
    };

    // When
    const result = isValidPassengerBody(body);

    // Then
    expect(result).toBe(false);
  });

  it("should return false when required field is missing", () => {
    // Given
    const body = {
      lastName: "Hamdi",
      passportNumber: "TN123456",
      nationality: "TN",
      dateOfBirth: new Date("1995-06-01T08:00:00"),
      email: "test@email.com",
      phoneNumber: "+21656532009",
    } as Partial<PassengerBody>;

    // When
    const result = isValidPassengerBody(body as PassengerBody);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidNationality validator function", () => {
  it("should return true for valid nationality", () => {
    // Given
    const nationality = "TN";

    // When
    const result = isValidNationality(nationality);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for lowercase nationality", () => {
    // Given
    const nationality = "tn";

    // When
    const result = isValidNationality(nationality);

    // Then
    expect(result).toBe(false);
  });

  it("should return false for invalid nationality", () => {
    // Given
    const nationality = "XX";

    // When
    const result = isValidNationality(nationality);

    // Then
    expect(result).toBe(false);
  });
});

describe("test isValidPassengerQueryParams function", () => {
  it("it should return true for valid query params", () => {
    //Given
    const query = { firstName: "Renata", lastName: "Galsc" };

    //When
    const result = isValidPassengerQueryParams(query);

    //Then
    expect(result).toBe(true);
  });
  it("it should return false for invalid query params", () => {
    //Given
    const query = { unknow: "whatever" };

    //When
    const result = isValidPassengerQueryParams(query);

    //Then
    expect(result).toBe(false);
  });
});

describe("test isValidSortByFirstname fucntion", () => {
  it("should return true for firstName", () => {
    //Given
    const sortKey = "firstName";

    //When
    const result = isValidSortByFirstname(sortKey);

    //Then
    expect(result).toBe(true);
  });
  it("should return false for invalid sort key", () => {
    //Given
    const sortKey = "whatever";

    //When
    const result = isValidSortByFirstname(sortKey);

    //Then
    expect(result).toBe(false);
  });

  it("should return false if sort key is not of type string", () => {
    //Given
    const sortKey = 123 as unknown as string;

    //When
    const result = isValidSortByFirstname(sortKey);

    //Then
    expect(result).toBe(false);
  });
});

describe("test isValidUpdatePassengerBody validator function", () => {
  it("should return true for valid update body", () => {
    // Given
    const body = { firstName: "Renata" };

    // When
    const result = isValidUpdatePassengerBody(body as any);

    // Then
    expect(result).toBe(true);
  });

  it("should return false for unknown key", () => {
    // Given
    const body = { unknown: "value" };

    // When
    const result = isValidUpdatePassengerBody(body as any);

    // Then
    expect(result).toBe(false);
  });
});
