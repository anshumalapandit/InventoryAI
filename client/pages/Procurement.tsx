import Layout from "@/components/Layout";
import { ShoppingCart, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function ProcurementDashboard() {
  return (
    <Layout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Procurement Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Suggested purchase requisitions, slow-moving vs. high-demand parts analysis
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Pending Orders", value: "23", trend: "Processing" },
            { label: "Approved POs", value: "87", trend: "This month" },
            { label: "Supplier Count", value: "34", trend: "Active partners" },
            { label: "Avg Lead Time", value: "8.2 days", trend: "Industry avg" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Suggested Purchase Requisitions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            AI-Generated Purchase Requisitions
          </h2>
          <div className="space-y-3">
            {[
              {
                part: "Part #NS-4521",
                qty: "750 units",
                supplier: "TechSupply Inc.",
                cost: "$18,750",
                priority: "High",
              },
              {
                part: "Part #ME-8934",
                qty: "500 units",
                supplier: "Global Parts Ltd.",
                cost: "$12,500",
                priority: "Medium",
              },
              {
                part: "Part #EL-2341",
                qty: "1200 units",
                supplier: "Premium Components",
                cost: "$28,800",
                priority: "High",
              },
            ].map((req) => (
              <div
                key={req.part}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{req.part}</p>
                      <p className="text-sm text-muted-foreground">{req.supplier}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{req.qty}</p>
                  <p className="text-sm text-muted-foreground">{req.cost}</p>
                </div>
                <div className="ml-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      req.priority === "High"
                        ? "bg-critical/10 text-critical"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {req.priority}
                  </span>
                </div>
                <button className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90">
                  Create PO
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Slow-Moving vs High-Demand Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Slow-Moving Parts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown size={24} className="text-warning" />
              <h2 className="text-2xl font-bold text-foreground">
                Slow-Moving Parts
              </h2>
            </div>
            <div className="space-y-2">
              {[
                { part: "Part #OLD-1234", qty: "450 units", motion: "Not moved in 90 days" },
                { part: "Part #LG-5678", qty: "300 units", motion: "Not moved in 75 days" },
                { part: "Part #OP-9012", qty: "200 units", motion: "Not moved in 120 days" },
              ].map((item) => (
                <div
                  key={item.part}
                  className="rounded-lg border border-warning/30 bg-warning/5 p-4"
                >
                  <p className="font-medium text-foreground">{item.part}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {item.qty} • {item.motion}
                    </p>
                    <button className="text-xs font-medium text-warning hover:text-warning/80">
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Demand Parts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-success" />
              <h2 className="text-2xl font-bold text-foreground">
                High-Demand Parts
              </h2>
            </div>
            <div className="space-y-2">
              {[
                { part: "Part #HOT-3421", demand: "↑ 45% this month", trend: "Fast moving" },
                { part: "Part #POP-5678", demand: "↑ 38% this month", trend: "Increasing" },
                { part: "Part #NEW-9012", demand: "↑ 52% this month", trend: "Very fast" },
              ].map((item) => (
                <div
                  key={item.part}
                  className="rounded-lg border border-success/30 bg-success/5 p-4"
                >
                  <p className="font-medium text-foreground">{item.part}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {item.demand} • {item.trend}
                    </p>
                    <button className="text-xs font-medium text-success hover:text-success/80">
                      Increase stock →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Performance */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Top Suppliers</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              {[
                { name: "TechSupply Inc.", onTime: 96, quality: 99, cost: "Competitive" },
                { name: "Global Parts Ltd.", onTime: 92, quality: 95, cost: "Standard" },
                { name: "Premium Components", onTime: 98, quality: 98, cost: "Premium" },
              ].map((supplier) => (
                <div
                  key={supplier.name}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{supplier.name}</p>
                    <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
                      <span>On-Time: {supplier.onTime}%</span>
                      <span>Quality: {supplier.quality}%</span>
                      <span>{supplier.cost}</span>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-primary/80">
                    View details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
