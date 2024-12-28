import React, { useState } from "react";
import { Button } from "../ui/button";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState(1); // Default to year 1
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async () => {
    if (name && rollNumber && course && year) {
      try {
        const response = await fetch("http://localhost:5000/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ name, roll_number: rollNumber, course, year }),
        });

        if (response.ok) {
          setSuccess(`Student ${name} added successfully!`);
          setName("");
          setRollNumber("");
          setCourse("");
          setYear(1);
          setError("");
        } else {
          setError("Failed to add student.");
          setSuccess("");
        }
      } catch (err) {
        console.error(err);
        setError("Error occurred while adding student.");
        setSuccess("");
      }
    } else {
      setError("Please fill out all fields.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-medium text-center text-gray-800 mb-6">Add Student</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Student Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Course Name"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="4"
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleAdd}
            className="px-6 py-2"
          >
            Add Student
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
