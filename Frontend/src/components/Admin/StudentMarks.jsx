import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { CheckCheck, CircleX } from "lucide-react";
  
const GradingTable = () => {
  const [gradingData, setGradingData] = useState([]);  // Initialize as an empty array

  useEffect(() => {
    const fetchGradingData = async () => {
      try {
        const response = await fetch("http://localhost:5000/students-overview");  // Replace with your endpoint
        const data = await response.json();

        // Ensure the data is an array before setting the state
        if (Array.isArray(data.data)) {
          setGradingData(data.data);
          console.log(data.data)
          console.log(gradingData)
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching grading data:", error);
      }
    };

    fetchGradingData();
   
  },[]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-center text-3xl font-bold text-gray-800">Faculty Work Dashboard</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <Table className="table-auto w-full text-sm text-gray-700">
          {/* <TableCaption>A list of grading assignments</TableCaption> */}
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-600">
              <TableHead className="px-4 py-2">Roll Number</TableHead>
              <TableHead className="px-4 py-2">Assigned To</TableHead>
              <TableHead className="px-4 py-2">Status</TableHead>
              <TableHead className="px-4 py-2">Upload Date</TableHead>
              <TableHead className="px-4 py-2">Marks</TableHead>
              <TableHead className="px-4 py-2">Subject ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradingData.length > 0 ? (
              gradingData.map((item, index) => (
                <TableRow
                  key={index}
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <TableCell className="px-4 py-2 font-medium">{item.roll_number}</TableCell>
                  <TableCell className="px-4 py-2">{item.assigned_to}</TableCell>
                  <TableCell className="px-4 py-2">
                    {item.status === "pending" ? (
                      <CircleX className="text-red-500 size-6" />  // Show CircleX when status is 'pending'
                    ) : (
                        <CheckCheck className="text-blue-800 size-6"/>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(item.upload_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-2">{item.marks}</TableCell>
                  <TableCell className="px-4 py-2">{item.subject_id}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center px-4 py-4 text-gray-500">No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GradingTable;
