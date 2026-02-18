import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // First, I stop the page from refreshing so we don't lose our data
    e.preventDefault();
    setError("");

    try {
      // I'm sending the credentials to your backend on port 5000
      const data = await loginUser(formData);

      if (data.token) {
        // I'm saving the token and user info in localStorage. 
        // This is like a "VIP Pass" the browser shows the server for every request.
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Once logged in, I'll whisk you away to your profile!
        navigate("/profile");
      } else {
        // If the backend says no, I'll catch the error message here
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login ERROR:", err);
      setError("Cannot connect to server. Check if backend is running on port 5001");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#2a2a2a] p-8 rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <a href="/register" className="text-purple-400 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
}