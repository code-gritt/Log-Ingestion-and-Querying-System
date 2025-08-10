import React from "react";

function LogResults({ logs }) {
  const getLevelClass = (level) => {
    if (level === "error") return "bg-red-50 border-l-4 border-red-500";
    if (level === "warn") return "bg-yellow-50 border-l-4 border-yellow-500";
    if (level === "info") return "bg-blue-50 border-l-4 border-blue-500";
    return "bg-gray-50 border-l-4 border-gray-500"; // debug
  };

  return (
    <div className="w-full">
      {logs.length === 0 ? (
        <p className="text-center text-gray-500">No logs found</p>
      ) : (
        <table className="w-full table-auto rounded border">
          <thead>
            <tr className="bg-primary-100 text-left">
              <th className="p-2">Timestamp</th>
              <th className="p-2">Level</th>
              <th className="p-2">Message</th>
              <th className="p-2">Resource ID</th>
              <th className="p-2">Trace ID</th>
              <th className="p-2">Span ID</th>
              <th className="p-2">Commit</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className={getLevelClass(log.level)}>
                <td className="p-2">{log.timestamp}</td>
                <td className="p-2">{log.level}</td>
                <td className="truncate p-2">{log.message}</td>
                <td className="p-2">{log.resourceId}</td>
                <td className="p-2">{log.traceId}</td>
                <td className="p-2">{log.spanId}</td>
                <td className="p-2">{log.commit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LogResults;
