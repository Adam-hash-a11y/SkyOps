import {
  createFlightService,
  deleteFlightService,
  getFlightByFlightNumber,
  getFlightsByFilters,
  updateFlightService,
} from "../../src/service/flightService";
import {
  deleteFlightByNumber,
  findFlightByNumber,
  findFlightsByFilters,
  saveFlight,
  updateFlightByFlightNumber,
} from "../../src/repository/flight.repository";
import { FlightBody, FlightStatus } from "../../src/types/flight.types";

jest.mock("../../src/repository/flight.repository");

describe("test createFlightService fucntion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save and return a new flight", async () => {
    // Given
    const flight: FlightBody = {
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
    const savedData = {
      flightNumber: "SKYOPS-101",
      firstSeats: [
        { seat: "A1", availability: false },
        { seat: "A2", availability: true },
      ],
      businessSeats: [],
      economySeats: [{ seat: "C1", availability: true }],
    };

    (findFlightByNumber as jest.Mock).mockResolvedValue(null);
    (saveFlight as jest.Mock).mockResolvedValue({
      ...savedData,
      toObject: () => savedData,
    });

    // When
    const result = await createFlightService(flight);

    // Then
    expect(result).toEqual({ ...savedData, totalSeats: 3, bookedSeats: 1 });
  });

  it("should build the seats from the counts before saving", async () => {
    // Given
    const flight: FlightBody = {
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

    const savedData = { firstSeats: [], businessSeats: [], economySeats: [] };
    (findFlightByNumber as jest.Mock).mockResolvedValue(null);
    (saveFlight as jest.Mock).mockResolvedValue({
      ...savedData,
      toObject: () => savedData,
    });

    // When
    await createFlightService(flight);

    // Then
    const savedFlight = (saveFlight as jest.Mock).mock.calls[0][0];
    expect(savedFlight.firstSeats).toEqual([
      { seat: "A1", availability: true },
      { seat: "A2", availability: true },
    ]);
    expect(savedFlight.businessSeats).toEqual([]);
    expect(savedFlight.economySeats).toEqual([
      { seat: "C1", availability: true },
      { seat: "C2", availability: true },
      { seat: "C3", availability: true },
    ]);
  });

  it("should throw a flight number already exists error whhen flight number already exists", async () => {
    // Given
    const flight: FlightBody = {
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
    (findFlightByNumber as jest.Mock).mockResolvedValue(flight);

    // When
    const action = createFlightService(flight);

    // Then
    await expect(action).rejects.toThrow("flight number already exists");
  });
});

describe("test getFlightByFlightNumber service function", () => {
  it("should return a flight when found", async () => {
    // Given
    const flightNumber = "SKYOPS-101";
    const flightData = {
      flightNumber,
      airline: "Lufthansa",
      firstSeats: [{ seat: "A1", availability: false }],
      businessSeats: [],
      economySeats: [{ seat: "C1", availability: true }],
    };
    (findFlightByNumber as jest.Mock).mockResolvedValue({
      ...flightData,
      toObject: () => flightData,
    });

    // When
    const result = await getFlightByFlightNumber(flightNumber);

    // Then
    expect(result).toEqual({ ...flightData, totalSeats: 2, bookedSeats: 1 });
  });

  it("should return null when flight not found", async () => {
    // Given
    const flightNumber = "SKYOPS-999";
    (findFlightByNumber as jest.Mock).mockResolvedValue(null);

    // When
    const result = await getFlightByFlightNumber(flightNumber);

    // Then
    expect(result).toBeNull();
  });
});

describe("test getFlightsByFilters service function", () => {
  it("should return flights matching filters", async () => {
    // Given
    const filters = { status: "scheduled" as FlightStatus };
    const flightData = {
      flightNumber: "SKYOPS-101",
      status: "scheduled",
      firstSeats: [{ seat: "A1", availability: false }],
      businessSeats: [],
      economySeats: [{ seat: "C1", availability: true }],
    };
    (findFlightsByFilters as jest.Mock).mockResolvedValue([
      { ...flightData, toObject: () => flightData },
    ]);

    // When
    const result = await getFlightsByFilters(filters);

    // Then
    expect(result).toEqual([{ ...flightData, totalSeats: 2, bookedSeats: 1 }]);
  });

  it("should return empty array when no flights match", async () => {
    // Given
    const filters = { status: "cancelled" as FlightStatus };
    (findFlightsByFilters as jest.Mock).mockResolvedValue([]);

    // When
    const result = await getFlightsByFilters(filters);

    // Then
    expect(result).toEqual([]);
  });
});
describe("test updateFlightService function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update and return the flight", async () => {
    // Given
    const flightNumber = "SKYOPS-101";
    const updates: Partial<FlightBody> = { status: "delayed" };
    const flightData = {
      flightNumber,
      status: "delayed",
      firstSeats: [{ seat: "A1", availability: false }],
      businessSeats: [],
      economySeats: [{ seat: "C1", availability: true }],
    };
    (findFlightByNumber as jest.Mock).mockResolvedValue({ flightNumber });
    (updateFlightByFlightNumber as jest.Mock).mockResolvedValue({
      ...flightData,
      toObject: () => flightData,
    });

    // When
    const result = await updateFlightService(flightNumber, updates);

    // Then
    expect(result).toEqual({ ...flightData, totalSeats: 2, bookedSeats: 1 });
  });

  it("should return null when flight not found", async () => {
    // Given
    const flightNumber = "SKYOPS-999";
    const updates: Partial<FlightBody> = { status: "delayed" };
    (findFlightByNumber as jest.Mock).mockResolvedValue(null);

    // When
    const result = await updateFlightService(flightNumber, updates);

    // Then
    expect(result).toBeNull();
  });
});
describe("test deleteFlightService function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete and return the flight", async () => {
    // Given
    const flightNumber = "SKYOPS-101";
    const mockFlight = { flightNumber };
    (deleteFlightByNumber as jest.Mock).mockResolvedValue(mockFlight);

    // When
    const result = await deleteFlightService(flightNumber);

    // Then
    expect(result).toEqual(mockFlight);
  });

  it("should return null when flight not found", async () => {
    // Given
    const flightNumber = "SKYOPS-999";
    (deleteFlightByNumber as jest.Mock).mockResolvedValue(null);

    // When
    const result = await deleteFlightService(flightNumber);

    // Then
    expect(result).toBeNull();
  });
});
