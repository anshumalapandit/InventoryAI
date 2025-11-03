import { useState } from "react";
import Layout from "@/components/Layout";
import ForecastChart from "@/components/ForecastChart";
import DataTable from "@/components/DataTable";
import { BarChart3, TrendingUp, Calendar, Download, Filter, Eye, DownloadCloud, Sliders, LineChart } from "lucide-react";

export default function AnalystPortal() {
  const [activeSection, setActiveSection] = useState<"forecasting" | "analytics" | "reports" | "scenarios">("forecasting");
  const [selectedHorizon, setSelectedHorizon] = useState("30");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <Layout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Analyst Portal</h1>
          <p className="text-lg text-muted-foreground">
            Advanced forecasting, analytics, scenario simulations, and reports
          </p>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "forecasting" as const, label: "Forecasting", icon: TrendingUp },
              { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
              { id: "scenarios" as const, label: "Scenarios", icon: Sliders },
              { id: "reports" as const, label: "Reports", icon: LineChart },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === "forecasting" && (
          <ForecastingSection horizon={selectedHorizon} onHorizonChange={setSelectedHorizon} category={selectedCategory} onCategoryChange={setSelectedCategory} />
        )}
        {activeSection === "analytics" && <AnalyticsSection />}
        {activeSection === "scenarios" && <ScenariosSection />}
        {activeSection === "reports" && <ReportsSection />}
      </div>
    </Layout>
  );
}

