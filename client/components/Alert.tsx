import React from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Alert({
  variant = "info",
  title,
  message,
  onClose,
  action,
}: AlertProps) {
  const iconMap = {
    info: <Info size={20} />,
    success: <CheckCircle2 size={20} />,
    warning: <AlertCircle size={20} />,
    error: <XCircle size={20} />,
  };

  const colorMap = {
    info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    error: "bg-critical/10 border-critical/20 text-critical",
  };

  const iconColorMap = {
    info: "text-blue-600 dark:text-blue-400",
    success: "text-success",
    warning: "text-warning",
    error: "text-critical",
  };

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 animate-slide-up",
        colorMap[variant]
      )}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex-shrink-0 mt-0.5", iconColorMap[variant])}>
          {iconMap[variant]}
        </div>

        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          )}
          <p className="text-sm opacity-90">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 text-sm font-medium hover:opacity-80 transition-opacity underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 transition-opacity hover:opacity-70"
            aria-label="Close alert"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "critical" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export function Badge({ variant = "default", size = "md", children }: BadgeProps) {
  const variantMap = {
    default: "bg-secondary text-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    critical: "bg-critical/10 text-critical",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  const sizeMap = {
    sm: "text-xs px-2 py-1",
    md: "text-xs px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full font-medium",
        variantMap[variant],
        sizeMap[size]
      )}
    >
      {children}
    </span>
  );
}

interface StatusIndicatorProps {
  status: "healthy" | "warning" | "critical" | "offline";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({
  status,
  label,
  size = "md",
}: StatusIndicatorProps) {
  const statusColorMap = {
    healthy: "bg-success",
    warning: "bg-warning",
    critical: "bg-critical",
    offline: "bg-muted-foreground",
  };

  const sizeMap = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("rounded-full animate-pulse-gentle", statusColorMap[status], sizeMap[size])}
      />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
