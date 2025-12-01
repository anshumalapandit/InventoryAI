// import { useState, useEffect } from "react";
// import Layout from "@/components/Layout";
// import DataTable from "@/components/DataTable";
// import ForecastChart from "@/components/ForecastChart";
// import { AlertCircle, TrendingDown, Package, Clock, Plus, Eye, Edit2, Trash2, Truck, CheckCircle, Filter, DownloadCloud, Loader, X } from "lucide-react";

// export default function PlantManagerDashboard() {
//   const [selectedPlant, setSelectedPlant] = useState("Plant A - Chennai");
//   const [activeSection, setActiveSection] = useState<"overview" | "inventory" | "reorder" | "schedule" | "suppliers">("overview");

//   return (
//     <Layout>
//       <div className="space-y-8 p-8">
//         {/* Header */}
//         <div className="space-y-2">
//           <h1 className="text-4xl font-bold text-foreground">Plant Manager Dashboard</h1>
//           <p className="text-lg text-muted-foreground">
//             Plant-specific inventory view, stock alerts, and reorder suggestions
//           </p>
//         </div>

//         {/* Plant Selection */}
//         <div className="rounded-lg border border-border bg-card p-6">
//           <label className="text-sm font-medium text-foreground">Select Plant</label>
//           <select
//             value={selectedPlant}
//             onChange={(e) => setSelectedPlant(e.target.value)}
//             className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground"
//           >
//             <option>Plant A - Chennai</option>
//             <option>Plant B - Mumbai</option>
//             <option>Plant C - Bangalore</option>
//           </select>
//         </div>

