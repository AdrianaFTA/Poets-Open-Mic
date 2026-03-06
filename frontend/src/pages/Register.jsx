import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await registerUser({ username, email, password });
      alert("Registration Successful!");
      navigate("/editor");
    } catch (error) {
      setMessage("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1e1e1e] p-12 rounded-[2rem] shadow-2xl border border-gray-800">
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-500">Create Account</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Pen Name</label>
            <input
              className="w-full bg-[#121212] border border-gray-800 p-5 rounded-2xl outline-none focus:border-purple-600 transition-all text-lg shadow-inner"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Email</label>
            <input
              className="w-full bg-[#121212] border border-gray-800 p-5 rounded-2xl outline-none focus:border-purple-600 transition-all text-lg shadow-inner"
              type="email"
              placeholder="poet@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-3 relative">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Password</label>
            <input
              className="w-full bg-[#121212] border border-gray-800 p-5 rounded-2xl outline-none focus:border-purple-600 transition-all text-lg shadow-inner"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-12 text-gray-500 hover:text-purple-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl transition-all mt-4 uppercase tracking-widest">
            Register
          </button>
        </form>

        {message && <p className="mt-8 text-center text-red-400 text-sm">{message}</p>}
      </div>
    </div>
  );
}