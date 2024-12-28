import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";  // Assuming Button component is custom
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AssignedSheetView = () => {
  const location = useLocation();
  const sheetData = location.state?.sheetData;
  const navigate = useNavigate();
  const ans_Pdf = sheetData?.Ans_Url || "";
  const que_Pdf = sheetData?.Ques_Url || "";

  const [currentPdf, setCurrentPdf] = useState(ans_Pdf);
  const [isAnsSelected, setIsAnsSelected] = useState(true);
  const [gradingData, setGradingData] = useState([
    { questionNumber: 1, marksObtained: "", comments: "" },
  ]);
  const [loading, setLoading] = useState(true);  // Track loading state

  const iframeRef = useRef(null);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...gradingData];
    updatedData[index][field] = value;
    setGradingData(updatedData);
  };

  const addNewForm = () => {
    setGradingData([ ...gradingData, { questionNumber: gradingData.length + 1, marksObtained: "", comments: "" }]);

    if (iframeRef.current) {
      iframeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const removeForm = (index) => {
    const updatedData = gradingData.filter((_, i) => i !== index);
    setGradingData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if an answer file is selected before submitting
    if (!isAnsSelected) {
      toast.error("No answer file selected.");
      return;
    }
  
    const totalMarks = gradingData.reduce(
      (total, item) => total + parseInt(item.marksObtained || 0),
      0
    );
  
    const data = {
      roll_number: sheetData?.roll_number,
      answers: gradingData,
      totalMarks: totalMarks,  // Include total marks in the submission data
    };
  
    try {
      // Submit the grading data first
      const response = await fetch("http://localhost:5000/student/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success("Grading added successfully");
  
        // After successful grading submission, update the document status and total marks
        const updateResponse = await fetch(
          `http://localhost:5000/update/${sheetData?._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "completed",  // Updating the status to "completed"
              marks: totalMarks  // Update the marks with the calculated total
            }),
          }
        );
  
        const updateResult = await updateResponse.json();
        if (updateResponse.ok) {
          console.log("Updated");
          setTimeout(()=>{
            navigate("/assigned-sheets");
          },2000)
        } else {
          toast.error(updateResult.message || "Error updating document status");
        }
      } else {
        toast.error(result.message || "Error submitting grading");
      }
    } catch (error) {
      toast.error("Server error: " + error.message);
    }
  };
  
  

  const handleButtonClick = (pdfUrl, isAns) => {
    setCurrentPdf(pdfUrl);
    setIsAnsSelected(isAns);
    setLoading(true);  // Start loading when a new PDF is selected
  };

  const handleIframeLoad = () => {
    setLoading(false);  // Stop loading when the PDF is fully loaded
  };

  useEffect(() => {
    setCurrentPdf(ans_Pdf);
  }, [ans_Pdf]);

  return (
    <div className="h-screen flex items-center bg-gray-100">
      <div className="w-[50%] flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-6">Student Id: {sheetData?.roll_number}</h1>

        {/* Buttons for selecting PDFs */}
        <div className="flex justify-center mb-4">
          <Button
            className={`mx-2 py-2 px-4 ${isAnsSelected ? "bg-black text-white" : "bg-transparent text-black border"}`}
            onClick={() => handleButtonClick(ans_Pdf, true)}
          >
            AnswerSheet
          </Button>

          <Button
            className={`mx-2 py-2 px-4 ${!isAnsSelected ? "bg-black text-white" : "bg-transparent text-black border"}`}
            onClick={() => handleButtonClick(que_Pdf, false)}
          >
            QuestionPaper
          </Button>
        </div>

        {/* PDF Viewer */}
        <div className="w-full flex justify-center mb-6">
          {loading && (
            <div className="absolute text-center w-full text-lg mt-[300px] text-gray-500">
              <p className="text-black animate-bounce text-center">Loading PDF...</p> {/* Or add a spinner here */}
            </div>
          )}
          {currentPdf ? (
            <iframe
              ref={iframeRef}
              src={currentPdf}
              allowFullScreen
              height="600px"
              width="80%"
              className="border rounded-2xl sticky top-0"
              onLoad={handleIframeLoad}  // Set the loading state to false when iframe loads
            ></iframe>
          ) : (
            <p className="text-gray-500 text-lg">No PDF selected.</p>
          )}
        </div>
      </div>

      {/* Grading Form Section */}
      <div className="h-screen w-1/2 rounded-3xl p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full p-4 bg-white rounded-lg shadow-lg">
          {gradingData.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Question {item.questionNumber}</label>
                <button
                  type="button"
                  onClick={() => removeForm(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>

              {/* Marks Obtained */}
              <input
                type="number"
                value={item.marksObtained}
                max={10}
                onChange={(e) => handleInputChange(index, "marksObtained", e.target.value)}
                placeholder="Marks Obtained"
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              />

              {/* Comments */}
              <textarea
                value={item.comments}
                onChange={(e) => handleInputChange(index, "comments", e.target.value)}
                placeholder="Comments"
                rows="3"
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}

          {/* Button to add a new question */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={addNewForm}
              className="mx-2 py-2 px-4 rounded-full bg-transparent text-black text-2xl hover:none"
            >
              +
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button  type="submit" className="mx-2 py-2 px-4">
              Submit Grading
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
