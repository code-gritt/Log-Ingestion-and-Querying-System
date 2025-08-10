// backend/index.js

const express = require("express");
const cors = require("cors");
const { JsonDB, Config } = require("node-json-db");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize JSON DB
const db = new JsonDB(new Config("./data/logs.json", true, true, "/")); // Auto-save, human-readable

// Allowed log levels
const allowedLevels = ["error", "warn", "info", "debug"];

// POST /logs - Ingest a single log entry
app.post("/logs", async (req, res) => {
  try {
    const body = req.body;

    // Validate required fields
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
      if (!body[field]) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate level
    if (!allowedLevels.includes(body.level)) {
      return res.status(400).json({
        error: `Invalid level. Must be one of: ${allowedLevels.join(", ")}`,
      });
    }

    // Validate timestamp (ISO 8601)
    if (isNaN(Date.parse(body.timestamp))) {
      return res
        .status(400)
        .json({ error: "Invalid timestamp format. Must be ISO 8601." });
    }

    // Validate metadata is an object
    if (typeof body.metadata !== "object" || Array.isArray(body.metadata)) {
      return res.status(400).json({ error: "Metadata must be a JSON object." });
    }

    // Append to logs array
    await db.push("/logs[]", body);

    // Return created log
    res.status(201).json(body);
  } catch (err) {
    console.error("Error ingesting log:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /logs - Retrieve filtered and sorted logs
app.get("/logs", async (req, res) => {
  res.set("Cache-Control", "no-cache");
  try {
    // Load all logs
    let logs = (await db.getData("/logs")) || [];

    // Extract query parameters
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

    // Apply filters (AND logic)
    if (level) {
      const levels = level.split(","); // Support multi-level if comma-separated
      logs = logs.filter((log) => levels.includes(log.level));
    }
    if (message) {
      const lowerMessage = message.toLowerCase();
      logs = logs.filter((log) =>
        log.message.toLowerCase().includes(lowerMessage)
      );
    }
    if (resourceId) {
      logs = logs.filter((log) => log.resourceId === resourceId);
    }
    if (traceId) {
      logs = logs.filter((log) => log.traceId === traceId);
    }
    if (spanId) {
      logs = logs.filter((log) => log.spanId === spanId);
    }
    if (commit) {
      logs = logs.filter((log) => log.commit === commit);
    }
    if (timestamp_start) {
      if (isNaN(Date.parse(timestamp_start))) {
        return res
          .status(400)
          .json({ error: "Invalid timestamp_start format. Must be ISO 8601." });
      }
      logs = logs.filter(
        (log) => new Date(log.timestamp) >= new Date(timestamp_start)
      );
    }
    if (timestamp_end) {
      if (isNaN(Date.parse(timestamp_end))) {
        return res
          .status(400)
          .json({ error: "Invalid timestamp_end format. Must be ISO 8601." });
      }
      logs = logs.filter(
        (log) => new Date(log.timestamp) <= new Date(timestamp_end)
      );
    }

    // Sort reverse chronological (most recent first)
    logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return filtered logs
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error retrieving logs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
