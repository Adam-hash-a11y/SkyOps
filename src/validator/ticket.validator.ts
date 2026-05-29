import { TicketBody } from "../types/ticket.types";

export const isValidTicketBody = (ticket: TicketBody): boolean => {
  if (typeof ticket !== "object" || ticket === null) return false;

  const allowedKeys = new Set([
    "flight",
    "passenger",
    "seatNumber",
    "class",
    "price",
  ]);

  for (const key of Object.keys(ticket)) {
    if (!allowedKeys.has(key)) return false;
  }

  if (!ticket.flight || !ticket.passenger) return false;
  if (!ticket.seatNumber || !ticket.class || ticket.price === undefined)
    return false;

  return true;
};

export const isValidSeatNumber = (seat: string): boolean => {
  if (typeof seat !== "string") return false;
  return /^[A-Z][0-9]{1,2}$/.test(seat);
};

export const isValidTicketClass = (cls: string): boolean => {
  return cls === "economy" || cls === "business" || cls === "first";
};

export const isValidTicketPrice = (price: number): boolean => {
  if (typeof price !== "number") return false;
  return price > 0;
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