//         {/* Section Navigation */}
//         <div className="border-b border-border">
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             {[
//               { id: "overview" as const, label: "Overview" },
//               { id: "inventory" as const, label: "Inventory" },
//               { id: "reorder" as const, label: "Reorder Suggestions" },
//               { id: "schedule" as const, label: "Production Schedule" },
//               { id: "suppliers" as const, label: "Suppliers" },
//             ].map((section) => (
//               <button
//                 key={section.id}
//                 onClick={() => setActiveSection(section.id)}
//                 className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
//                   activeSection === section.id
//                     ? "bg-primary text-primary-foreground"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 {section.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content Sections */}
//         {activeSection === "overview" && <OverviewSection plant={selectedPlant} />}
//         {activeSection === "inventory" && <InventorySection plant={selectedPlant} />}
//         {activeSection === "reorder" && <ReorderSection plant={selectedPlant} />}
//         {activeSection === "schedule" && <ScheduleSection plant={selectedPlant} />}
//         {activeSection === "suppliers" && <SuppliersSection plant={selectedPlant} />}
//       </div>
//     </Layout>
//   );
// }

// // Overview Section
// function OverviewSection({ plant }: { plant: string }) {
//   return (
//     <div className="space-y-6">
//       {/* KPI Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         {[
//           { label: "Total Inventory", value: "12,847 units", trend: "In stock", icon: Package, status: "healthy" },
//           { label: "Critical Items", value: "12", trend: "Needs attention", icon: AlertCircle, status: "critical" },
//           { label: "Low Stock", value: "48", trend: "Reorder soon", icon: TrendingDown, status: "warning" },
//           { label: "Healthy Items", value: "2,787", trend: "Normal levels", icon: CheckCircle, status: "healthy" },
//         ].map((stat) => (
//           <KPICard key={stat.label} {...stat} />
//         ))}
//       </div>

//       {/* Stock Distribution */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="rounded-lg border border-border bg-card p-6">
//           <h3 className="text-lg font-semibold text-foreground">Stock Status Distribution</h3>
//           <div className="mt-6 space-y-4">
//             {[
//               { label: "Healthy", count: 2787, percentage: 85, color: "bg-success" },
//               { label: "Low Stock", count: 48, percentage: 10, color: "bg-warning" },
//               { label: "Critical", count: 12, percentage: 5, color: "bg-critical" },
//             ].map((item) => (
//               <div key={item.label}>
//                 <div className="mb-1 flex items-center justify-between">
//                   <span className="text-sm font-medium text-foreground">{item.label}</span>
//                   <span className="text-sm font-bold text-muted-foreground">{item.count} items</span>
//                 </div>
//                 <div className="h-2 w-full rounded-full bg-secondary">
//                   <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-lg border border-border bg-card p-6">
//           <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
//           <div className="mt-6 space-y-3">
//             {[
//               { title: "Motor Assembly - SKU-001", severity: "info", message: "Forecast accuracy improved to 94.2%" },
//               { title: "Bearing Set - SKU-004", severity: "critical", message: "Stock critically low, recommend immediate reorder" },
//               { title: "Steel Frame - SKU-003", severity: "warning", message: "Lead time extended by supplier" },
//             ].map((alert, idx) => (
//               <div key={idx} className={`rounded-lg border-l-4 px-4 py-3 ${
//                 alert.severity === "critical" ? "border-critical bg-critical/5" :
//                 alert.severity === "warning" ? "border-warning bg-warning/5" :
//                 "border-info bg-info/5"
//               }`}>
//                 <p className="font-medium text-foreground">{alert.title}</p>
//                 <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Forecast Overview */}
//       <div className="rounded-lg border border-border bg-card p-6">
//         <h3 className="text-lg font-semibold text-foreground">30-Day Demand Forecast</h3>
//         <p className="mt-1 text-sm text-muted-foreground">Aggregated forecast for {plant}</p>
//         <div className="mt-6">
//           <ForecastChart />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Inventory Section
// function InventorySection({ plant }: { plant: string }) {
//   const [inventory, setInventory] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchInventory();
//   }, [plant]);

//   const fetchInventory = async () => {
//     try {
//       const response = await fetch("/api/inventory");
//       const data = await response.json();
//       if (data.success) {
//         setInventory(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-foreground">Inventory - {plant}</h2>
//         <div className="flex gap-2">
//           <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
//             <Filter size={16} />
//             Filter
//           </button>
//           <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
//             <DownloadCloud size={16} />
//             Export
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8">
//           <Loader className="animate-spin" />
//         </div>
//       ) : (
//         <DataTable
//           title=""
//           columns={[
//             { key: "sku", label: "SKU" },
//             { key: "name", label: "Product Name" },
//             { key: "on_hand", label: "On Hand" },
//             { key: "reorder_level", label: "Reorder Level" },
//             { key: "lead_time_days", label: "Lead Time", render: (days) => `${days || 0} days` },
//             { key: "available", label: "Available", render: (available) => available || 0 },
//           ]}
//           data={inventory}
//           renderActions={(item) => (
//             <div className="flex gap-2">
//               <button className="rounded-lg p-2 hover:bg-secondary" title="View Details">
//                 <Eye size={16} className="text-muted-foreground" />
//               </button>
//               <button className="rounded-lg p-2 hover:bg-secondary" title="Quick Edit">
//                 <Edit2 size={16} className="text-muted-foreground" />
//               </button>
//             </div>
//           )}
//         />
//       )}
//     </div>
//   );
// }

// // Reorder Section
// function ReorderSection({ plant }: { plant: string }) {
//   const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     product_id: "",
//     supplier_id: "",
//     quantity: "",
//     unit_price: "",
//     expected_delivery_date: "",
//   });

//   useEffect(() => {
//     fetchPurchaseOrders();
//   }, [plant]);

//   const fetchPurchaseOrders = async () => {
//     try {
//       const response = await fetch("/api/purchase-orders");
//       const data = await response.json();
//       if (data.success) {
//         setPurchaseOrders(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching purchase orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreatePO = async () => {
//     if (!formData.product_id || !formData.supplier_id || !formData.quantity || !formData.unit_price) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       const response = await fetch("/api/purchase-orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           quantity: parseInt(formData.quantity),
//           unit_price: parseFloat(formData.unit_price),
//           created_by: 1,
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         fetchPurchaseOrders();
//         setShowModal(false);
//         setFormData({
//           product_id: "",
//           supplier_id: "",
//           quantity: "",
//           unit_price: "",
//           expected_delivery_date: "",
//         });
//       }
//     } catch (error) {
//       console.error("Error creating PO:", error);
//       alert("Failed to create purchase order");
//     }
//   };

//   const handleDeletePO = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this purchase order?")) return;

//     try {
//       const response = await fetch(`/api/purchase-orders/${id}`, { method: "DELETE" });
//       const data = await response.json();
//       if (data.success) {
//         fetchPurchaseOrders();
//       }
//     } catch (error) {
//       console.error("Error deleting PO:", error);
//       alert("Failed to delete purchase order");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-foreground">Purchase Orders - {plant}</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
//         >
//           <Plus size={16} />
//           Create PO
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8">
//           <Loader className="animate-spin" />
//         </div>
//       ) : purchaseOrders.length > 0 ? (
//         <div className="space-y-4">
//           {purchaseOrders.map((po) => (
//             <div key={po.id} className="rounded-lg border border-border bg-card p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3">
//                     <div>
//                       <p className="font-semibold text-foreground">{po.name}</p>
//                       <p className="text-sm text-muted-foreground">{po.sku}</p>
//                     </div>
//                     <span className={`rounded-full px-3 py-1 text-xs font-medium ${
//                       po.status === "pending" ? "bg-warning/20 text-warning" :
//                       po.status === "delivered" ? "bg-success/20 text-success" :
//                       "bg-info/20 text-info"
//                     }`}>
//                       {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
//                     </span>
//                   </div>
//                   <div className="mt-4 grid gap-4 sm:grid-cols-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Quantity</p>
//                       <p className="text-lg font-bold text-foreground">{po.quantity}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Unit Price</p>
//                       <p className="text-lg font-bold text-foreground">₹{po.unit_price}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Supplier</p>
//                       <p className="text-sm font-medium text-foreground">{po.supplier_name}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">ETA</p>
//                       <p className="text-sm font-medium text-foreground">
//                         {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleDeletePO(po.id)}
//                   className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-critical/10 px-4 py-2 text-sm font-medium text-critical hover:bg-critical/20"
//                 >
//                   <Trash2 size={14} />
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="rounded-lg border border-border bg-card p-6 text-center">
//           <p className="text-muted-foreground">No purchase orders yet. Create one to get started.</p>
//         </div>
//       )}

//       {/* Create PO Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
//             <div className="mb-6 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-foreground">Create Purchase Order</h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="rounded-lg p-1 hover:bg-secondary"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Product ID
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.product_id}
//                   onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
//                   className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//                   placeholder="1"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Supplier ID
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.supplier_id}
//                   onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
//                   className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//                   placeholder="1"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Quantity
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.quantity}
//                     onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//                     className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//                     placeholder="100"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Unit Price
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.unit_price}
//                     onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
//                     className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//                     placeholder="1000.00"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Expected Delivery Date
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.expected_delivery_date}
//                   onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
//                   className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreatePO}
//                   className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
//                 >
//                   Create
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Production Schedule Section
// function ScheduleSection({ plant }: { plant: string }) {
//   const [schedule] = useState([
//     { id: "1", product: "Motor Assembly", quantity: 500, startDate: "2024-02-01", endDate: "2024-02-05", status: "In Progress", completion: 60 },
//     { id: "2", product: "Control Panel", quantity: 300, startDate: "2024-02-03", endDate: "2024-02-08", status: "Scheduled", completion: 0 },
//     { id: "3", product: "Steel Frame", quantity: 1000, startDate: "2024-02-06", endDate: "2024-02-12", status: "Planned", completion: 0 },
//   ]);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-foreground">Production Schedule - {plant}</h2>
//       <div className="space-y-4">
//         {schedule.map((item) => (
//           <div key={item.id} className="rounded-lg border border-border bg-card p-6">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3">
//                   <div>
//                     <p className="font-semibold text-foreground">{item.product}</p>
//                     <p className="text-sm text-muted-foreground">Quantity: {item.quantity} units</p>
//                   </div>
//                   <span className={`rounded-full px-3 py-1 text-xs font-medium ${
//                     item.status === "In Progress" ? "bg-primary/20 text-primary" :
//                     item.status === "Scheduled" ? "bg-warning/20 text-warning" :
//                     "bg-secondary text-muted-foreground"
//                   }`}>
//                     {item.status}
//                   </span>
//                 </div>
//                 <p className="mt-2 text-xs text-muted-foreground">
//                   {item.startDate} to {item.endDate}
//                 </p>
//                 <div className="mt-3">
//                   <div className="mb-1 flex items-center justify-between">
//                     <span className="text-xs font-medium text-muted-foreground">Progress</span>
//                     <span className="text-xs font-bold text-foreground">{item.completion}%</span>
//                   </div>
//                   <div className="h-2 w-full rounded-full bg-secondary">
//                     <div className="h-2 rounded-full bg-primary" style={{ width: `${item.completion}%` }} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Suppliers Section
// function SuppliersSection({ plant }: { plant: string }) {
//   const [suppliers] = useState([
//     { id: "1", name: "ElectroTech Ltd", category: "Electronics", onTimePercent: 98, avgLeadTime: "5 days", activeOrders: 3, reliability: "excellent" },
//     { id: "2", name: "Precision Parts Co", category: "Components", onTimePercent: 92, avgLeadTime: "12 days", activeOrders: 2, reliability: "good" },
//     { id: "3", name: "MotorWorks Inc", category: "Motors", onTimePercent: 85, avgLeadTime: "8 days", activeOrders: 4, reliability: "good" },
//     { id: "4", name: "Steel Supply Corp", category: "Raw Materials", onTimePercent: 88, avgLeadTime: "3 days", activeOrders: 1, reliability: "good" },
//   ]);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-foreground">Supplier Management - {plant}</h2>
//       <DataTable
//         title=""
//         columns={[
//           { key: "name", label: "Supplier Name" },
//           { key: "category", label: "Category" },
//           { key: "onTimePercent", label: "On-Time %" },
//           { key: "avgLeadTime", label: "Avg Lead Time" },
//           { key: "activeOrders", label: "Active Orders" },
//           { key: "reliability", label: "Reliability", render: (reliability) => (
//             <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
//               reliability === "excellent" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
//             }`}>
//               {reliability.charAt(0).toUpperCase() + reliability.slice(1)}
//             </span>
//           )},
//         ]}
//         data={suppliers}
//         renderActions={() => (
//           <div className="flex gap-2">
//             <button className="rounded-lg p-2 hover:bg-secondary" title="View Details">
//               <Eye size={16} className="text-muted-foreground" />
//             </button>
//             <button className="rounded-lg p-2 hover:bg-secondary" title="Create Order">
//               <Truck size={16} className="text-muted-foreground" />
//             </button>
//           </div>
//         )}
//       />
//     </div>
//   );
// }