// Forecasting Section
function ForecastingSection({ horizon, onHorizonChange, category, onCategoryChange }: any) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Demand Forecasting</h2>
          <p className="mt-1 text-sm text-muted-foreground">AI-powered demand predictions with confidence intervals</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <DownloadCloud size={16} />
          Export Forecast
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-foreground">Forecast Horizon</label>
          <div className="mt-2 flex gap-2">
            {["7", "30", "90", "365"].map((h) => (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  horizon === h
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                {h} days
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Product Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground"
          >
            <option value="all">All Categories</option>
            <option value="components">Components</option>
            <option value="electronics">Electronics</option>
            <option value="structure">Structure</option>
            <option value="hardware">Hardware</option>
          </select>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Aggregated {horizon}-Day Forecast</h3>
        <p className="mt-1 text-sm text-muted-foreground">Category: {category === "all" ? "All Products" : category}</p>
        <div className="mt-6">
          <ForecastChart />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">Forecast Accuracy</p>
            <p className="mt-1 text-2xl font-bold text-foreground">92.4%</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">Confidence Level</p>
            <p className="mt-1 text-2xl font-bold text-foreground">95%</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">Projected Demand</p>
            <p className="mt-1 text-2xl font-bold text-foreground">245K units</p>
          </div>
        </div>
      </div>

      {/* Product-Level Forecasts */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Product-Level Forecasts</h3>
        <div className="mt-6">
          <ProductForecastTable horizon={horizon} />
        </div>
      </div>
    </div>
  );
}

// Analytics Section
function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Inventory Turnover", value: "4.2x", change: "+0.3x", trend: "positive" },
          { label: "Stockout Risk", value: "3.2%", change: "-1.1%", trend: "positive" },
          { label: "Carrying Cost/Month", value: "$124.5K", change: "-$12K", trend: "positive" },
          { label: "Forecast Accuracy", value: "92.4%", change: "+2.1%", trend: "positive" },
        ].map((stat) => (
          <AnalyticsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Stock Movement Trends</h3>
          <div className="mt-6 space-y-4">
            {[
              { category: "Components", inbound: 1200, outbound: 980, balance: 220 },
              { category: "Electronics", inbound: 450, outbound: 520, balance: -70 },
              { category: "Structure", inbound: 3200, outbound: 2800, balance: 400 },
            ].map((item) => (
              <div key={item.category} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                <p className="font-medium text-foreground">{item.category}</p>
                <div className="mt-2 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Inbound</p>
                    <p className="text-lg font-bold text-success">{item.inbound}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Outbound</p>
                    <p className="text-lg font-bold text-critical">{item.outbound}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Net Balance</p>
                    <p className={`text-lg font-bold ${item.balance >= 0 ? "text-success" : "text-critical"}`}>{item.balance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Supplier Performance</h3>
          <div className="mt-6 space-y-4">
            {[
              { supplier: "ElectroTech Ltd", score: 98, trend: "+2" },
              { supplier: "Precision Parts Co", score: 92, trend: "+1" },
              { supplier: "MotorWorks Inc", score: 85, trend: "-3" },
              { supplier: "Steel Supply Corp", score: 88, trend: "+4" },
            ].map((item) => (
              <div key={item.supplier} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0">
                <div>
                  <p className="font-medium text-foreground">{item.supplier}</p>
                  <div className="mt-1 h-1.5 w-24 rounded-full bg-secondary">
                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{item.score}%</p>
                  <p className={`text-xs ${item.trend.startsWith("+") ? "text-success" : "text-critical"}`}>{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Scenarios Section
function ScenariosSection() {
  const [demandChange, setDemandChange] = useState(0);
  const [leadTimeChange, setLeadTimeChange] = useState(0);

  const baseDemand = 50000;
  const projectedDemand = baseDemand * (1 + demandChange / 100);
  const bufferStock = 5000 * (1 + leadTimeChange / 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Scenario Simulation</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Demand Simulator */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Demand Scenario</h3>
          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Demand Change (%)</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={demandChange}
                onChange={(e) => setDemandChange(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">-50%</span>
                <span className="text-lg font-bold text-foreground">{demandChange}%</span>
                <span className="text-xs text-muted-foreground">+50%</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Base Demand</span>
                <span className="font-bold text-foreground">{baseDemand.toLocaleString()} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projected Demand</span>
                <span className="text-lg font-bold text-primary">{Math.round(projectedDemand).toLocaleString()} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Required Safety Stock</span>
                <span className="font-bold text-foreground">{Math.round(projectedDemand * 0.2).toLocaleString()} units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Time Simulator */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Supply Chain Scenario</h3>
          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Lead Time Change (%)</label>
              <input
                type="range"
                min="-30"
                max="50"
                value={leadTimeChange}
                onChange={(e) => setLeadTimeChange(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">-30%</span>
                <span className="text-lg font-bold text-foreground">{leadTimeChange}%</span>
                <span className="text-xs text-muted-foreground">+50%</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Lead Time</span>
                <span className="font-bold text-foreground">7.5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Adjusted Lead Time</span>
                <span className="text-lg font-bold text-primary">{(7.5 * (1 + leadTimeChange / 100)).toFixed(1)} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Buffer Stock Required</span>
                <span className="font-bold text-foreground">{Math.round(bufferStock).toLocaleString()} units</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Impact Analysis</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Carrying Cost Impact", value: (demandChange * 0.5).toFixed(1) + "%", color: demandChange > 0 ? "text-critical" : "text-success" },
            { label: "Stockout Risk", value: Math.max(0, 3.2 - demandChange * 0.1).toFixed(1) + "%", color: "text-warning" },
            { label: "Order Frequency", value: (8 + demandChange * 0.05).toFixed(0) + " times/month", color: "text-foreground" },
            { label: "Cash Flow Impact", value: (leadTimeChange * 2).toFixed(0) + "%", color: leadTimeChange > 0 ? "text-critical" : "text-success" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reports Section
function ReportsSection() {
  const [reports] = useState([
    { id: "1", name: "Monthly Inventory Report", type: "PDF", date: "2024-02-01", size: "2.4 MB" },
    { id: "2", name: "Quarterly Forecast Analysis", type: "XLSX", date: "2024-01-31", size: "1.8 MB" },
    { id: "3", name: "Supplier Performance Review", type: "PDF", date: "2024-01-25", size: "3.2 MB" },
    { id: "4", name: "Stock Movement Analysis", type: "CSV", date: "2024-01-20", size: "0.9 MB" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Reports Library</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download size={16} />
          Generate Report
        </button>
      </div>

      <DataTable
        title=""
        columns={[
          { key: "name", label: "Report Name" },
          { key: "type", label: "Type" },
          { key: "date", label: "Generated" },
          { key: "size", label: "Size" },
        ]}
        data={reports}
        renderActions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg p-2 hover:bg-secondary" title="Download">
              <Download size={16} className="text-muted-foreground" />
            </button>
            <button className="rounded-lg p-2 hover:bg-secondary" title="View">
              <Eye size={16} className="text-muted-foreground" />
            </button>
          </div>
        )}
      />
    </div>
  );
}

// Helper Components
function AnalyticsCard({ label, value, change, trend }: any) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className={`mt-2 text-xs ${trend === "positive" ? "text-success" : "text-critical"}`}>
        {trend === "positive" ? "↑" : "↓"} {change}
      </p>
    </div>
  );
}

function ProductForecastTable({ horizon }: { horizon: string }) {
  const [products] = useState([
    { id: "1", sku: "SKU-001", name: "Motor Assembly", current: 450, forecast: 520, confidence: "95%", risk: "Low" },
    { id: "2", sku: "SKU-002", name: "Control Panel", current: 120, forecast: 280, confidence: "88%", risk: "High" },
    { id: "3", sku: "SKU-003", name: "Steel Frame", current: 4200, forecast: 3800, confidence: "96%", risk: "Low" },
    { id: "4", sku: "SKU-004", name: "Bearing Set", current: 85, forecast: 150, confidence: "87%", risk: "High" },
  ]);

  return (
    <DataTable
      title=""
      columns={[
        { key: "sku", label: "SKU" },
        { key: "name", label: "Product" },
        { key: "current", label: "Current Stock" },
        { key: "forecast", label: `${horizon}-Day Forecast` },
        { key: "confidence", label: "Confidence" },
        { key: "risk", label: "Risk Level", render: (risk) => (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            risk === "Low" ? "bg-success/20 text-success" : "bg-critical/20 text-critical"
          }`}>
            {risk}
          </span>
        )},
      ]}
      data={products}
    />
  );
}
