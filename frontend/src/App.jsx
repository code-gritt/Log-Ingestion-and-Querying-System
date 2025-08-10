// src/App.jsx
import React, { useState, useEffect } from "react";
import FilterBar from "./components/FilterBar";
import LogResults from "./components/LogResults";
import { fetchLogs } from "./utils/api";
import "./index.css";

// Main app component: manages state, fetches logs, and renders FilterBar and LogResults
function App() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    message: "",
    level: "",
    resourceId: "",
    timestamp_start: null,
    timestamp_end: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await fetchLogs(filters);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [filters]);

  return (
    <div className="container mx-auto p-4">
      <FilterBar filters={filters} setFilters={setFilters} />
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <LogResults logs={logs} />
      )}
    </div>
  );
}

export default App;
