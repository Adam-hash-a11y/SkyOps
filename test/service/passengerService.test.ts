import {
  findPassengerByEmail,
  findPassengerByPassport,
  savePassenger,
} from "../../src/repository/passenger.repository";
import {
  createPassengerService,
  getPassengerByPassportNumberService,
} from "../../src/service/passengerService";
import { PassengerBody } from "../../src/types/passenger.types";
jest.mock("../../src/repository/passenger.repository");

describe("test createPassengerService fucntion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save and return a new passenger", async () => {
    // Given
    const passenger: PassengerBody = {
      firstName: "Adam",
      lastName: "Hamdi",
      passportNumber: "TN123456",
      nationality: "Tunisian",
      dateOfBirth: new Date("1995-06-01T08:00:00"),
      email: "adam.hamdi@email.com",
      phoneNumber: "21656532009",
    };
    (findPassengerByPassport as jest.Mock).mockResolvedValue(null);
    (findPassengerByEmail as jest.Mock).mockResolvedValue(null);
    (savePassenger as jest.Mock).mockResolvedValue(passenger);

    // When
    const result = await createPassengerService(passenger);

    // Then
    expect(result).toEqual(passenger);
  });
  it("should throw error if passport already exists", async () => {
    // Given
    const passenger: PassengerBody = {
      firstName: "Adam",
      lastName: "Hamdi",
      passportNumber: "TN123456",
      nationality: "TN",
      dateOfBirth: new Date("1995-06-01T08:00:00"),
      email: "adam.hamdi@email.com",
      phoneNumber: "21656532009",
    };

    (findPassengerByPassport as jest.Mock).mockResolvedValue(passenger);

    // When
    const action = createPassengerService(passenger);

    // Then
    await expect(action).rejects.toThrow("Passenger already exists");
  });
  it("should throw error if email already exists", async () => {
    // Given
    const passenger: PassengerBody = {
      firstName: "Adam",
      lastName: "Hamdi",
      passportNumber: "TN123456",
      nationality: "TN",
      dateOfBirth: new Date("1995-06-01T08:00:00"),
      email: "adam.hamdi@email.com",
      phoneNumber: "21656532009",
    };

    (findPassengerByPassport as jest.Mock).mockResolvedValue(null);
    (findPassengerByEmail as jest.Mock).mockResolvedValue(passenger);

    // When
    const action = createPassengerService(passenger);

    // Then
    await expect(action).rejects.toThrow("email already exists");
  });
});

describe("test getPassengerByPassportNumberService function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return a passenger when found", async () => {
    //Given
    const passportNumber = "TN1547855";
    const mockPassenger = { passportNumber };
    (findPassengerByPassport as jest.Mock).mockResolvedValue(mockPassenger);

    //When
    const result = await getPassengerByPassportNumberService(passportNumber);

    //Then
    expect(result).toEqual(mockPassenger);
  });
  it("should return null when passenger not found", async () => {
    //Given
    const passportNumber = "roushfodilxg";
    (findPassengerByPassport as jest.Mock).mockResolvedValue(null);

    //When
    const result = await getPassengerByPassportNumberService(passportNumber);

    //Then
    expect(result).toBeNull();
  });
});
