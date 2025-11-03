import { useState } from "react";
import Layout from "@/components/Layout";
import { Check, AlertCircle, Settings, Key, RefreshCw, Trash2, Plus, Eye, EyeOff, TestTube } from "lucide-react";

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState<"erp" | "suppliers" | "ai" | "webhooks">("erp");

  return (
    <Layout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Enterprise Integrations</h1>
          <p className="text-lg text-muted-foreground">
            Connect with your ERP systems, supplier platforms, and AI services
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "erp" as const, label: "ERP Systems", icon: "📦" },
              { id: "suppliers" as const, label: "Supplier APIs", icon: "🚚" },
              { id: "ai" as const, label: "AI & ML", icon: "🤖" },
              { id: "webhooks" as const, label: "Webhooks", icon: "🔗" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "erp" && <ERPIntegrations />}
        {activeTab === "suppliers" && <SupplierIntegrations />}
        {activeTab === "ai" && <AIIntegrations />}
        {activeTab === "webhooks" && <WebhookIntegrations />}
      </div>
    </Layout>
  );
}

// ERP Integrations Section
function ERPIntegrations() {
  const [connections] = useState([
    {
      id: "1",
      name: "SAP ERP System",
      status: "Connected",
      lastSync: "2024-02-01 14:32:00",
      syncFrequency: "Real-time",
      recordsSynced: "45,230",
    },
    {
      id: "2",
      name: "Oracle NetSuite",
      status: "Disconnected",
      lastSync: "2024-01-28 08:15:00",
      syncFrequency: "Daily",
      recordsSynced: "12,450",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">ERP System Connections</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          Add ERP System
        </button>
      </div>

      {/* Connection Cards */}
      <div className="space-y-4">
        {connections.map((connection) => (
          <ERPConnectionCard key={connection.id} {...connection} />
        ))}
      </div>

      {/* Configuration Instructions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Setup Guide</h3>
        <div className="mt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
            <div>
              <p className="font-medium text-foreground">Obtain API Credentials</p>
              <p className="mt-1 text-sm text-muted-foreground">Get your API key, client ID, and endpoint URL from your ERP system</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
            <div>
              <p className="font-medium text-foreground">Configure Connection Details</p>
              <p className="mt-1 text-sm text-muted-foreground">Enter the credentials and select sync frequency</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
            <div>
              <p className="font-medium text-foreground">Test & Enable</p>
              <p className="mt-1 text-sm text-muted-foreground">Verify the connection and enable automatic syncing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Supplier Integrations Section
function SupplierIntegrations() {
  const [suppliers] = useState([
    { id: "1", name: "ElectroTech Supplier Portal", endpoint: "https://api.electrotech.com", status: "Connected", apiVersion: "v2.1" },
    { id: "2", name: "Precision Parts API", endpoint: "https://api.precisionparts.io", status: "Testing", apiVersion: "v1.0" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Supplier API Connections</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          Add Supplier API
        </button>
      </div>

      {/* Supplier Connection Cards */}
      <div className="space-y-4">
        {suppliers.map((supplier) => (
          <SupplierConnectionCard key={supplier.id} {...supplier} />
        ))}
      </div>

      {/* Supported Suppliers */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Native Integrations Available</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { name: "ElectroTech Supplier Portal", type: "REST API", status: "Ready" },
            { name: "Precision Parts", type: "EDI/REST", status: "Ready" },
            { name: "MotorWorks Distribution", type: "REST API", status: "Ready" },
            { name: "Steel Supply", type: "EDI", status: "In Development" },
          ].map((supplier) => (
            <div key={supplier.name} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
              <div>
                <p className="font-medium text-foreground">{supplier.name}</p>
                <p className="text-xs text-muted-foreground">{supplier.type}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                supplier.status === "Ready" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
              }`}>
                {supplier.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AI Integrations Section
function AIIntegrations() {
  const [geminiKey, setGeminiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">AI & ML Services</h2>

      {/* Gemini API Configuration */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Google Gemini API</h3>
            <p className="mt-1 text-sm text-muted-foreground">AI-powered chatbot and recommendation engine</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            isConfigured ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
          }`}>
            {isConfigured ? "Configured" : "Not Configured"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">API Key</label>
            <div className="mt-2 flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-foreground"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="rounded-lg border border-input bg-background p-2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Model</label>
              <select className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground">
                <option>gemini-pro</option>
                <option>gemini-pro-vision</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Temperature</label>
              <input type="number" defaultValue="0.7" min="0" max="1" step="0.1" className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setIsConfigured(!!geminiKey)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Check size={16} />
              Save Configuration
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
              <TestTube size={16} />
              Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* ML Model Training Configuration */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Demand Forecasting Models</h3>
        <div className="mt-6 space-y-4">
          {[
            { name: "Demand Forecast v2.1", engine: "TensorFlow", status: "Active", accuracy: "92.4%" },
            { name: "Seasonal Pattern v1.8", engine: "scikit-learn", status: "Active", accuracy: "88.7%" },
            { name: "Anomaly Detection v1.2", engine: "PyOD", status: "Testing", accuracy: "85.2%" },
          ].map((model) => (
            <div key={model.name} className="flex items-center justify-between border-b border-border pb-4 last:border-b-0">
              <div>
                <p className="font-medium text-foreground">{model.name}</p>
                <p className="text-xs text-muted-foreground">Engine: {model.engine}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-foreground">{model.accuracy}</p>
                  <p className="text-xs text-muted-foreground">{model.status}</p>
                </div>
                <button className="rounded-lg p-2 hover:bg-secondary">
                  <Settings size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Webhooks Section
function WebhookIntegrations() {
  const [webhooks] = useState([
    {
      id: "1",
      event: "Inventory Level Changed",
      endpoint: "https://yourapp.com/webhooks/inventory",
      status: "Active",
      deliveryRate: "99.8%",
    },
    {
      id: "2",
      event: "Forecast Updated",
      endpoint: "https://yourapp.com/webhooks/forecast",
      status: "Active",
      deliveryRate: "98.5%",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Webhook Endpoints</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          Add Webhook
        </button>
      </div>

      {/* Webhook Cards */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{webhook.event}</h3>
                <p className="mt-1 text-xs font-mono text-muted-foreground">{webhook.endpoint}</p>
                <div className="mt-4 flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span className="inline-flex items-center rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success">
                      {webhook.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Rate</p>
                    <p className="text-sm font-bold text-foreground">{webhook.deliveryRate}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg p-2 hover:bg-secondary">
                  <Settings size={16} className="text-muted-foreground" />
                </button>
                <button className="rounded-lg p-2 hover:bg-secondary">
                  <Trash2 size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Events Documentation */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Available Webhook Events</h3>
        <div className="mt-6 space-y-3">
          {[
            "inventory.level.changed",
            "forecast.updated",
            "alert.triggered",
            "reorder.created",
            "purchase.order.received",
            "supplier.performance.updated",
          ].map((event) => (
            <div key={event} className="flex items-center gap-2 text-sm">
              <code className="rounded bg-secondary/50 px-2 py-1 text-xs font-mono text-muted-foreground">{event}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ERPConnectionCard({ name, status, lastSync, syncFrequency, recordsSynced }: any) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === "Connected" ? "bg-success/20 text-success" : "bg-critical/20 text-critical"
            }`}>
              {status}
            </span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Last Sync</p>
              <p className="text-sm font-medium text-foreground">{lastSync}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sync Frequency</p>
              <p className="text-sm font-medium text-foreground">{syncFrequency}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Records Synced</p>
              <p className="text-sm font-medium text-foreground">{recordsSynced}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg p-2 hover:bg-secondary" title="Refresh">
            <RefreshCw size={16} className="text-muted-foreground" />
          </button>
          <button className="rounded-lg p-2 hover:bg-secondary" title="Settings">
            <Settings size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplierConnectionCard({ name, endpoint, status, apiVersion }: any) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === "Connected" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
            }`}>
              {status}
            </span>
          </div>
          <p className="mt-1 text-xs font-mono text-muted-foreground">{endpoint}</p>
          <p className="mt-2 text-xs text-muted-foreground">API Version: {apiVersion}</p>
        </div>
        <button className="rounded-lg p-2 hover:bg-secondary">
          <Settings size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
