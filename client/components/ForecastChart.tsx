import React, { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { cn } from "@/lib/utils";

interface ForecastData {
  date: string;
  actual?: number;
  forecast: number;
  upper: number;
  lower: number;
}

interface ForecastChartProps {
  data: ForecastData[];
  title?: string;
  subtitle?: string;
  height?: number;
  showConfidenceInterval?: boolean;
  variant?: "line" | "area" | "composed";
  onPeriodChange?: (period: number) => void;
}

export default function ForecastChart({
  data = [],
  title,
  subtitle,
  height = 400,
  showConfidenceInterval = true,
  variant = "area",
  onPeriodChange,
}: ForecastChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  // Generate mock data if none provided
  const chartData = data && data.length > 0 ? data : generateMockData();

  function generateMockData(): ForecastData[] {
    const mockData: ForecastData[] = [];
    const baseValue = 500;

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const variance = Math.sin(i / 5) * 50 + Math.random() * 30;

      mockData.push({
        date: date.toISOString().split('T')[0],
        forecast: baseValue + variance,
        actual: i < 15 ? baseValue - 20 + Math.random() * 40 : undefined,
        upper: baseValue + variance + 100,
        lower: baseValue + variance - 100,
      });
    }

    return mockData;
  }

  const handlePeriodChange = (period: number) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const periods = [
    { value: 7, label: "7 days" },
    { value: 30, label: "30 days" },
    { value: 90, label: "90 days" },
    { value: 365, label: "1 year" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(0) || "N/A"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
      height,
    };

    if (variant === "line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {showConfidenceInterval && (
            <>
              <Line
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                dot={false}
              />
            </>
          )}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Forecast"
          />
          {chartData && chartData.length > 0 && chartData[0]?.actual && (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Actual"
            />
          )}
        </LineChart>
      );
    }

    if (variant === "composed") {
      return (
        <ComposedChart {...commonProps}>
          <defs>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {showConfidenceInterval && (
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#colorConfidence)"
              isAnimationActive={false}
              name="Confidence Band"
            />
          )}

          <Area
            type="monotone"
            dataKey="forecast"
            fill="url(#colorForecast)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="Forecast"
          />

          {showConfidenceInterval && (
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="url(#colorConfidence)"
              isAnimationActive={false}
              name="Confidence Band"
            />
          )}

          {chartData && chartData.length > 0 && chartData[0]?.actual && (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Actual"
            />
          )}
        </ComposedChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {showConfidenceInterval && (
          <>
            <Area
              type="monotone"
              dataKey="upper"
              fill="url(#colorConfidence)"
              stroke="none"
              isAnimationActive={false}
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="lower"
              fill="url(#colorConfidence)"
              stroke="none"
              isAnimationActive={false}
              name="Lower Bound"
            />
          </>
        )}

        <Area
          type="monotone"
          dataKey="forecast"
          fill="url(#colorForecast)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Forecast"
        />

        {chartData && chartData.length > 0 && chartData[0]?.actual && (
          <Line
            type="monotone"
            dataKey="actual"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Actual"
          />
        )}
      </AreaChart>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      {/* Header */}
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Period Selector */}
      {onPeriodChange && (
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={cn(
                "rounded-lg px-4 py-2 text-xs font-medium transition-colors",
                selectedPeriod === period.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>

      {/* Legend Info */}
      {showConfidenceInterval && (
        <div className="pt-4 border-t border-border grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Forecast</p>
            <div className="h-1 w-full rounded-full bg-primary mt-2" />
          </div>
          <div>
            <p className="text-muted-foreground">Confidence Band</p>
            <div className="h-1 w-full rounded-full bg-accent/20 mt-2" />
          </div>
          {chartData && chartData.length > 0 && chartData[0]?.actual && (
            <div>
              <p className="text-muted-foreground">Actual</p>
              <div className="h-1 w-full rounded-full bg-muted-foreground/50 mt-2" style={{ backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--muted-foreground)) 0px, hsl(var(--muted-foreground)) 5px, transparent 5px, transparent 10px)" }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
