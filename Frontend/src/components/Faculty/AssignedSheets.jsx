import { useNavigate } from 'react-router-dom';
import { Check, CheckCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";  // Import toast
import "react-toastify/dist/ReactToastify.css";  // Import toast styles

const AssignedSheets = () => {
  const [assignedSheets, setAssignedSheets] = useState([]); 
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")));
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    const fetchAssignedSheets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/Que_Ans/assigned_to/${userData.data._id}`);
        if (!response.ok) {
          throw new Error("Error fetching assigned sheets");
        }
        const data = await response.json();
        setAssignedSheets(data.data || []); 
      } catch (error) {
        console.error("Error fetching assigned sheets:", error);
      }
    };

    if (userData && userData.data._id) {
      fetchAssignedSheets();
    }
  }, [userData]);

  const handleSheetClick = (sheet) => {
    // If the status is "completed", show a notification and don't navigate
    if (sheet.status === "completed") {
      toast.info("This sheet has already been evaluated.");  // Show toast notification
      return;
    }

    // Navigate to AssignedSheetView and pass the sheet data as state
    navigate(`/assigned-sheet/${sheet._id}`, { state: { sheetData: sheet } });
  };

  return (
    <div className="h-screen p-6 overflow-y-scroll scrollbar-hidden">
      <h1 className="text-3xl font-semibold text-center mb-6">Assigned Sheets</h1>
      {assignedSheets && assignedSheets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-auto">
          {assignedSheets.map((sheet, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg bg-white shadow-lg cursor-pointer"
              onClick={() => handleSheetClick(sheet)} // Handle the click to navigate
            >
              <div className="mb-4 text-xl font-semibold text-gray-800">
                Serial Number: {index + 1}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="font-medium text-gray-700">Faculty (Assigned To):</div>
                <div className="text-gray-900">{sheet.assigned_to}</div>
                <div className="font-medium text-gray-700">Subject ID:</div>
                <div className="text-gray-900">{sheet.subject_id}</div>
                <div className="font-medium text-gray-700">Status:</div>
                <div className="flex items-center">
                  {sheet.status === "pending" ? (
                    <div className="text-red-600 flex items-center gap-2">
                      {sheet.status}<Check size={15} color="red" />
                    </div>
                  ) : (
                    <div className="text-green-600 flex justify-center items-center gap-2">
                      {sheet.status}<CheckCheck size={15} color="blue" />
                    </div>
                  )}
                </div>
                <div className="font-medium text-gray-700">Student Roll Number:</div>
                <div className="text-gray-900">{sheet.roll_number}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-500">No assigned sheets found.</p>
      )}
      <ToastContainer />  {/* Add ToastContainer to show toast notifications */}
    </div>
  );
};

export default AssignedSheets;
