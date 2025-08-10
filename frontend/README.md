# Log Ingestion and Querying System

## Overview

This project is a full-stack application designed to ingest and query log entries, built to meet the assignment specifications. It comprises:

- A **Node.js/Express backend** that handles log ingestion (POST /logs) and querying (GET /logs), persisting data to a JSON file (`data/logs.json`) using `node-json-db`.
- A **React frontend** (built with Vite and styled with Tailwind CSS) that provides a user interface for filtering and displaying logs dynamically.

Key features:

- Backend: Validates and stores logs with 201 Created, 400 Bad Request, and 500 Internal Server Error responses. Queries logs with filters (level, message, resourceId, timestamps) and reverse-chronological sorting.
- Frontend: Filter bar for message search, level selection, resourceId input, and timestamp range; table for log display with color-coded levels (red for error, yellow for warn, blue for info, grey for debug).
- Persistence: Single JSON file database for simplicity and compliance with specs.

The project is structured in a single Git repository with `/backend` and `/frontend` directories.

## Project Design and Approach

### Architecture

- **Backend**: Built with Express.js for RESTful API endpoints. `node-json-db` manages a JSON file (`data/logs.json`) for persistence, configured for auto-save and human-readable format. CORS enables cross-origin requests from the frontend.
- **Frontend**: Developed using Vite for fast development and React for component-based UI. Tailwind CSS provides styling without extra dependencies like Shadcn UI. State management uses React hooks (`useState`, `useEffect`) for dynamic filter updates.

### Design Decisions

- **Validation**: POST /logs validates all required fields (`level`, `message`, etc.), checks `level` against `["error", "warn", "info", "debug"]`, ensures ISO 8601 `timestamp`, and confirms `metadata` is a JSON object. GET /logs applies AND logic to filters and sorts by timestamp.
- **API Integration**: Frontend proxies `/logs` requests to `http://localhost:3000` via Vite, converting datetime-local inputs to ISO format for backend compatibility.
- **Styling**: Tailwind CSS with custom colors (e.g., `primary-500`) and Poppins font for a clean, responsive layout. Color-coded levels enhance UX.
- **Trade-offs**:
  - In-memory filtering in GET assumes small datasets; no pagination or indexing for large volumes.
  - Synchronous JSON writes may not handle concurrency; suitable for single-user demo.
  - Frontend focuses on querying; ingestion via Postman to meet MVP scope.

### Assumptions

- Logs are in UTC ISO format; frontend datetime inputs are adjusted to UTC in API calls.
- Desktop-first UI with basic responsiveness via Tailwind.
- No authentication or rate limiting required.
- Single JSON file is sufficient for persistence.

## Installation

1. Clone the repository:

2. **Backend Setup**:

- Navigate to the backend directory:
- Install dependencies:
- Ensure `data/logs.json` exists (create manually with `{ "logs": [] }` if missing).

3. **Frontend Setup**:

- Navigate to the frontend directory:
- Install dependencies:

## Running the Application

1. **Start the Backend**:

- From the `backend` directory:
- The server will run on `http://localhost:3000`. Check the console for confirmation.

2. **Start the Frontend**:

- From the `frontend` directory:
- The development server will start, accessible at `http://localhost:5173`. Open this URL in your browser.

3. **Test Endpoints**:

- **POST a Log** (via Postman or curl):
- URL: `POST http://localhost:3000/logs`
- Body (JSON):
  ```json
  {
    "level": "info",
    "message": "Server started",
    "resourceId": "server-1000",
    "timestamp": "2025-08-11T01:40:00Z",
    "traceId": "pqr-789",
    "spanId": "span-111",
    "commit": "3c4d5e6",
    "metadata": { "status": "active" }
  }
  ```
