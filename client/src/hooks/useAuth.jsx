import { createContext, useContext, useState } from "react";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser || savedUser === "undefined") return null;
      return JSON.parse(savedUser);
    } catch (e) {
      console.error("Error parsing saved user:", e);
      return null;
    }
  });

  // Register a new user
  const register = async (username, email, password) => {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");

    // Save token and user to localStorage
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // Login with email/password
  const login = async (email, password) => {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  //  Logout the user
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include", // to send cookies
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  //  Get current user from token
  const getCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const response = await fetch("http://localhost:5000/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Invalid token");

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Provide auth context values
  const value = { user, register, login, logout, getCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//  Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
