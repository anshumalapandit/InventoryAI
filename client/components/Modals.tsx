import { useState } from "react";
import { X, Upload, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

function BaseModal({ isOpen, onClose, title, description, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${sizeClasses[size]} rounded-lg border border-border bg-card p-6 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-secondary">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

// Product Add/Edit Modal
export function ProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "components",
    unit: "units",
    minOrder: "",
    reorderPoint: "",
    safetyStock: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product data:", formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add/Edit Product" description="Create or update product information">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="SKU-001"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Motor Assembly"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            >
              <option value="components">Components</option>
              <option value="electronics">Electronics</option>
              <option value="structure">Structure</option>
              <option value="hardware">Hardware</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="units"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground">Min Order Qty</label>
            <input
              type="number"
              value={formData.minOrder}
              onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
              placeholder="100"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Reorder Point</label>
            <input
              type="number"
              value={formData.reorderPoint}
              onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
              placeholder="200"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Safety Stock</label>
            <input
              type="number"
              value={formData.safetyStock}
              onChange={(e) => setFormData({ ...formData, safetyStock: e.target.value })}
              placeholder="50"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Product
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// Reorder Modal
export function ReorderModal({ isOpen, onClose, productName = "Motor Assembly" }: { isOpen: boolean; onClose: () => void; productName?: string }) {
  const [formData, setFormData] = useState({
    quantity: "",
    supplier: "",
    expectedDelivery: "",
    priority: "normal",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reorder data:", formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Purchase Order" description={`Reorder for ${productName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Quantity to Order</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="500"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Supplier</label>
          <select
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          >
            <option value="">Select Supplier</option>
            <option value="electrotech">ElectroTech Ltd</option>
            <option value="precision">Precision Parts Co</option>
            <option value="motorworks">MotorWorks Inc</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Expected Delivery Date</label>
          <input
            type="date"
            value={formData.expectedDelivery}
            onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes for this order..."
            rows={3}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create PO
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// Supplier Modal
export function SupplierModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    defaultLeadTime: "",
    minOrderQty: "",
    discountTier: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Supplier data:", formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add/Edit Supplier" description="Manage supplier information">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Supplier Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ElectroTech Ltd"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Contact Person</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="John Doe"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@electrotech.com"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 xxxx xxxx xx"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Default Lead Time (days)</label>
            <input
              type="number"
              value={formData.defaultLeadTime}
              onChange={(e) => setFormData({ ...formData, defaultLeadTime: e.target.value })}
              placeholder="7"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Min Order Quantity</label>
            <input
              type="number"
              value={formData.minOrderQty}
              onChange={(e) => setFormData({ ...formData, minOrderQty: e.target.value })}
              placeholder="100"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Discount Tier</label>
            <select
              value={formData.discountTier}
              onChange={(e) => setFormData({ ...formData, discountTier: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            >
              <option value="">Select Tier</option>
              <option value="none">None</option>
              <option value="bronze">Bronze (5%)</option>
              <option value="silver">Silver (10%)</option>
              <option value="gold">Gold (15%)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Supplier
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// Dataset Upload Modal
export function DatasetUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [fileSelected, setFileSelected] = useState(false);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Upload Dataset" description="Upload historical inventory data for model training">
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
          <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
          <input
            type="file"
            id="file-upload"
            hidden
            onChange={() => setFileSelected(true)}
            accept=".csv,.xlsx,.xls"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <p className="font-medium text-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">CSV or Excel files up to 100MB</p>
          </label>
        </div>

        {fileSelected && (
          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <p className="text-sm font-medium text-foreground">File selected ✓</p>
            <p className="text-xs text-muted-foreground">Ready to upload</p>
          </div>
        )}

        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="text-sm font-medium text-foreground">Expected Columns</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>• SKU</p>
            <p>• Date</p>
            <p>• Quantity_In</p>
            <p>• Quantity_Out</p>
            <p>• Stock_Level</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => {
              setFileSelected(false);
              onClose();
            }}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Upload Dataset
          </button>
          <button onClick={onClose} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

// Retrain Model Modal
export function RetrainModelModal({ isOpen, onClose, modelName = "Demand Forecast v2.1" }: { isOpen: boolean; onClose: () => void; modelName?: string }) {
  const [formData, setFormData] = useState({
    trainingDataPeriod: "6months",
    validationSplit: "0.2",
    epochs: "100",
    batchSize: "32",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Training config:", formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Retrain Model" description={`Configure training for ${modelName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-warning" size={16} />
            <p className="text-sm text-muted-foreground">Retraining will take approximately 2-4 hours. The model will continue serving predictions during training.</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Training Data Period</label>
          <select
            value={formData.trainingDataPeriod}
            onChange={(e) => setFormData({ ...formData, trainingDataPeriod: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last 1 year</option>
            <option value="all">All available data</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Validation Split</label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="0.5"
              value={formData.validationSplit}
              onChange={(e) => setFormData({ ...formData, validationSplit: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Epochs</label>
            <input
              type="number"
              value={formData.epochs}
              onChange={(e) => setFormData({ ...formData, epochs: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Batch Size</label>
          <input
            type="number"
            value={formData.batchSize}
            onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Start Training
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// Confirm Modal (for dangerous actions)
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
              isDangerous
                ? "bg-critical text-white hover:bg-critical/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {confirmText}
          </button>
          <button onClick={onClose} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            {cancelText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
