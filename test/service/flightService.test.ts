import { createFlightService } from "../../src/service/flightService";
import {
  findFlightByNumber,
  saveFlight,
} from "../../src/repository/flight.repository";
import { FlightBody } from "../../src/types/flight.types";

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
