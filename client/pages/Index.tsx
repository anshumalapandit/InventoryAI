import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  AlertCircle,
  Zap,
  BarChart3,
  Users,
  Clock,
  Moon,
  Sun,
  Menu,
  X,
  CheckCircle2,
  Warehouse,
  Truck,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Forecasting",
      description:
        "Machine learning models that predict demand with 92%+ accuracy using your historical data",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: AlertCircle,
      title: "Smart Alerts",
      description:
        "Real-time notifications for stockouts, overstock, and supply chain bottlenecks",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Optimization Engine",
      description:
        "Automatically suggest reorder quantities and timings to minimize costs",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Interactive dashboards with exportable reports and real-time KPIs",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description:
        "Tailored views for admins, plant managers, and analysts with fine-grained permissions",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Truck,
      title: "ERP Integration",
      description:
        "Seamless integration with SAP, Oracle NetSuite, and your existing systems",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const stats = [
    {
      icon: BarChart3,
      label: "Avg. Inventory Reduction",
      value: "34%",
      description: "Lower carrying costs",
    },
    {
      icon: Clock,
      label: "Lead Time Accuracy",
      value: "92%",
      description: "Fewer surprises",
    },
    {
      icon: AlertCircle,
      label: "Stockout Prevention",
      value: "67%",
      description: "Fewer lost sales",
    },
    {
      icon: Zap,
      label: "Setup Time",
      value: "<1 day",
      description: "Start immediately",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP Operations",
      company: "Global Manufacturing Inc.",
      image: "🏭",
      quote:
        "This platform reduced our safety stock by 28% while improving service levels. Incredible ROI.",
    },
    {
      name: "Michael Chen",
      role: "Supply Chain Manager",
      company: "ElectroTech Solutions",
      image: "⚙️",
      quote:
        "The AI recommendations are spot-on. We've cut our reorder cycle from 2 weeks to 2 days.",
    },
    {
      name: "Emma Rodriguez",
      role: "Plant Director",
      company: "Precision Manufacturing Co.",
      image: "🏢",
      quote:
        "Best inventory tool we've used. The forecasting is accurate and the UI is intuitive.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-transparent transition-all duration-300",
          scrolled && "border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-6">
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground hidden sm:inline">
                Inventory<span className="text-primary">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Features
              </a>
              <a href="#stats" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Impact
              </a>
              <a href="#testimonials" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Customers
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link
                to="/login"
                className="hidden sm:inline-block text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="hidden sm:inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Get Started
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary md:hidden"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="border-t border-border py-4 space-y-2 md:hidden animate-slide-down">
              <a href="#features" className="block rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Features
              </a>
              <a href="#stats" className="block rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Impact
              </a>
              <a href="#testimonials" className="block rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Customers
              </a>
              <Link
                to="/login"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Zap size={16} />
                  Powered by Advanced AI
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Inventory Forecasting Reimagined
                </h1>
                <p className="text-xl text-muted-foreground">
                  Optimize inventory, prevent stockouts, and free up working capital with
                  AI-driven demand forecasting and automated reorder suggestions.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
                >
                  Try for Free
                  <ArrowRight size={20} />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-8 py-4 font-semibold text-foreground transition-all hover:bg-secondary active:scale-95">
                  Watch Demo
                </button>
              </div>

            </div>

            {/* Right Visual */}
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
              <div className="relative space-y-4 p-6">
                {/* KPI Card 1 */}
                <div className="card-lift rounded-xl bg-card border border-border p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Inventory Health
                    </span>
                    <TrendingUp size={16} className="text-success" />
                  </div>
                  <div className="text-3xl font-bold text-success">92%</div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 w-[92%] rounded-full bg-success transition-all duration-500" />
                  </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="card-lift rounded-xl bg-card border border-border p-4">
                    <div className="text-xs text-muted-foreground mb-1">Critical Items</div>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-xs text-critical mt-1">4 over threshold</div>
                  </div>
                  <div className="card-lift rounded-xl bg-card border border-border p-4">
                    <div className="text-xs text-muted-foreground mb-1">Low Stock</div>
                    <div className="text-2xl font-bold text-foreground">48</div>
                    <div className="text-xs text-warning mt-1">Reorder soon</div>
                  </div>
                </div>

                {/* Forecast Card */}
                <div className="card-lift rounded-xl bg-card border border-border p-4">
                  <div className="text-sm font-medium text-foreground mb-3">
                    30-Day Forecast
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">High Demand</span>
                      <span className="font-bold text-foreground">67%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 w-[67%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-y border-border bg-secondary/30 px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
              Powerful Features for Modern Manufacturing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize inventory across your entire supply chain
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card-lift group rounded-2xl border border-border bg-card p-8 transition-all"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                      feature.color
                    )}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="stats" className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
              Proven Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See the real results our customers are achieving
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="card-lift rounded-xl border border-border bg-card p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-y border-border bg-secondary/30 px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="card-lift rounded-xl border border-border bg-card p-8 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. Start free, scale as you grow.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for getting started",
                features: ["1 Plant", "Up to 500 SKUs", "Basic Forecasting", "Email Support"],
              },
              {
                name: "Pro",
                price: "$499",
                period: "/month",
                description: "For growing teams",
                highlighted: true,
                features: [
                  "Unlimited Plants",
                  "Unlimited SKUs",
                  "Advanced AI Forecasting",
                  "Role-Based Access",
                  "ERP Integration",
                  "Priority Support",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large operations",
                features: [
                  "Everything in Pro",
                  "Custom Models",
                  "Dedicated Support",
                  "SLA Guarantee",
                  "On-Premise Option",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "card-lift rounded-2xl border-2 p-8 transition-all",
                  plan.highlighted
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border bg-card"
                )}
              >
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>
                <button
                  className={cn(
                    "w-full rounded-lg px-4 py-3 font-semibold transition-all mb-6",
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border text-foreground hover:bg-secondary"
                  )}
                >
                  Get Started
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-border bg-secondary/30 px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Optimize Your Inventory?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Join manufacturing leaders in transforming their supply chain with AI
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-all hover:shadow-lg active:scale-95"
            >
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white/10">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-foreground">InventoryAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered inventory optimization for manufacturing
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#features" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 InventoryAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
