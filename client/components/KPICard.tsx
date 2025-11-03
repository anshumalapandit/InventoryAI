import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  previousValue?: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
  status?: "healthy" | "warning" | "critical";
  subtitle?: string;
  onClick?: () => void;
  animate?: boolean;
}

export default function KPICard({
  label,
  value,
  previousValue,
  icon: Icon,
  trend,
  trendPercent,
  status = "healthy",
  subtitle,
  onClick,
  animate = true,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!animate || typeof value !== "number") return;

    let start = 0;
    const end = value;
    const duration = 1000;
    const startTime = Date.now();

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    updateValue();
  }, [value, animate]);

  const displayNum = animate && typeof value === "number" ? displayValue : value;

  const statusColor = {
    healthy: "text-success",
    warning: "text-warning",
    critical: "text-critical",
  };

  const statusBgColor = {
    healthy: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    critical: "bg-critical/10 border-critical/20",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "card-lift rounded-xl border-2 p-6 transition-all",
        statusBgColor[status],
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0", statusColor[status])}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="counter-number text-foreground">
            {displayNum}
          </span>
          {trend && trendPercent && (
            <div className={cn("text-xs font-medium", trend === "up" ? "text-success" : trend === "down" ? "text-critical" : "text-muted-foreground")}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendPercent}%
            </div>
          )}
        </div>

        {previousValue && (
          <p className="text-xs text-muted-foreground">
            Previous: <span className="font-medium">{previousValue}</span>
          </p>
        )}
      </div>

      {/* Progress bar for percentage values */}
      {typeof value === "number" && value <= 100 && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-background/50">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                status === "healthy"
                  ? "bg-success"
                  : status === "warning"
                    ? "bg-warning"
                    : "bg-critical"
              )}
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
