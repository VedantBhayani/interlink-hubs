
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  padding?: "none" | "small" | "medium" | "large";
  glass?: boolean;
  hover?: boolean;
}

const DashboardCard = ({
  title,
  className,
  children,
  padding = "medium",
  glass = false,
  hover = false,
}: DashboardCardProps) => {
  const paddingMap = {
    none: "p-0",
    small: "p-3",
    medium: "p-5",
    large: "p-6",
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        glass && "glass-card backdrop-blur-md",
        hover && "card-hover transition-all duration-300 ease-in-out",
        paddingMap[padding],
        className
      )}
    >
      {title && (
        <div className="mb-4 flex items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardCard;
