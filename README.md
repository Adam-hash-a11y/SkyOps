# SkyOps API

A REST API for airport management — handling flights, passengers and tickets with full CRUD operations, validation, and business logic connecting all three resources.

---

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Docker
- Jest + Supertest
- Helmet + Rate Limiting
- ESLint + Prettier + Husky

---

## Project Structure
src/
├── controller/
├── middleware/
├── model/
├── repository/
├── routes/
├── service/
├── types/
└── validator/
test/
├── controller/
├── service/
└── validator/

---

## Installation

```bash
git clone https://github.com/Adam-hash-a11y/SkyOps.git
cd SkyOps
npm install
```

## Environment Variables

Create a `.env` file in the root:
MONGO_URI=mongodb://admin:password123@localhost:27017/skyops?authSource=admin
PORT=5100

## Run MongoDB with Docker

```bash
docker compose up -d
```

## Run the server

```bash
npm run dev
```

## Run tests

```bash
npm run test
```

---

## Resources

### Flights

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/flights | Create a flight |
| GET | /api/flights | Get all flights |
| GET | /api/flights?status=delayed | Filter by status |
| GET | /api/flights?origin=TUN&destination=FRA | Filter by route |
| GET | /api/flights?sortBy=departureTime | Sort by departure |
| GET | /api/flights/:flightNumber | Get by flight number |
| PATCH | /api/flights/:flightNumber | Update a flight |
| DELETE | /api/flights/:flightNumber | Delete a flight |

### Passengers

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/passengers | Create a passenger |
| GET | /api/passengers | Get all passengers |
| GET | /api/passengers/:passportNumber | Get by passport number |
| PATCH | /api/passengers/:passportNumber | Update a passenger |
| DELETE | /api/passengers/:passportNumber | Delete a passenger |

### Tickets

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/tickets | Book a ticket |
| GET | /api/tickets | Get all tickets |
| GET | /api/tickets/:id | Get by id |
| GET | /api/tickets?flightId=x | Get tickets by flight |
| GET | /api/tickets?passengerId=x | Get tickets by passenger |
| DELETE | /api/tickets/:id | Cancel a ticket |

---

## Business Logic

- Flight numbers must follow the format `SKYOPS-XXXXX`
- Origin and destination must be 3 letter uppercase IATA codes and cannot be the same
- Departure time must be before arrival time
- Seat numbers are unique per flight — the same seat can exist on different flights
- Booking a ticket increments the flight's booked seats count
- Cancelling a ticket decrements the flight's booked seats count
- A flight cannot be overbooked beyond its total capacity
- Duplicate passport numbers and emails are rejected

---

## Validation

Every endpoint has a dedicated middleware that validates the request before it reaches the controller. Validators are separated from middleware and tested independently.

---

## Testing

Tests cover all three layers:

- Validator unit tests
- Service unit tests with mocked repositories
- Controller integration tests with mocked services

```bash
npm run test
```

---

## Security

- Helmet for HTTP security headers
- Rate limiting — 10000 requests per 5 minutes
- Input validation on every endpoint
- Duplicate detection before hitting the database