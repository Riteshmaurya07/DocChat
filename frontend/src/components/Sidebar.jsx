import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ onSelectHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/history`, {
          credentials: "include", // send cookies
        });
        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError("Error loading history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, BACKEND_URL]);

  if (!user) return null;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 h-full flex flex-col pt-4 overflow-y-auto">
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Recent Conversations
      </h3>
      {loading ? (
        <div className="px-4 text-sm text-gray-400">Loading...</div>
      ) : error ? (
        <div className="px-4 text-sm text-red-400">{error}</div>
      ) : history.length === 0 ? (
        <div className="px-4 text-sm text-gray-400">No recent conversations.</div>
      ) : (
        <ul className="space-y-2 px-2">
          {history.map((conv) => (
            <li key={conv._id}>
              <button
                onClick={() => onSelectHistory(conv)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                title={conv.fileName}
              >
                <div className="text-sm font-medium text-gray-200 truncate">
                  {conv.fileName}
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
