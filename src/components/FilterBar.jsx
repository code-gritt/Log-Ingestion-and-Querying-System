import React from "react";

function FilterBar({ filters, setFilters }) {
  const handleMessageChange = (e) => {
    setFilters({ ...filters, message: e.target.value });
  };

  const handleLevelChange = (e) => {
    setFilters({ ...filters, level: e.target.value });
  };

  const handleResourceIdChange = (e) => {
    setFilters({ ...filters, resourceId: e.target.value });
  };

  const handleTimestampStartChange = (e) => {
    setFilters({ ...filters, timestamp_start: e.target.value });
  };

  const handleTimestampEndChange = (e) => {
    setFilters({ ...filters, timestamp_end: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({
      message: "",
      level: "",
      resourceId: "",
      timestamp_start: null,
      timestamp_end: null,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search message..."
        value={filters.message}
        onChange={handleMessageChange}
        className="w-full max-w-md rounded border p-2"
      />
      <select
        value={filters.level}
        onChange={handleLevelChange}
        className="w-full max-w-md rounded border p-2"
      >
        <option value="">All Levels</option>
        <option value="error">Error</option>
        <option value="warn">Warn</option>
        <option value="info">Info</option>
        <option value="debug">Debug</option>
      </select>
      <input
        type="text"
        placeholder="Resource ID..."
        value={filters.resourceId}
        onChange={handleResourceIdChange}
        className="w-full max-w-md rounded border p-2"
      />
      <div className="flex gap-4">
        <input
          type="datetime-local"
          value={filters.timestamp_start || ""}
          onChange={handleTimestampStartChange}
          className="w-full max-w-xs rounded border p-2"
        />
        <input
          type="datetime-local"
          value={filters.timestamp_end || ""}
          onChange={handleTimestampEndChange}
          className="w-full max-w-xs rounded border p-2"
        />
      </div>
      <button
        onClick={handleClearFilters}
        className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default FilterBar;
