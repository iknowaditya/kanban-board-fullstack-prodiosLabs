import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-100 transition"
        >
          Kanban Board
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-blue-100">
              Hey, {user.username || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors"
              aria-label="Logout"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="flex items-center gap-1 hover:underline hover:text-blue-200 border border-blue-200 px-4 py-2 rounded-md transition-colors"
              aria-label="Login"
            >
              <FiLogIn /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 hover:underline hover:text-blue-200 border border-blue-200 px-4 py-2 rounded-md transition-colors"
              aria-label="Register"
            >
              <FiUserPlus /> Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
