# SkyOps Backend

Backend for flight, passenger and ticket management. The server builds the seat maps, sets the ticket prices and books groups of passengers in a single all-or-nothing request. Access is secured with JWT.

The React frontend is in a separate repository: [skyops-forms](https://github.com/Adam-hash-a11y/skyops-forms). Both projects are built to work together.

## At a glance

|                |                                                        |
| -------------- | ------------------------------------------------------ |
| Language       | TypeScript                                             |
| Framework      | Express 5                                              |
| Database       | MongoDB 7 with Mongoose                                |
| Authentication | JWT, token valid for 1 hour                            |
| Tests          | 191 tests in 9 suites (Jest, Supertest)                |
| CI             | GitHub Actions: tests and ESLint on every pull request |
| Code quality   | ESLint, Prettier, SonarQube                            |
| Run            | Docker Compose, one command                            |

## Contents

1. [Architecture](#architecture)
2. [Design decisions](#design-decisions)
3. [Getting started](#getting-started)
4. [Authentication](#authentication)
5. [API reference](#api-reference)
6. [Business rules](#business-rules)
7. [Testing](#testing)
8. [Continuous integration](#continuous-integration)
9. [Security](#security)

---

## Architecture

Every request passes through the same layers. Each layer has one responsibility and only talks to the layer below it.

```text
route -> validator / middleware -> controller -> service -> repository -> MongoDB
```

| Layer      | Responsibility                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Validator  | Pure checks on the data. No database access                                                                  |
| Middleware | Runs the validators and answers 400 or 404 before the controller. Database lookups go through the repository |
| Controller | No business logic. Returns the success response, or 409 on a real conflict                                   |
| Service    | Business rules                                                                                               |
| Repository | The only layer that uses the Mongoose models                                                                 |
| Config     | `database.ts` opens the MongoDB connection with `MONGO_URI`                                                  |

```text
src
├── config
│   └── database.ts
├── constants
├── controller
├── middleware
├── model
├── repository
├── routes
├── service
├── types
└── validator

test
├── controller
├── service
└── validator

app.ts
main.ts
seed.ts
```

---

## Design decisions

| Decision                                                                                                                                  | Reason                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| The server sets the ticket price from the class (first 900, business 500, economy 200). A request that sends `price` is rejected with 400 | The client can never choose or tamper with a price                           |
| The client sends seat counts when it creates a flight. The server generates the seats `A1..An`, `B1..Bn`, `C1..Cn`                        | One source of truth for seat numbers. No malformed seat lists                |
| Seats are created once and never edited. A PATCH with a seat field is rejected                                                            | Existing tickets always point to a seat that exists                          |
| `totalSeats` and `bookedSeats` are computed on every request, never stored                                                                | No counter that can drift out of sync                                        |
| Cancelling a ticket is a soft cancel: only the ticket status changes, the seat stays taken                                                | The booking history stays complete                                           |
| A unique index on `{ flight, seatNumber }`                                                                                                | A seat can never have two tickets, even if the application check is bypassed |
| Batch booking checks every seat first and saves only if all of them pass                                                                  | All or nothing. A bad seat never leaves a half-saved group                   |
| Middleware reads the database only through the repository                                                                                 | The layer rule has no exceptions                                             |

---

## Getting started

Requires Docker. Two containers run: `skyops` (the backend, port 5100) and `skyops-express-mongodb` (MongoDB 7, port 27017).

**1. Clone**

```bash
git clone https://github.com/Adam-hash-a11y/SkyOps.git
cd SkyOps
```

**2. Create a `.env` file** in the project root. It is not tracked by git.

```env
PORT=5100
JWT_SECRET=<a long random string>
MONGO_URI=mongodb://admin:<password>@mongodb:27017/Skyops?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=<same password as in MONGO_URI>
MONGO_DATABASE=Skyops
```

Generate a random value with:

```bash
node -p "require('crypto').randomBytes(32).toString('hex')"
```

MongoDB applies the password only when its volume is first created. After changing it, reset the volume with `docker compose down -v`.

**3. Start the containers**

```bash
docker compose up -d
```

**4. Load demo data (optional)**, once both containers are running:

```bash
docker compose exec api npm run seed
```

The seed deletes all flights, passengers and tickets, then creates 8 flights, 10 passengers and tickets in every state: confirmed, cancelled, a fully booked flight, an almost full flight, a flight without tickets, and tickets whose flight or passenger was deleted. It uses the real services, so seats and prices come from the same code as the endpoints. It can be run again at any time to reset the data.

**Commands**

| Command                      | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| `docker compose logs api`    | Show the backend logs                   |
| `docker compose restart api` | Restart the backend after a code change |
| `docker compose down -v`     | Stop everything and delete the database |
| `npm run test`               | Run all tests                           |
| `npm run eslint`             | Run ESLint                              |
| `npm run prettier`           | Format the code                         |

---

## Authentication

| Method | Endpoint     | Success                            | Errors                             |
| ------ | ------------ | ---------------------------------- | ---------------------------------- |
| GET    | `/api/login` | `200` returns `{ "token": "..." }` | `500` token could not be generated |

Every other route requires the header:

```http
Authorization: Bearer <token>
```

| Code  | Meaning                  |
| ----- | ------------------------ |
| `401` | No token sent            |
| `403` | Token invalid or expired |

---

## API reference

All errors have the same shape: `{ "message": "..." }`. Every route except login can also answer `401`, `403` and `429` (rate limit reached).

### Flights

| Method | Endpoint                           | Purpose                                                                              | Success | Errors                                                       |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------ |
| POST   | `/api/flights`                     | Create a flight with its seats                                                       | `201`   | `400` invalid body, `409` flight number exists               |
| GET    | `/api/flights`                     | List flights. Filters `status`, `origin`, `destination`. Sort `sortBy=departureTime` | `200`   | `400` invalid query                                          |
| GET    | `/api/flights/:flightNumber`       | Get one flight                                                                       | `200`   | `404` flight not found                                       |
| GET    | `/api/flights/:flightNumber/seats` | Free seats. Optional `?class=first\|business\|economy`                               | `200`   | `400` invalid flight number or class, `404` flight not found |
| PATCH  | `/api/flights/:flightNumber`       | Update `airline`, `route`, `schedule` or `status`                                    | `200`   | `400` invalid flight number or body, `404` flight not found  |
| DELETE | `/api/flights/:flightNumber`       | Delete a flight                                                                      | `200`   | `400` invalid flight number, `404` flight not found          |

Every flight in a response includes `totalSeats` and `bookedSeats`.

Create a flight. The three seat fields are counts:

```json
{
  "flightNumber": "SKYOPS-205",
  "airline": "Lufthansa",
  "route": { "origin": "TUN", "destination": "FRA" },
  "schedule": {
    "departureTime": "2026-12-10T08:00:00.000Z",
    "arrivalTime": "2026-12-10T11:30:00.000Z"
  },
  "status": "scheduled",
  "firstSeats": 4,
  "businessSeats": 8,
  "economySeats": 24
}
```

Free seats response. `seats` follows the class filter, `counts` always covers all three classes:

```json
{
  "seats": [
    { "seat": "A2", "class": "first" },
    { "seat": "C1", "class": "economy" }
  ],
  "counts": { "first": 1, "business": 0, "economy": 1 }
}
```

### Passengers

| Method | Endpoint                          | Purpose                                                                                  | Success | Errors                                                           |
| ------ | --------------------------------- | ---------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| POST   | `/api/passengers`                 | Create a passenger                                                                       | `201`   | `400` invalid body, `409` duplicate passport or email            |
| GET    | `/api/passengers`                 | List passengers. Filters `nationality`, `firstName`, `lastName`. Sort `sortBy=firstName` | `200`   | `400` invalid query                                              |
| GET    | `/api/passengers/:passportNumber` | Get one passenger                                                                        | `200`   | `404` passenger not found                                        |
| PATCH  | `/api/passengers/:passportNumber` | Update a passenger                                                                       | `200`   | `400` invalid passport number or body, `404` passenger not found |
| DELETE | `/api/passengers/:passportNumber` | Delete a passenger                                                                       | `200`   | `400` invalid passport number, `404` passenger not found         |

### Tickets

| Method | Endpoint             | Purpose                                          | Success | Errors                                                                                                                                                         |
| ------ | -------------------- | ------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/tickets`       | Book one seat                                    | `201`   | `400` invalid body or seat, `404` flight or passenger not found, `409` seat already booked or not available                                                    |
| POST   | `/api/tickets/batch` | Book several seats on one flight, all or nothing | `201`   | `400` invalid body, duplicate seat or passenger in the batch, or invalid seat, `404` flight or passenger not found, `409` seat already booked or not available |
| GET    | `/api/tickets`       | List tickets. Filters `passengerId`, `flightId`  | `200`   | `400` invalid query                                                                                                                                            |
| GET    | `/api/tickets/:id`   | Get one ticket                                   | `200`   | `400` invalid id, `404` ticket not found                                                                                                                       |
| PATCH  | `/api/tickets/:id`   | Cancel a ticket with `{ "status": "cancelled" }` | `200`   | `400` invalid id or body, `404` ticket not found or already cancelled                                                                                          |

Single booking. `flight` and `passenger` are the Mongo `_id` values:

```json
{
  "flight": "<flight _id>",
  "passenger": "<passenger _id>",
  "seatNumber": "C1",
  "class": "economy"
}
```

Batch booking, one passenger per seat:

```json
{
  "flight": "<flight _id>",
  "tickets": [
    { "passenger": "<passenger _id>", "seatNumber": "A2", "class": "first" },
    { "passenger": "<passenger _id>", "seatNumber": "C2", "class": "economy" }
  ]
}
```

Ticket responses:

- A booking returns the saved ticket (`seatNumber`, `class`, `price`, `status`) with `flight` and `passenger` as ids.
- `GET /api/tickets` and `GET /api/tickets/:id` return the flight info (`flightNumber`, `airline`, `route`, `schedule`, `status`, without the seat arrays) and the full passenger.
- With `?passengerId=`, each ticket has the flight info and the passenger as an id. With `?flightId=`, each ticket has the full passenger and the flight as an id. If both are sent, only `passengerId` is used.

---

## Business rules

**Flights**

- The flight number starts with `SKYOPS-` followed by at least one character.
- The airline contains letters only, at least 5.
- Origin and destination are 3 uppercase letters and differ from each other.
- Departure is before arrival.
- Status is `scheduled`, `delayed`, `cancelled` or `landed`.
- Each seat count is a whole number from 0 to 500, and at least one class has seats. A class with 0 seats does not exist on that flight.

**Seats**

- The first letter defines the class: `A` first, `B` business, `C` economy.
- Seat numbers match `^[A-C][0-9]{1,3}$`.

**Tickets**

- A booking body contains only `flight`, `passenger`, `seatNumber` and `class`. Any other field, including `price` and `status`, is rejected with 400.
- Booking marks the seat as unavailable.
- In a batch, the same seat or the same passenger may appear only once.

**Passengers**

- Names: letters and spaces, at least 3 characters.
- Passport number: at least 6 characters. Passport numbers and emails are unique.
- Valid email address and valid mobile phone number.
- Date of birth in the past.
- Nationality: `TN`, `FR`, `DE`, `US`, `GB`, `IT`, `ES`, `CA` or `MA`.

---

## Testing

191 tests in 9 suites. Each layer is tested with the layers below it mocked.

| Level       | Approach                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Validators  | Unit tests on pure functions                                                                     |
| Services    | Unit tests with mocked repositories and models                                                   |
| Controllers | Integration tests with Supertest. The real middleware runs, services and repositories are mocked |

```bash
npm run test
```

The tests read `JWT_SECRET` from the environment.

---

## Continuous integration

A GitHub Actions workflow runs on pull requests into `main` and `refactor/backend-api`, on Node 20.

| Job          | Steps                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| `unit-tests` | Install dependencies, run the Jest suite. `JWT_SECRET` comes from a repository secret |
| `eslint`     | Install dependencies, run ESLint                                                      |

---

## Security

- JWT on every route except login
- Helmet security headers
- CORS limited to the frontend origin `http://localhost:5173`
- Rate limit of 10000 requests per 5 minutes
- Validation on every endpoint
- Secrets stay in `.env`, which is not tracked by git
