import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DataTable from "@/components/DataTable";
import { Users, Database, Brain, AlertCircle, TrendingUp, Package, Settings, Eye, Trash2, Edit2, Plus, Download, Filter, BarChart3, Loader, X } from "lucide-react";
import { useHasRole } from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<"overview" | "users" | "plants" | "products" | "models" | "alerts" | "exports">("overview");
  const isAdmin = useHasRole("admin");

  if (!isAdmin) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">You don't have permission to access this dashboard.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Full access to all plant data, supplier integrations, AI models, and user management
          </p>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "overview" as const, label: "Overview", icon: BarChart3 },
              { id: "users" as const, label: "Users & Roles", icon: Users },
              { id: "plants" as const, label: "Plants", icon: Database },
              { id: "products" as const, label: "Products", icon: Package },
              { id: "models" as const, label: "AI Models", icon: Brain },
              { id: "alerts" as const, label: "Alerts", icon: AlertCircle },
              { id: "exports" as const, label: "Exports", icon: Download },
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
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "users" && <UsersSection />}
        {activeSection === "plants" && <PlantsSection />}
        {activeSection === "products" && <ProductsSection />}
        {activeSection === "models" && <ModelsSection />}
        {activeSection === "alerts" && <AlertsSection />}
        {activeSection === "exports" && <ExportsSection />}
      </div>
    </Layout>
  );
}

