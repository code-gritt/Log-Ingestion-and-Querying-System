export async function fetchLogs(filters) {
  const params = new URLSearchParams();

  if (filters.message) params.append("message", filters.message);
  if (filters.level) params.append("level", filters.level);
  if (filters.resourceId) params.append("resourceId", filters.resourceId);
  if (filters.timestamp_start)
    params.append("timestamp_start", `${filters.timestamp_start}:00Z`); // Convert datetime-local to ISO
  if (filters.timestamp_end)
    params.append("timestamp_end", `${filters.timestamp_end}:00Z`); // Convert datetime-local to ISO

  const response = await fetch(`/logs?${params.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }
  return response.json();
}
