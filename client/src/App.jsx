import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Board from "./components/Board";
import Navbar from "./components/Navbar";

import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, getCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthOnMount = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token && !user) {
          await getCurrentUser(); // ✅ Get user from token
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthOnMount();
  }, [user, getCurrentUser]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={user ? <Board /> : <Login />} />
      </Routes>
    </div>
  );
}

export default App;
