import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Array<"admin" | "manager" | "analyst">;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  // Get user from localStorage
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userStr ? JSON.parse(userStr) : null;

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Special handling for manager role - managers can access all manager pages
  if (user.role === "manager" && allowedRoles.includes("manager")) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const roleDashboards = {
      admin: "/admin",
      manager: "/plant-manager", // Changed from /operations to /plant-manager
      analyst: "/analytics",
    };

    const redirectPath = roleDashboards[user.role as keyof typeof roleDashboards] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

// Custom hook to get current user
export function useCurrentUser() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  return user;
}

// Custom hook to check if user has a specific role
export function useHasRole(role: string | string[]): boolean {
  const user = useCurrentUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
}

// Custom hook for authentication
export function useAuth() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Force navigate to login
    navigate("/login", { replace: true });
  };

  const login = (email: string, password: string, role: string) => {
    const token = `token-${Date.now()}`;
    const userData = {
      id: `user-${Date.now()}`,
      email,
      role,
      token,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    navigate(`/${role}`, { replace: true });
  };

  return {
    user,
    isAuthenticated: !!user?.token,
    logout,
    login,
  };
}
