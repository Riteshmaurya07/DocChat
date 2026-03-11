import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = ({ isDocumentUploaded, fileName, handleResetDocument }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="p-4 flex justify-between items-center border-b border-blue-500/30">
      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        <Link to="/">DocChat</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {isDocumentUploaded && (
          <div className="flex items-center">
            <div className="flex items-center px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30 mr-4">
              <svg
                className="w-4 h-4 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span className="text-sm">{fileName}</span>
            </div>
            <button
              onClick={handleResetDocument}
              className="px-3 py-2 cursor-pointer rounded-lg font-medium text-sm transition-all bg-gray-700 hover:bg-gray-600 border border-gray-600"
            >
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                New Document
              </div>
            </button>
          </div>
        )}

        {user ? (
          <div className="flex items-center space-x-3 ml-4">
            <span className="text-gray-300">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3 ml-4">
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;