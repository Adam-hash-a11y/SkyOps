import { TicketBody } from "../types/ticket.types";

export const isValidTicketBody = (ticket: TicketBody): boolean => {
  if (typeof ticket !== "object" || ticket === null) return false;

  const allowedKeys = new Set(["flight", "passenger", "seatNumber", "class"]);

  for (const key of Object.keys(ticket)) {
    if (!allowedKeys.has(key)) return false;
  }

  if (!ticket.flight || !ticket.passenger) return false;
  if (!ticket.seatNumber || !ticket.class) return false;

  return true;
};

export const isValidSeatNumber = (seat: string): boolean => {
  if (typeof seat !== "string") return false;
  return /^[A-C][0-9]{1,3}$/.test(seat);
};

export const isValidTicketClass = (cls: string): boolean => {
  return cls === "economy" || cls === "business" || cls === "first";
};

export const isValidTicketQuery = (query: Record<string, unknown>) => {
  for (const key of Object.keys(query)) {
    if (key !== "passengerId" && key !== "flightId") {
      return false;
    }
  }
  return true;
};

export const isValidTicketId = (id: unknown): boolean => {
  if (typeof id !== "string") return false;
  if (id.length !== 24) return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};
