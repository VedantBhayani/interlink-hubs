
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const statCardVariants = cva(
  "flex items-start justify-between rounded-xl p-6 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-green-50 text-green-700 border-green-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        danger: "bg-red-50 text-red-700 border-red-100",
        info: "bg-blue-50 text-blue-700 border-blue-100",
      },
      glass: {
        true: "backdrop-blur-md border",
      },
      hover: {
        true: "hover-lift",
      },
    },
    defaultVariants: {
      variant: "default",
      glass: false,
      hover: true,
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    up?: boolean;
  };
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  variant,
  glass,
  hover,
}: StatCardProps) => {
  return (
    <div className={cn(statCardVariants({ variant, glass, hover }), className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div
            className={cn(
              "flex items-center text-xs font-medium",
              trend.up ? "text-green-600" : "text-red-600"
            )}
          >
            <span>{trend.up ? "↑" : "↓"}</span>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
            <span className="ml-1 opacity-70">from last period</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="rounded-full bg-background/20 p-3">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
