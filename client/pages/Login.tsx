import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "manager" | "analyst" | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password || !role) {
        throw new Error("Please fill all fields and select a role");
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", data.data.token);

      // Redirect based on role
      const roleRoutes = {
        admin: "/admin",
        manager: "/operations",
        analyst: "/analytics",
      };

      navigate(roleRoutes[data.data.user.role as keyof typeof roleRoutes] || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 animate-in-fade">
          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Zap className="h-7 w-7 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your inventory forecasting dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2.5 text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link
                to="/forgot-password"
                className="inline-block text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Login As (Role)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "admin", label: "Admin", description: "System control" },
                  { value: "manager", label: "Manager", description: "Plant ops" },
                  { value: "analyst", label: "Analyst", description: "Read-only" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value as typeof role)}
                    className={`relative rounded-lg border-2 p-3 text-center transition-all ${
                      role === r.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-semibold text-foreground">
                      {r.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-critical/10 p-3 text-sm text-critical">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* SSO Demo */}
          <button
            type="button"
            className="w-full rounded-lg border border-input bg-card px-4 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Sign in with Google
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
              Create one
            </Link>
          </div>

          {/* Inspirational Quote */}
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              💡 Did you know?
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground italic">
                "The best-run companies are data-driven, and inventory management is where data truly powers profitability."
              </p>
              <p className="text-xs text-primary font-medium">
                Transform your inventory into insights with AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
