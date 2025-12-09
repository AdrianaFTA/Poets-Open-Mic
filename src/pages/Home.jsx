import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to a Poet's Open Mic
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Write a Poem
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}