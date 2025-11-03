import Layout from "@/components/Layout";
import { Activity, AlertTriangle, Zap, BarChart3 } from "lucide-react";

export default function OperationsDashboard() {
  return (
    <Layout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Production schedules, inventory health, and predictive alerts
          </p>
        </div>

        {/* Real-time Status */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Production Rate", value: "94%", icon: Activity, color: "success" },
            { label: "Inventory Health", value: "92%", icon: BarChart3, color: "success" },
            { label: "Supply Issues", value: "3", icon: AlertTriangle, color: "warning" },
            { label: "System Status", value: "Optimal", icon: Zap, color: "success" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className={`mt-2 text-3xl font-bold ${
                      stat.color === "success" ? "text-success" : "text-warning"
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon
                    size={32}
                    className={stat.color === "success" ? "text-success/20" : "text-warning/20"}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Production Schedule */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Production Schedule</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              {[
                {
                  line: "Production Line A",
                  schedule: "Scheduled at 80% capacity",
                  buffer: "7 days buffer",
                  status: "On Track",
                },
                {
                  line: "Production Line B",
                  schedule: "Scheduled at 92% capacity",
                  buffer: "3 days buffer",
                  status: "Critical",
                },
                {
                  line: "Production Line C",
                  schedule: "Scheduled at 65% capacity",
                  buffer: "14 days buffer",
                  status: "Healthy",
                },
              ].map((item) => (
                <div key={item.line} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{item.line}</h3>
                    <span
                      className={`text-xs font-medium rounded-full px-3 py-1 ${
                        item.status === "Healthy"
                          ? "bg-success/10 text-success"
                          : item.status === "Critical"
                            ? "bg-critical/10 text-critical"
                            : "bg-warning/10 text-warning"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.schedule}</p>
                  <p className="text-xs text-muted-foreground">{item.buffer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Alerts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Predictive Alerts</h2>
          <div className="space-y-3">
            {[
              {
                alert: "Part #CS-2847 will stockout in 5 days",
                action: "Emergency purchase needed",
                priority: "critical",
              },
              {
                alert: "Production bottleneck predicted on Line B due to Part #ME-4521 shortage",
                action: "Expedite shipment recommended",
                priority: "critical",
              },
              {
                alert: "Overstock of Part #OLD-1234 detected - consider promotional sale",
                action: "Inventory optimization",
                priority: "warning",
              },
              {
                alert: "Supplier delay for Part #EL-2341 - arriving 3 days late",
                action: "Adjust production schedule",
                priority: "warning",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-lg border p-4 ${
                  item.priority === "critical"
                    ? "border-critical/30 bg-critical/5"
                    : "border-warning/30 bg-warning/5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.alert}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.action}</p>
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-primary/80">
                    Act →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Health by Category */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Inventory Health by Category</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { category: "Raw Materials", health: 88, parts: 340 },
              { category: "Components", health: 92, parts: 1250 },
              { category: "Spare Parts", health: 85, parts: 756 },
            ].map((item) => (
              <div
                key={item.category}
                className="rounded-lg border border-border bg-card p-6"
              >
                <h3 className="mb-4 font-semibold text-foreground">
                  {item.category}
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Health Score</span>
                    <span className="font-bold text-foreground">{item.health}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-success"
                      style={{ width: `${item.health}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.parts} parts tracked
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Supply Chain Bottlenecks */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Supply Chain Insights</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-semibold text-foreground">Bottlenecks Detected</h3>
                <div className="space-y-2">
                  {[
                    "Supplier #SUP-023 experiencing 5-day delays",
                    "Part #ME-4521 shortage affecting 3 production lines",
                    "Lead time for Part #EL-2341 increased by 40%",
                  ].map((bottleneck, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-critical flex-shrink-0" />
                      <span className="text-muted-foreground">{bottleneck}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-foreground">Recommendations</h3>
                <div className="space-y-2">
                  {[
                    "Activate secondary supplier for Part #ME-4521",
                    "Increase safety stock levels by 15%",
                    "Negotiate expedited shipping with Supplier #SUP-012",
                  ].map((rec, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
