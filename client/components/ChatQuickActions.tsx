import { Button } from "@/components/ui/button";
import { Box, BarChart, PackageSearch, TrendingUp } from "lucide-react";

interface ChatQuickActionsProps {
  onSelect: (question: string) => void;
}

const quickQuestions = [
  {
    text: "Current inventory levels",
    icon: Box,
  },
  {
    text: "Analyze profit trends",
    icon: TrendingUp,
  },
  {
    text: "Top selling products",
    icon: BarChart,
  },
  {
    text: "Stock optimization",
    icon: PackageSearch,
  },
];

export function ChatQuickActions({ onSelect }: ChatQuickActionsProps) {
  return (
    <div className="space-y-2 p-3 border-t">
      <p className="text-xs font-medium text-muted-foreground">Quick actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {quickQuestions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs justify-start gap-2"
              onClick={() => onSelect(item.text)}
            >
              <Icon className="h-3 w-3" />
              {item.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
}