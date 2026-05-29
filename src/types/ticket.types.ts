export type TicketClass = "economy" | "business" | "first";
export type TicketStatus = "confirmed" | "cancelled";

export type TicketBody = {
  flight: string;
  passenger: string;
  seatNumber: string;
  class: TicketClass;
  price: number;
  status: TicketStatus;
};
    