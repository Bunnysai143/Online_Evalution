import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userData,setUserData] = useState("");


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json();
      console.log(data);
      setUserData(data);
      if (response.ok) {
        localStorage.setItem("userData",JSON.stringify(data));
        toast.success(`Login successful! Redirecting to the ${data?data.data.role:""} dashboard...`, {
          position: "top-right",
          autoClose: 3000,
        });
        
        if(data){
          localStorage.setItem("userData",JSON.stringify(data));
          
          if(data.data.role=="faculty"){
            setTimeout(() => {
          navigate(`/faculty/dashboard`);
        }, 3000);
          }
          else{
            setTimeout(() => {
              navigate(`/admin/dashboard`);
            }, 3000);
            
          }
        }
      } else {
        toast.error(data.message || "Login failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-700">User Login</h2>

          <div className="form-group">
            <label htmlFor="username" className="block text-gray-600">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-gray-600">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            New user?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
