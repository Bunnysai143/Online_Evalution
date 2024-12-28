import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "@/lib/FireBase";
// import { Button } from "./ui/button";
// import { FileUpload } from "./ui/file-upload";
import FacultyList from "./FacutlyList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileUpload } from "../ui/file-upload";
import { Button } from "../ui/button";

const UploadPDF = () => {
  const [ansfile, setAnsFile] = useState(null);
  const [quefile, setQueFile] = useState(null);
  const [subjectId, setSubjectId] = useState("");
  const [studentRollNumber, setStudentRollNumber] = useState("");
  const [facultyId, setFacultyId] = useState("");

  const handleQueChange = (files) => {
    setQueFile(files[0]);
  };

  const handleAnsChange = (files) => {
    setAnsFile(files[0]);
  };

  const handleUpload = async () => {
    if (!studentRollNumber || !facultyId || !subjectId) {
      toast.error("Please fill all the fields!");
      return;
    }

    let ansUrl, queUrl;

    try {
      // Upload Answer Sheet
      if (ansfile) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `Answersheet/${studentRollNumber}_${ansfile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, ansfile);
        ansUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {},
            (err) => reject(err),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } else {
        toast.error("No answer file selected.");
        return;
      }

      // Upload Question Paper
      if (quefile) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `QuestionPaper/${studentRollNumber}_${quefile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, quefile);
        queUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {},
            (err) => reject(err),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } else {
        toast.error("No question file selected.");
        return;
      }

      // Post Data to Backend
      const payload = {
        subject_id: subjectId,
        question_paper_url: queUrl,
        answer_sheet_url: ansUrl,
        roll_number: studentRollNumber,
        assigned_to: facultyId,
      };

      const response = await fetch("http://localhost:5000/Que_Ans/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Upload successful! ${result.message}`);
        setFacultyId("");
        setQueFile("");
        setAnsFile("");
        setStudentRollNumber("");
        setSubjectId("");
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full h-screen flex ">
      {/* Faculty List with Fixed Height and Scrolling (Scrollbar Hidden) */}
      {/* <div className="w-1/3 h-[500px] overflow-y-scroll scrollbar-hidden p-6 border-r border-gray-300"> */}
        <FacultyList />
      
  
      {/* Form Section */}
      <div className="w-2/3 p-6">
      <h1 className="text-center font-bold text-lg">Upload Here</h1>
        <div className="w-full max-w-xl mx-auto p-6 border border-gray-300 rounded-lg">
          <div className="mb-4">
            <label className="font-medium mb-2 block">Subject ID</label>
            <input
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter subject ID"
            />
          </div>
          <div className="mb-4">
            <label className="font-medium mb-2 block">Student Roll Number</label>
            <input
              type="text"
              value={studentRollNumber}
              onChange={(e) => setStudentRollNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter roll number"
            />
          </div>
          <div className="mb-4">
            <label className="font-medium mb-2 block">Faculty ID</label>
            <input
              type="text"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter faculty ID"
            />
          </div>
          <div className="w-full flex justify-between mb-6">
            <div className="flex flex-col items-center w-1/2">
              <label className="font-medium mb-2">Upload Question Paper</label>
              <FileUpload value={quefile} onChange={handleQueChange} />
            </div>
            <div className="flex flex-col items-center w-1/2">
              <label className="font-medium mb-2">Upload Answer Paper</label>
              <FileUpload value={ansfile} onChange={handleAnsChange} />
            </div>
          </div>
          <Button onClick={handleUpload} className="w-full">
            Upload
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
  
};

export default UploadPDF;