// // Helper Component
// function KPICard({ label, value, trend, icon: Icon, status }: any) {
//   const statusColors = {
//     healthy: "bg-success/10 text-success border-success/20",
//     warning: "bg-warning/10 text-warning border-warning/20",
//     critical: "bg-critical/10 text-critical border-critical/20",
//   };

//   return (
//     <div className={`rounded-lg border p-6 ${statusColors[status as keyof typeof statusColors]} bg-card`}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm font-medium text-muted-foreground">{label}</p>
//           <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
//           <p className="mt-2 text-xs text-muted-foreground">{trend}</p>
//         </div>
//         <Icon size={24} />
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DataTable from "@/components/DataTable";
import ForecastChart from "@/components/ForecastChart";
import { AlertCircle, TrendingDown, Package, Clock, Plus, Eye, Edit2, Trash2, Truck, CheckCircle, Filter, DownloadCloud, Loader, X } from "lucide-react";

export default function PlantManagerDashboard() {
  const [selectedPlant, setSelectedPlant] = useState("Plant A - Chennai");
  const [activeSection, setActiveSection] = useState<"overview" | "inventory" | "reorder" | "schedule" | "suppliers">("overview");

  return (
    <Layout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Plant Manager Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Plant-specific inventory view, stock alerts, and reorder suggestions
          </p>
        </div>

        {/* Plant Selection */}
        <div className="rounded-lg border border-border bg-card p-6">
          <label className="text-sm font-medium text-foreground">Select Plant</label>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground"
          >
            <option>Plant A - Chennai</option>
            <option>Plant B - Mumbai</option>
            <option>Plant C - Bangalore</option>
          </select>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "overview" as const, label: "Overview" },
              { id: "inventory" as const, label: "Inventory" },
              { id: "reorder" as const, label: "Reorder Suggestions" },
              { id: "schedule" as const, label: "Production Schedule" },
              { id: "suppliers" as const, label: "Suppliers" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === "overview" && <OverviewSection plant={selectedPlant} />}
        {activeSection === "inventory" && <InventorySection plant={selectedPlant} />}
        {activeSection === "reorder" && <ReorderSection plant={selectedPlant} />}
        {activeSection === "schedule" && <ScheduleSection plant={selectedPlant} />}
        {activeSection === "suppliers" && <SuppliersSection plant={selectedPlant} />}
      </div>
    </Layout>
  );
}

