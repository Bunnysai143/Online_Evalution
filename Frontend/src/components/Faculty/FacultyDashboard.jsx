import React from "react";
import { Link } from "react-router-dom";

const FacultyDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Faculty Dashboard
        </h1>

        <div className="space-y-6">
          <Link
            to="/assigned-sheets"
            className="block text-center py-3 px-6 bg-primary text-white rounded-xl shadow-lg hover:from-teal-600 hover:to-teal-700 transition duration-300"
          >
            Assigned Sheets
          </Link>

          <Link
            to="/"
            className="block text-center py-3 px-6 bg-primary text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-purple-700 transition duration-300"
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
