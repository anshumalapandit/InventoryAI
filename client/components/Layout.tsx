import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Factory,
  ShoppingCart,
  Settings,
  Zap,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useHasRole } from "@/components/ProtectedRoute";
import Chatbot from "@/components/Chatbot";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = useHasRole("admin");
  const isManager = useHasRole("manager");
  const isAnalyst = useHasRole("analyst");

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const isActive = (path: string) => location.pathname === path;

  // Get navigation items based on user role
  // Get role-specific home route
  const getRoleHomeRoute = (role: string) => {
    const roleRoutes = {
      admin: "/admin",
      manager: "/plant-manager",
      analyst: "/analytics",
    };
    return roleRoutes[role as keyof typeof roleRoutes] || "/";
  };

  const getNavigationItems = () => {
    const roleSpecificDashboard = user ? getRoleHomeRoute(user.role) : "/login";
    const baseItems = [
      {
        label: "Home",
        href: "/",
        icon: Zap,
        badge: "Landing",
        roles: ["admin", "manager", "analyst"],
      },
      {
        label: "Dashboard",
        href: roleSpecificDashboard,
        icon: BarChart3,
        badge: "Overview",
        roles: ["admin", "manager", "analyst"],
      },
    ];

    const roleItems = {
      admin: [
        {
          label: "Admin Panel",
          href: "/admin",
          icon: Settings,
          badge: "System",
          roles: ["admin"],
        },
        {
          label: "Integrations",
          href: "/integration",
          icon: Zap,
          badge: "API",
          roles: ["admin"],
        },
      ],
      manager: [
        {
          label: "Plant Manager",
          href: "/plant-manager",
          icon: Factory,
          badge: "Plant",
          roles: ["manager"],
        },
        {
          label: "Procurement",
          href: "/procurement",
          icon: ShoppingCart,
          badge: "Orders",
          roles: ["manager"],
        },
        {
          label: "Operations",
          href: "/operations",
          icon: BarChart3,
          badge: "Tasks",
          roles: ["manager"],
        },
      ],
      analyst: [
        {
          label: "Analytics",
          href: "/analytics",
          icon: BarChart3,
          badge: "Data",
          roles: ["analyst"],
        },
        {
          label: "Forecasting",
          href: "/forecasting",
          icon: Zap,
          badge: "AI",
          roles: ["analyst"],
        },
      ],
    };

    const userRole = user?.role as keyof typeof roleItems;
    const items = [...baseItems];

    if (userRole && roleItems[userRole]) {
      items.push(...roleItems[userRole]);
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
                        {/* Logo always links to landing page */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-xl font-semibold text-sidebar-foreground">
                InventoryAI
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            {user && (
              <div className="flex items-center gap-3 border-l border-border pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r border-border bg-sidebar transition-all duration-300",
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          )}
        >
          <nav className="space-y-1 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon size={20} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs opacity-75">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent p-4">
              <h3 className="mb-2 text-sm font-semibold text-sidebar-foreground">
                Quick Stats
              </h3>
              <div className="space-y-2 text-xs text-sidebar-foreground">
                <div className="flex justify-between">
                  <span>Total Parts:</span>
                  <span className="font-bold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical:</span>
                  <span className="font-bold text-critical">12</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Global Chatbot */}
      <Chatbot />
    </div>
  );
}
