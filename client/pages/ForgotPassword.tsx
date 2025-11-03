import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Zap } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-in-fade">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </Link>

          {!submitted ? (
            <>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Reset Your Password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </>
          ) : (
            <>
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <Mail className="h-8 w-8 text-success" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We've sent a password reset link to <br />
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    The link will expire in 24 hours.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    If you don't receive the email, check your spam folder or try again.
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
