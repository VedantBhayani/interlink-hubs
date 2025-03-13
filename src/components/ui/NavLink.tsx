
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink = ({
  to,
  children,
  className = "",
  activeClassName = "text-primary font-medium",
  exact = false,
  ...props
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "nav-link transition-all duration-200 hover:text-primary",
        className,
        isActive && activeClassName
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