// Overview Section
function OverviewSection() {
  const [stats, setStats] = useState({
    totalPlants: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalModels: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [usersRes, plantsRes, productsRes, modelsRes] = await Promise.all([
          fetch("/api/users", { headers }),
          fetch("/api/plants", { headers }),
          fetch("/api/products", { headers }),
          fetch("/api/ai-models", { headers }),
        ]);

        const usersData = await usersRes.json();
        const plantsData = await plantsRes.json();
        const productsData = await productsRes.json();
        const modelsData = await modelsRes.json();

        setStats({
          totalPlants: plantsData.data?.length || 0,
          activeUsers: usersData.data?.length || 0,
          totalProducts: productsData.data?.length || 0,
          totalModels: modelsData.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {loading ? (
          Array(4).fill(null).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6 animate-pulse">
              <div className="h-4 bg-secondary rounded w-24 mb-2"></div>
              <div className="h-8 bg-secondary rounded w-12 mb-2"></div>
              <div className="h-3 bg-secondary rounded w-32"></div>
            </div>
          ))
        ) : (
          [
            { label: "Total Plants", value: stats.totalPlants.toString(), trend: "Active plants", color: "primary" },
            { label: "Active Users", value: stats.activeUsers.toString(), trend: "Total users", color: "success" },
            { label: "Total Products", value: stats.totalProducts.toString(), trend: "In inventory", color: "success" },
            { label: "AI Models", value: stats.totalModels.toString(), trend: "Deployed models", color: "primary" },
          ].map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))
        )}
      </div>

      {/* System Health */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">System Health</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            {[
              { label: "API Uptime", value: 99.99 },
              { label: "Data Processing Health", value: 98.5 },
              { label: "Model Training Queue", value: 75 },
            ].map((health) => (
              <HealthBar key={health.label} label={health.label} value={health.value} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">System Management</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: Users,
              title: "User Management",
              description: "Create and manage user accounts, roles, and permissions across all plants",
            },
            {
              icon: Database,
              title: "Supplier Integrations",
              description: "Connect and manage ERP systems (SAP, Oracle NetSuite) and supplier APIs",
            },
            {
              icon: Brain,
              title: "AI Model Configuration",
              description: "Train, test, and deploy demand forecasting models",
            },
            {
              icon: AlertCircle,
              title: "Alert Rules",
              description: "Configure critical inventory thresholds and notification settings",
            },
          ].map((card) => (
            <QuickActionCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Users Section
function UsersSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "manager" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all fields");
      return;
    }

    // If creating new user, password is required
    if (!editingId && !formData.password) {
      alert("Password is required for new users");
      return;
    }

    try {
      const url = editingId ? `/api/users/${editingId}` : "/api/users";
      const method = editingId ? "PUT" : "POST";

      // Only include password if creating new user or password field is filled
      const payload = editingId && !formData.password 
        ? { name: formData.name, email: formData.email, role: formData.role }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
        setFormData({ name: "", email: "", password: "", role: "manager" });
        setEditingId(null);
      } else {
        alert(data.message || "Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role, password: "" });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", email: "", password: "", role: "manager" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <DataTable
          title=""
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "created_at", label: "Created", render: (date) => new Date(date).toLocaleDateString() },
            { 
              key: "id", 
              label: "Actions",
              render: (id, user) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-muted-foreground" />
                  </button>
                </div>
              )
            },
          ]}
          data={users}
        />
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {editingId ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="john@company.com"
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Required for new users</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Plants Section
function PlantsSection() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", location: "", capacity: "" });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/plants", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setPlants(data.data);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location || !formData.capacity) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/plants/${editingId}` : "/api/plants";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ...formData, capacity: parseInt(formData.capacity) }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPlants();
        setShowModal(false);
        setFormData({ name: "", location: "", capacity: "" });
        setEditingId(null);
        alert("Plant saved successfully!");
      } else {
        alert(data.message || "Failed to save plant");
      }
    } catch (error) {
      console.error("Error saving plant:", error);
      alert("Failed to save plant");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/plants/${id}`, { 
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        fetchPlants();
        alert("Plant deleted successfully!");
      } else {
        alert(data.message || "Failed to delete plant");
      }
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Failed to delete plant");
    }
  };

  const handleEdit = (plant: any) => {
    setEditingId(plant.id);
    setFormData({ name: plant.name, location: plant.location, capacity: plant.capacity?.toString() || "" });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Plant Management</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", location: "", capacity: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Add Plant
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <DataTable
          title=""
          columns={[
            { key: "name", label: "Plant Name" },
            { key: "location", label: "Location" },
            { key: "capacity", label: "Daily Capacity" },
            { key: "status", label: "Status", render: (status) => (
              <span className="inline-flex items-center rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                {status}
              </span>
            )},
            { 
              key: "id", 
              label: "Actions",
              render: (id, item) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-muted-foreground" />
                  </button>
                </div>
              )
            },
          ]}
          data={plants.map((p) => ({ ...p, capacity: `${p.capacity} units/day` }))}
        />
      )}

      {/* Add/Edit Plant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {editingId ? "Edit Plant" : "Add New Plant"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Plant Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Plant A - Chennai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Chennai, India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Daily Capacity (units)
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="5000"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Products Section
function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    unit_price: "",
    cost_price: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error("Error fetching products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.sku || !formData.name || !formData.category || !formData.unit_price || !formData.cost_price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          unit_price: parseFloat(formData.unit_price),
          cost_price: parseFloat(formData.cost_price),
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        setShowModal(false);
        setFormData({ sku: "", name: "", category: "", unit_price: "", cost_price: "" });
        setEditingId(null);
        alert("Product saved successfully!");
      } else {
        alert(data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${id}`, { 
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        alert("Product deleted successfully!");
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit_price: product.unit_price?.toString() || "",
      cost_price: product.cost_price?.toString() || "",
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Product Management</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ sku: "", name: "", category: "", unit_price: "", cost_price: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <DataTable
          title=""
          columns={[
            { key: "sku", label: "SKU" },
            { key: "name", label: "Product Name" },
            { key: "category", label: "Category" },
            { key: "unit_price", label: "Unit Price" },
            { key: "cost_price", label: "Cost Price" },
            { 
              key: "id", 
              label: "Actions",
              render: (id, item) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-muted-foreground" />
                  </button>
                </div>
              )
            },
          ]}
          data={products}
        />
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="SKU-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Motor Assembly"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Components"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="1000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cost Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="600.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AI Models Section
function ModelsSection() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    model_type: "demand_forecast",
    status: "Active",
    accuracy: "",
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/ai-models", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setModels(data.data);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.accuracy) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/ai-models/${editingId}` : "/api/ai-models";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          accuracy: parseFloat(formData.accuracy),
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchModels();
        setShowModal(false);
        setFormData({ name: "", model_type: "demand_forecast", status: "Active", accuracy: "" });
        setEditingId(null);
        alert("Model saved successfully!");
      } else {
        alert(data.message || "Failed to save model");
      }
    } catch (error) {
      console.error("Error saving model:", error);
      alert("Failed to save model");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this model?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ai-models/${id}`, { 
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        fetchModels();
        alert("Model deleted successfully!");
      } else {
        alert(data.message || "Failed to delete model");
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      alert("Failed to delete model");
    }
  };

  const handleEdit = (model: any) => {
    setEditingId(model.id);
    setFormData({
      name: model.name,
      model_type: model.model_type,
      status: model.status,
      accuracy: model.accuracy?.toString() || "",
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">AI Model Management</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", model_type: "demand_forecast", status: "Active", accuracy: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          New Model
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <DataTable
          title=""
          columns={[
            { key: "name", label: "Model Name" },
            { key: "status", label: "Status", render: (status) => (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                status === "Active" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
              }`}>
                {status}
              </span>
            )},
            { key: "accuracy", label: "Accuracy" },
            { key: "last_trained_date", label: "Last Trained", render: (date) => date ? new Date(date).toLocaleDateString() : "Never" },
            { 
              key: "id", 
              label: "Actions",
              render: (id, item) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 hover:bg-secondary transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-muted-foreground" />
                  </button>
                </div>
              )
            },
          ]}
          data={models}
        />
      )}

      {/* Add/Edit Model Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {editingId ? "Edit AI Model" : "Create New AI Model"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Model Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Demand Forecast v2.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Model Type
                </label>
                <select
                  value={formData.model_type}
                  onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="demand_forecast">Demand Forecast</option>
                  <option value="seasonal_pattern">Seasonal Pattern</option>
                  <option value="anomaly_detection">Anomaly Detection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Testing">Testing</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Accuracy (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.accuracy}
                  onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="92.4"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Alerts Section
function AlertsSection() {
  const [alerts] = useState([
    { id: "1", title: "Critical Stock Alert", plant: "Plant B", sku: "SKU-004", threshold: 100, current: 45, severity: "critical" },
    { id: "2", title: "Low Stock Warning", plant: "Plant A", sku: "SKU-002", threshold: 500, current: 320, severity: "warning" },
    { id: "3", title: "Forecast Accuracy Drop", plant: "Global", model: "Demand Forecast v2.1", threshold: "90%", current: "87.2%", severity: "info" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Alert Rules & Configuration</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          New Rule
        </button>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{alert.title}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    alert.severity === "critical" ? "bg-critical/20 text-critical" :
                    alert.severity === "warning" ? "bg-warning/20 text-warning" :
                    "bg-info/20 text-info"
                  }`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Plant: {alert.plant} | {'sku' in alert ? `SKU: ${alert.sku}` : `Model: ${alert.model}`}
                </p>
              </div>
              <button className="rounded-lg p-2 hover:bg-secondary">
                <Settings size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Exports Section
function ExportsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Data Exports</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Inventory Report",
            description: "Complete inventory snapshot across all plants and products",
            format: "CSV, XLSX",
          },
          {
            title: "Forecast Data",
            description: "AI-generated demand forecasts for the next 365 days",
            format: "CSV, XLSX, JSON",
          },
          {
            title: "Audit Log",
            description: "Complete system audit trail with user actions and changes",
            format: "CSV, PDF",
          },
          {
            title: "Performance Report",
            description: "Model performance metrics and system health indicators",
            format: "PDF, XLSX",
          },
        ].map((exp) => (
          <div key={exp.title} className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">{exp.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Format: {exp.format}</span>
              <button className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper Components
interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  color: string;
}

function StatCard({ label, value, trend, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
    </div>
  );
}

interface HealthBarProps {
  label: string;
  value: number;
}

function HealthBar({ label, value }: HealthBarProps) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

function QuickActionCard({ icon: Icon, title, description }: QuickActionCardProps) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon size={24} className="text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
