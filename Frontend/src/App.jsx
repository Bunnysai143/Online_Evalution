// App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Forms/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import FacultyDashboard from "./components/Faculty/FacultyDashboard";
import UploadPDF from "./components/Admin/UploadPDF";

import AddStudent from "./components/Admin/AddStudent";
import AssignedSheets from "./components/Faculty/AssignedSheets";
import Signup from "./components/Forms/Signup";
import { AssignedSheetView } from "./components/Faculty/AssignedSheetView";
import StudentMarks from "./components/Admin/StudentMarks";

function App() {
  return (
 
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/upload-pdf" element={<UploadPDF />} />
        {/* <Route path="/assign-pdf" element={<AssignPDF />} /> */}
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/assigned-sheets" element={<AssignedSheets />} />
        <Route path="/assigned-sheet/:id" element={<AssignedSheetView />} />
        <Route path="/student-marks" element={<StudentMarks/>} />
        
      </Routes>
    </BrowserRouter>
 
    
  );
}

export default App;
