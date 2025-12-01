/**
 * PredictionInsights Component
 * 
 * Uses Google Gemini API to generate AI-powered insights and recommendations
 * based on prediction results, including:
 * - Investment opportunities
 * - Profit analysis
 * - Critical items requiring monitoring
 * - Risk alerts
 */

import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Loader,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface PredictionData {
  summary: {
    total_pred: number;
    num_skus: number;
    pct_change_vs_last_month: number;
  };
  preview: Array<{
    sku: string;
    last_month_qty: number;
    pred_qty: number;
    pct_change: number;
    confidence: string;
    data_points: number;
  }>;
  feature_importances: Array<{
    feature: string;
    importance: number;
  }>;
}

interface InsightCategory {
  title: string;
  icon: React.ReactNode;
  items: string[];
  color: string;
}

export default function PredictionInsights({ results }: { results: PredictionData }) {
  const [insights, setInsights] = useState<InsightCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [results]);

  const generateInsights = async () => {
    setLoading(true);
    setError("");
    setIsAIGenerated(false);

    try {
      // Prepare data for Gemini
      const topProducts = results.preview
        .slice(0, 5)
        .map((p) => `${p.sku}: ${p.pred_qty} units (${p.pct_change > 0 ? "+" : ""}${p.pct_change}%)`)
        .join(", ");

      const lowConfidenceProducts = results.preview
        .filter((p) => p.confidence === "low")
        .map((p) => `${p.sku}`)
        .join(", ");

      const decreasingProducts = results.preview
        .filter((p) => p.pct_change < -10)
        .map((p) => `${p.sku}: ${p.pct_change}%`)
        .slice(0, 5)
        .join(", ");

      const increasingProducts = results.preview
        .filter((p) => p.pct_change > 10)
        .map((p) => `${p.sku}: ${p.pct_change}%`)
        .slice(0, 5)
        .join(", ");

      const prompt = `You are an inventory management expert. Based on the following sales prediction data, provide concise, actionable business insights in 4 categories. Be specific with product names/SKUs.

PREDICTION DATA:
- Total Predicted Units: ${results.summary.total_pred}
- Number of SKUs: ${results.summary.num_skus}
- Overall Change: ${results.summary.pct_change_vs_last_month}%
- Top Products: ${topProducts}
- Increasing Products (>10%): ${increasingProducts || "None"}
- Decreasing Products (<-10%): ${decreasingProducts || "None"}
- Low Confidence Products: ${lowConfidenceProducts || "None"}

Return ONLY valid JSON (no other text):
{
  "investments": ["insight 1", "insight 2"],
  "profitability": ["insight 1", "insight 2"],
  "critical_items": ["insight 1", "insight 2"],
  "risks": ["insight 1", "insight 2"]
}`;

      console.log("🤖 Calling Grok API via backend...");

      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      console.log("📡 Backend Response Status:", response.status);

      const data = await response.json();
      console.log("📦 Backend Response:", data);

      if (!response.ok) {
        console.error("❌ Backend Error:", data);
        throw new Error(`Backend Error: ${response.status} - ${data.message || "Unknown error"}`);
      }

      if (!data.success) {
        console.error("❌ API Error:", data);
        throw new Error(data.message || "Failed to generate insights");
      }

      const parsedInsights = data.data;

      // Parse JSON
      let finalInsights;
      try {
        // If it's a string, parse it; otherwise use it directly
        finalInsights = typeof parsedInsights === 'string' ? JSON.parse(parsedInsights) : parsedInsights;
        console.log("✅ Successfully processed Grok insights:", finalInsights);
        setIsAIGenerated(true);
      } catch (parseError) {
        console.error("❌ Failed to process response:", parsedInsights);
        throw new Error("Failed to parse insights response");
      }

      const categorizedInsights: InsightCategory[] = [
        {
          title: "💰 Investment Opportunities",
          icon: <TrendingUp className="h-5 w-5" />,
          items: (finalInsights.investments || []).filter((i: string) => i.trim()),
          color: "from-green-500/10 to-emerald-500/10",
        },
        {
          title: "📊 Profitability Analysis",
          icon: <Target className="h-5 w-5" />,
          items: (finalInsights.profitability || []).filter((i: string) => i.trim()),
          color: "from-blue-500/10 to-cyan-500/10",
        },
        {
          title: "🔍 Critical Items",
          icon: <Lightbulb className="h-5 w-5" />,
          items: (finalInsights.critical_items || []).filter((i: string) => i.trim()),
          color: "from-yellow-500/10 to-orange-500/10",
        },
        {
          title: "⚠️ Risk Alerts",
          icon: <AlertTriangle className="h-5 w-5" />,
          items: (finalInsights.risks || []).filter((i: string) => i.trim()),
          color: "from-red-500/10 to-pink-500/10",
        },
      ];

      setInsights(categorizedInsights);
    } catch (err) {
      console.error("⚠️ Error generating insights from Grok, using fallback:", err);
      // Use fallback insights on any error
      setInsights(generateFallbackInsights(results));
      setIsAIGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackInsights = (data: PredictionData): InsightCategory[] => {
    const topSKU = data.preview[0]?.sku || "N/A";
    const avgChange = data.summary.pct_change_vs_last_month;
    const lowConfidence = data.preview.filter((p) => p.confidence === "low").length;

    return [
      {
        title: "💰 Investment Opportunities",
        icon: <TrendingUp className="h-5 w-5" />,
        items: [
          `${topSKU} shows highest demand (${data.preview[0]?.pred_qty} units) - consider increasing stock`,
          "Products with >20% growth are revenue drivers - allocate more inventory",
        ],
        color: "from-green-500/10 to-emerald-500/10",
      },
      {
        title: "📊 Profitability Analysis",
        icon: <Target className="h-5 w-5" />,
        items: [
          `Overall demand ${avgChange > 0 ? "increased" : "decreased"} by ${Math.abs(avgChange)}% - adjust procurement accordingly`,
          "Top 5 SKUs represent majority of predicted volume - focus quality control here",
        ],
        color: "from-blue-500/10 to-cyan-500/10",
      },
      {
        title: "🔍 Critical Items",
        icon: <Lightbulb className="h-5 w-5" />,
        items: [
          `${lowConfidence} products have low confidence - needs more historical data or monitoring`,
          "High-demand items require extra attention to avoid stockouts",
        ],
        color: "from-yellow-500/10 to-orange-500/10",
      },
      {
        title: "⚠️ Risk Alerts",
        icon: <AlertTriangle className="h-5 w-5" />,
        items: [
          "Products with >15% decline should be reviewed for market shifts",
          "Ensure sufficient safety stock for critical items",
        ],
        color: "from-red-500/10 to-pink-500/10",
      },
    ];
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">Generating AI insights...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-foreground">
            AI-Powered Insights & Recommendations
          </h2>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isAIGenerated 
            ? "bg-blue-100 text-blue-700" 
            : "bg-gray-100 text-gray-700"
        }`}>
          {isAIGenerated ? "🤖 AI Generated" : "📊 Smart Fallback"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((category, categoryIdx) => (
          <Card key={categoryIdx} className={`p-6 bg-gradient-to-br ${category.color}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-foreground">{category.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">
                {category.title}
              </h3>
            </div>

            <div className="space-y-3">
              {category.items.length > 0 ? (
                category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        {item}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item, itemIdx)}
                      className="flex-shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === itemIdx ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No insights available for this category.
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> These insights are AI-generated based on your prediction data.
          Click the copy icon on any insight to copy it to your clipboard for reports or presentations.
        </p>
      </Card>
    </div>
  );
}