// Overview Section
function OverviewSection({ plant }: { plant: string }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Inventory", value: "12,847 units", trend: "In stock", icon: Package, status: "healthy" },
          { label: "Critical Items", value: "12", trend: "Needs attention", icon: AlertCircle, status: "critical" },
          { label: "Low Stock", value: "48", trend: "Reorder soon", icon: TrendingDown, status: "warning" },
          { label: "Healthy Items", value: "2,787", trend: "Normal levels", icon: CheckCircle, status: "healthy" },
        ].map((stat) => (
          <KPICard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Stock Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Stock Status Distribution</h3>
          <div className="mt-6 space-y-4">
            {[
              { label: "Healthy", count: 2787, percentage: 85, color: "bg-success" },
              { label: "Low Stock", count: 48, percentage: 10, color: "bg-warning" },
              { label: "Critical", count: 12, percentage: 5, color: "bg-critical" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm font-bold text-muted-foreground">{item.count} items</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
          <div className="mt-6 space-y-3">
            {[
              { title: "Motor Assembly - SKU-001", severity: "info", message: "Forecast accuracy improved to 94.2%" },
              { title: "Bearing Set - SKU-004", severity: "critical", message: "Stock critically low, recommend immediate reorder" },
              { title: "Steel Frame - SKU-003", severity: "warning", message: "Lead time extended by supplier" },
            ].map((alert, idx) => (
              <div key={idx} className={`rounded-lg border-l-4 px-4 py-3 ${
                alert.severity === "critical" ? "border-critical bg-critical/5" :
                alert.severity === "warning" ? "border-warning bg-warning/5" :
                "border-info bg-info/5"
              }`}>
                <p className="font-medium text-foreground">{alert.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Overview */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">30-Day Demand Forecast</h3>
        <p className="mt-1 text-sm text-muted-foreground">Aggregated forecast for {plant}</p>
        <div className="mt-6">
          <ForecastChart data={[]} />
        </div>
      </div>
    </div>
  );
}

// Inventory Section
function InventorySection({ plant }: { plant: string }) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, [plant]);

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory");
      const data = await response.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Inventory - {plant}</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <DownloadCloud size={16} />
            Export
          </button>
        </div>
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
            { key: "on_hand", label: "On Hand" },
            { key: "reorder_level", label: "Reorder Level" },
            { key: "lead_time_days", label: "Lead Time", render: (days) => `${days || 0} days` },
            { key: "available", label: "Available", render: (available) => available || 0 },
            { key: "id", label: "Actions", render: () => (
              <div className="flex gap-2">
                <button className="rounded-lg p-2 hover:bg-secondary" title="View Details">
                  <Eye size={16} className="text-muted-foreground" />
                </button>
                <button className="rounded-lg p-2 hover:bg-secondary" title="Quick Edit">
                  <Edit2 size={16} className="text-muted-foreground" />
                </button>
              </div>
            )},
          ]}
          data={inventory}
        />
      )}
    </div>
  );
}

