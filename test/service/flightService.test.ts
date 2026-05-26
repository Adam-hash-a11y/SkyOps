import {
  createFlightService,
  getFlightByFlightNumber,
  getFlightsByFilters,
  updateFlightService,
} from "../../src/service/flightService";
import {
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
      seats: { total: 180, booked: 0 },
    };
    (findFlightByNumber as jest.Mock).mockResolvedValue(null);
    (saveFlight as jest.Mock).mockResolvedValue(flight);

    // When
    const result = await createFlightService(flight);

    // Then
    expect(result).toEqual(flight);
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
      seats: { total: 180, booked: 0 },
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
    const mockFlight = { flightNumber, airline: "Lufthansa" };
    (findFlightByNumber as jest.Mock).mockResolvedValue(mockFlight);

    // When
    const result = await getFlightByFlightNumber(flightNumber);

    // Then
    expect(result).toEqual(mockFlight);
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
    const mockFlights = [{ flightNumber: "SKYOPS-101", status: "scheduled" }];
    (findFlightsByFilters as jest.Mock).mockResolvedValue(mockFlights);

    // When
    const result = await getFlightsByFilters(filters);

    // Then
    expect(result).toEqual(mockFlights);
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
    const mockFlight = { flightNumber, status: "delayed" };
    (findFlightByNumber as jest.Mock).mockResolvedValue({ flightNumber });
    (updateFlightByFlightNumber as jest.Mock).mockResolvedValue(mockFlight);

    // When
    const result = await updateFlightService(flightNumber, updates);

    // Then
    expect(result).toEqual(mockFlight);
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
