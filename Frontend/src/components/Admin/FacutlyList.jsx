import React, { useState, useEffect } from 'react';

const FacultyList = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch faculty list when the component loads
    const fetchFaculty = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/faculty'); // Use fetch API
        if (!response.ok) {
          throw new Error('Failed to fetch faculty list');
        }
        const data = await response.json();
        
        setFacultyList(data);
      } catch (err) {
        setError('Failed to fetch faculty list. Please try again later.');
        console.error(err);
      }
    };

    fetchFaculty();
  },[]);

  return (
    <div className="w-10/12 h-screen overflow-y-scroll scrollbar-hidden p-6 border-r border-gray-300">
    <h2 className="text-lg font-semibold mb-4">Faculty List</h2>
    {error ? (
      <p className="text-red-500">{error}</p>
    ) : facultyList.length > 0 ? (
      <div className="grid grid-cols-1 gap-4">
        {facultyList.map((faculty, index) => (
          <div
            key={faculty._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
          >
            <div className="mb-2 text-sm text-gray-500">Serial No. {index + 1}</div>
            <p className="font-medium text-gray-800 mb-1">
              <span className="font-semibold">Faculty Name:</span> {faculty.username}
            </p>
            <p className="font-medium text-gray-800 mb-1">
              <span className="font-semibold">Faculty ID:</span> {faculty._id}
            </p>
            <p className="font-medium text-gray-800">
              <span className="font-semibold">Subject:</span> {faculty.subject}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">No faculty members found.</p>
    )}
  </div>
  );
  
};

export default FacultyList;