// Reorder Section
function ReorderSection({ plant }: { plant: string }) {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    supplier_id: "",
    quantity: "",
    unit_price: "",
    expected_delivery_date: "",
  });

  useEffect(() => {
    fetchPurchaseOrders();
  }, [plant]);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("/api/purchase-orders");
      const data = await response.json();
      if (data.success) {
        setPurchaseOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePO = async () => {
    if (!formData.product_id || !formData.supplier_id || !formData.quantity || !formData.unit_price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          unit_price: parseFloat(formData.unit_price),
          created_by: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPurchaseOrders();
        setShowModal(false);
        setFormData({
          product_id: "",
          supplier_id: "",
          quantity: "",
          unit_price: "",
          expected_delivery_date: "",
        });
      }
    } catch (error) {
      console.error("Error creating PO:", error);
      alert("Failed to create purchase order");
    }
  };

  const handleDeletePO = async (id: number) => {
    if (!confirm("Are you sure you want to delete this purchase order?")) return;

    try {
      const response = await fetch(`/api/purchase-orders/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchPurchaseOrders();
      }
    } catch (error) {
      console.error("Error deleting PO:", error);
      alert("Failed to delete purchase order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Purchase Orders - {plant}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Create PO
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" />
        </div>
      ) : purchaseOrders.length > 0 ? (
        <div className="space-y-4">
          {purchaseOrders.map((po) => (
            <div key={po.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{po.name}</p>
                      <p className="text-sm text-muted-foreground">{po.sku}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      po.status === "pending" ? "bg-warning/20 text-warning" :
                      po.status === "delivered" ? "bg-success/20 text-success" :
                      "bg-info/20 text-info"
                    }`}>
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="text-lg font-bold text-foreground">{po.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Unit Price</p>
                      <p className="text-lg font-bold text-foreground">₹{po.unit_price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Supplier</p>
                      <p className="text-sm font-medium text-foreground">{po.supplier_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ETA</p>
                      <p className="text-sm font-medium text-foreground">
                        {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePO(po.id)}
                  className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-critical/10 px-4 py-2 text-sm font-medium text-critical hover:bg-critical/20"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">No purchase orders yet. Create one to get started.</p>
        </div>
      )}

      {/* Create PO Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Create Purchase Order</h3>
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
                  Product ID
                </label>
                <input
                  type="text"
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Supplier ID
                </label>
                <input
                  type="text"
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="100"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expected_delivery_date}
                  onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                  onClick={handleCreatePO}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Production Schedule Section
function ScheduleSection({ plant }: { plant: string }) {
  const [schedule] = useState([
    { id: "1", product: "Motor Assembly", quantity: 500, startDate: "2024-02-01", endDate: "2024-02-05", status: "In Progress", completion: 60 },
    { id: "2", product: "Control Panel", quantity: 300, startDate: "2024-02-03", endDate: "2024-02-08", status: "Scheduled", completion: 0 },
    { id: "3", product: "Steel Frame", quantity: 1000, startDate: "2024-02-06", endDate: "2024-02-12", status: "Planned", completion: 0 },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Production Schedule - {plant}</h2>
      <div className="space-y-4">
        {schedule.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.product}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity} units</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === "In Progress" ? "bg-primary/20 text-primary" :
                    item.status === "Scheduled" ? "bg-warning/20 text-warning" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.startDate} to {item.endDate}
                </p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Progress</span>
                    <span className="text-xs font-bold text-foreground">{item.completion}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${item.completion}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Suppliers Section
function SuppliersSection({ plant }: { plant: string }) {
  const [suppliers] = useState([
    { id: "1", name: "ElectroTech Ltd", category: "Electronics", onTimePercent: 98, avgLeadTime: "5 days", activeOrders: 3, reliability: "excellent" },
    { id: "2", name: "Precision Parts Co", category: "Components", onTimePercent: 92, avgLeadTime: "12 days", activeOrders: 2, reliability: "good" },
    { id: "3", name: "MotorWorks Inc", category: "Motors", onTimePercent: 85, avgLeadTime: "8 days", activeOrders: 4, reliability: "good" },
    { id: "4", name: "Steel Supply Corp", category: "Raw Materials", onTimePercent: 88, avgLeadTime: "3 days", activeOrders: 1, reliability: "good" },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Supplier Management - {plant}</h2>
      <DataTable
        title=""
        columns={[
          { key: "name", label: "Supplier Name" },
          { key: "category", label: "Category" },
          { key: "onTimePercent", label: "On-Time %" },
          { key: "avgLeadTime", label: "Avg Lead Time" },
          { key: "activeOrders", label: "Active Orders" },
          { key: "reliability", label: "Reliability", render: (reliability) => (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              reliability === "excellent" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
            }`}>
              {reliability.charAt(0).toUpperCase() + reliability.slice(1)}
            </span>
          )},
          { key: "id", label: "Actions", render: () => (
            <div className="flex gap-2">
              <button className="rounded-lg p-2 hover:bg-secondary" title="View Details">
                <Eye size={16} className="text-muted-foreground" />
              </button>
              <button className="rounded-lg p-2 hover:bg-secondary" title="Create Order">
                <Truck size={16} className="text-muted-foreground" />
              </button>
            </div>
          )},
        ]}
        data={suppliers}
      />
    </div>
  );
}

// Helper Component
function KPICard({ label, value, trend, icon: Icon, status }: any) {
  const statusColors = {
    healthy: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    critical: "bg-critical/10 text-critical border-critical/20",
  };

  return (
    <div className={`rounded-lg border p-6 ${statusColors[status as keyof typeof statusColors]} bg-card`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{trend}</p>
        </div>
        <Icon size={24} />
      </div>
    </div>
  );
}

