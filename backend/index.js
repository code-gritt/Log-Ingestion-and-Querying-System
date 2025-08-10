// backend/index.js

const express = require("express");
const cors = require("cors");
const { JsonDB, Config } = require("node-json-db");

const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(cors());

// Initialize JSON database
const db = new JsonDB(new Config("./data/logs.json", true, true, "/")); // Auto-save enabled, human-readable format

// Define allowed log levels
const validLevels = ["error", "warn", "info", "debug"];

// POST /logs - Ingest and store a single log entry
app.post("/logs", async (req, res) => {
  try {
    const logEntry = req.body;

    // Validate all required fields are present
    const requiredFields = [
      "level",
      "message",
      "resourceId",
      "timestamp",
      "traceId",
      "spanId",
      "commit",
      "metadata",
    ];
    for (const field of requiredFields) {
      if (!(field in logEntry)) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate level is one of the allowed values
    if (!validLevels.includes(logEntry.level)) {
      return res
        .status(400)
        .json({
          error: `Invalid level. Must be one of: ${validLevels.join(", ")}`,
        });
    }

    // Validate timestamp is a valid ISO 8601 string
    if (isNaN(Date.parse(logEntry.timestamp))) {
      return res
        .status(400)
        .json({ error: "Invalid timestamp format. Must be ISO 8601" });
    }

    // Validate metadata is a non-array object
    if (
      typeof logEntry.metadata !== "object" ||
      Array.isArray(logEntry.metadata)
    ) {
      return res.status(400).json({ error: "Metadata must be a JSON object" });
    }

    // Persist the log entry to the database
    await db.push("/logs[]", logEntry);

    // Respond with the created log entry
    res.status(201).json(logEntry);
  } catch (error) {
    console.error("Failed to ingest log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /logs - Retrieve and filter logs
app.get("/logs", async (req, res) => {
  res.set("Cache-Control", "no-cache"); // Prevent caching during development
  try {
    // Retrieve all logs, default to empty array if none exist
    let logs = (await db.getData("/logs")) || [];

    // Extract and apply query parameters for filtering
    const {
      level,
      message,
      resourceId,
      timestamp_start,
      timestamp_end,
      traceId,
      spanId,
      commit,
    } = req.query;

    // Apply level filter (support multiple levels with comma separation)
    if (level) {
      const levels = level.split(",");
      logs = logs.filter((log) => levels.includes(log.level));
    }

    // Apply case-insensitive message search
    if (message) {
      const searchTerm = message.toLowerCase();
      logs = logs.filter((log) =>
        log.message.toLowerCase().includes(searchTerm)
      );
    }

    // Apply resourceId filter
    if (resourceId) {
      logs = logs.filter((log) => log.resourceId === resourceId);
    }

    // Apply traceId filter
    if (traceId) {
      logs = logs.filter((log) => log.traceId === traceId);
    }

    // Apply spanId filter
    if (spanId) {
      logs = logs.filter((log) => log.spanId === spanId);
    }

    // Apply commit filter
    if (commit) {
      logs = logs.filter((log) => log.commit === commit);
    }

    // Apply timestamp range filters with validation
    if (timestamp_start) {
      if (isNaN(Date.parse(timestamp_start))) {
        return res
          .status(400)
          .json({ error: "Invalid timestamp_start format. Must be ISO 8601" });
      }
      logs = logs.filter(
        (log) => new Date(log.timestamp) >= new Date(timestamp_start)
      );
    }
    if (timestamp_end) {
      if (isNaN(Date.parse(timestamp_end))) {
        return res
          .status(400)
          .json({ error: "Invalid timestamp_end format. Must be ISO 8601" });
      }
      logs = logs.filter(
        (log) => new Date(log.timestamp) <= new Date(timestamp_end)
      );
    }

    // Sort logs in reverse chronological order
    logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return filtered and sorted logs
    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to retrieve logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Global error handler for uncaught exceptions
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
