/**
 * PredictUpload Component
 * 
 * Features:
 * - Upload past sales CSV (date, sku, quantity)
 * - Display prediction results with charts
 * - Show feature importance, trends, and confidence
 * - Download results as CSV
 * 
 * Dependencies:
 *   npm install react-chartjs-2 chart.js
 * 
 * Expected backend response:
 * {
 *   "job_id": "abc123",
 *   "status": "completed",
 *   "summary": { "total_pred": 12345, "num_skus": 120, "pct_change_vs_last_month": -2.3 },
 *   "preview": [...],
 *   "feature_importances": [...],
 *   "download_url": "/api/predict/download/abc123"
 * }
 */

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import PredictionInsights from "@/components/PredictionInsights";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function PredictUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [showNumbers, setShowNumbers] = useState(true);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit");
      return;
    }

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Parse preview locally
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        const rows = [];

        for (let i = 1; i < Math.min(11, lines.length); i++) {
          if (lines[i].trim()) {
            const cols = lines[i].split(",");
            const row = {};
            headers.forEach((h, idx) => {
              row[h.trim()] = cols[idx] ? cols[idx].trim() : "";
            });
            rows.push(row);
          }
        }

        setPreview(rows);
      } catch (e) {
        setError("Failed to parse CSV preview");
      }
    };
    reader.readAsText(selectedFile);
  };

  // Upload and predict
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // TODO: Add user_id header if available from auth context
      const response = await fetch(`${BACKEND_URL}/api/predict/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Upload failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Download template
  const handleDownloadTemplate = async () => {
    try {
      // First, try to download from backend
      const response = await fetch(`${BACKEND_URL}/api/predict/template`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales_template.csv";
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {
      // Silently fall back to local template if backend is unavailable
    }

    // Fallback: Create template locally if backend is not available
    const templateContent = `date,sku,quantity
2024-10-01,SKU-001,100
2024-10-02,SKU-002,150
2024-10-03,SKU-001,110
2024-10-04,SKU-003,200
2024-10-05,SKU-002,175
2024-10-06,SKU-001,95
2024-10-07,SKU-004,320
2024-10-08,SKU-003,210
2024-10-09,SKU-002,160
2024-10-10,SKU-001,105`;

    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download results
  const handleDownloadResults = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}${results.download_url}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `predictions_${results.job_id}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download results");
    }
  };

  // Chart data for top 10 SKUs
  const topSkusData = {
    labels: results?.preview.slice(0, 10).map((r) => r.sku) || [],
    datasets: [
      {
        label: "Predicted Qty",
        data: results?.preview.slice(0, 10).map((r) => r.pred_qty) || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart data for feature importance
  const featureData = {
    labels: results?.feature_importances.map((f) => f.feature) || [],
    datasets: [
      {
        label: "Importance",
        data: results?.feature_importances.map((f) => f.importance) || [],
        backgroundColor: [
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(236, 95, 150, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(250, 204, 21, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(109, 40, 217, 0.8)",
          "rgba(202, 138, 4, 0.8)",
        ],
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart data for SKU distribution
  const distributionData = {
    labels: results?.preview.slice(0, 5).map((r) => r.sku) || [],
    datasets: [
      {
        label: "Predicted Distribution",
        data: results?.preview.slice(0, 5).map((r) => r.pred_qty) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  if (results) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">predict</h1>
            <p className="text-muted-foreground mt-2">
              Prediction results for your sales forecast
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Predicted Units
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {results.summary.total_pred.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total SKUs
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {results.summary.num_skus}
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Change vs Last Month
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      results.summary.pct_change_vs_last_month >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {results.summary.pct_change_vs_last_month > 0 ? "+" : ""}
                    {results.summary.pct_change_vs_last_month}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top 10 SKUs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Top 10 SKUs by Predicted Quantity
              </h3>
              <Bar
                data={topSkusData}
                options={{
                  responsive: true,
                  indexAxis: "y",
                  plugins: {
                    legend: { display: true },
                  },
                  scales: {
                    x: { beginAtZero: true },
                  },
                }}
              />
            </Card>

            {/* Feature Importance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Model Feature Importance
              </h3>
              <Bar
                data={featureData}
                options={{
                  responsive: true,
                  indexAxis: "y",
                  plugins: {
                    legend: { display: true },
                  },
                  scales: {
                    x: { beginAtZero: true, max: 1 },
                  },
                }}
              />
            </Card>
          </div>

          {/* SKU Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Top 5 SKU Distribution
              </h3>
              <div className="flex justify-center">
                <Doughnut
                  data={distributionData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </Card>

            {/* Results Table */}
            <Card className="p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Detailed Predictions
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium">SKU</th>
                    <th className="text-right py-2 px-2 font-medium">Last Mo.</th>
                    <th className="text-right py-2 px-2 font-medium">Predicted</th>
                    <th className="text-right py-2 px-2 font-medium">% Change</th>
                    <th className="text-center py-2 px-2 font-medium">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.preview.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-secondary/50"
                    >
                      <td className="py-2 px-2">{row.sku}</td>
                      <td className="text-right py-2 px-2">
                        {row.last_month_qty.toLocaleString()}
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {row.pred_qty.toLocaleString()}
                      </td>
                      <td
                        className={`text-right py-2 px-2 ${
                          row.pct_change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {row.pct_change > 0 ? "+" : ""}
                        {row.pct_change}%
                      </td>
                      <td className="text-center py-2 px-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            row.confidence === "high"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {row.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Warning for Low Confidence */}
          {results.preview.some((r) => r.confidence === "low") && (
            <Alert className="mb-8 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-yellow-800">
                Some SKUs have low confidence (less than 6 historical data points).
                Use these predictions with caution.
              </span>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Button
              onClick={handleDownloadResults}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Results CSV
            </Button>
            <Button
              onClick={() => {
                setResults(null);
                setFile(null);
                setPreview([]);
              }}
              variant="outline"
            >
              Start Over
            </Button>
          </div>

          {/* AI-Powered Insights & Recommendations */}
          <div className="mb-8">
            <PredictionInsights results={results} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">predict</h1>
          <p className="text-muted-foreground mt-2">
            Upload past sales and get next month's predicted demand per SKU.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </Alert>
        )}

        {/* Upload Card */}
        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-secondary/50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-12 w-12 mx-auto text-primary mb-4" />
              <p className="text-lg font-medium text-foreground">
                Drop your CSV here or click to select
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Maximum file size: 50MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
            </div>

            {/* Template Download Link */}
            <div className="flex justify-center">
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <Download className="h-3 w-3 mr-1" />
                Download Template CSV
              </Button>
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">{file.name}</span> selected (
                  {(file.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}

            {/* CSV Preview */}
            {preview.length > 0 && (
              <div className="bg-secondary/50 rounded-lg p-4 max-h-48 overflow-auto">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Preview ({preview.length} rows):
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="text-left py-1 px-2">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-b border-border">
                        {Object.values(row).map((val, vidx) => (
                          <td key={vidx} className="py-1 px-2">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? "Processing..." : "Upload & Predict"}
            </Button>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Expected CSV Format:</span> Your file
            should contain columns: <code className="bg-blue-100 px-1 rounded">date</code>,
            <code className="bg-blue-100 px-1 rounded ml-1">sku</code>, and{" "}
            <code className="bg-blue-100 px-1 rounded ml-1">quantity</code>. Download
            the template to see an example.
          </p>
        </Card>
      </div>
    </div>
  );
}
