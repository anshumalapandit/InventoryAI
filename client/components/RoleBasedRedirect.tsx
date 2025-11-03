import { Navigate } from "react-router-dom";

export default function RoleBasedRedirect() {
  // Get user from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  const roleRoutes = {
    admin: "/admin",
    manager: "/plant-manager",
    analyst: "/analytics",
  };

  return <Navigate to={roleRoutes[user.role as keyof typeof roleRoutes] || "/login"} replace />;
}