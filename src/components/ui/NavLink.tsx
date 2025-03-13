
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const NavLink = ({
  to,
  children,
  className = "",
  activeClassName = "text-primary font-medium",
  exact = false,
  disabled = false,
  onClick,
  ...props
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  if (disabled) {
    return (
      <span
        className={cn(
          "nav-link transition-all duration-200 opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "nav-link transition-all duration-200 hover:text-primary",
        className,
        isActive && activeClassName
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
