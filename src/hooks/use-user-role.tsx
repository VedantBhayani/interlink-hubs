
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "hod" | "sub-department-admin" | "team-member";

type UserRoleContextType = {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
};

export const UserRoleContext = createContext<UserRoleContextType>({
  userRole: null,
  setUserRole: () => {},
});

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Load the user role from session storage on mount
  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Update session storage when the role changes
  const updateUserRole = (role: UserRole | null) => {
    setUserRole(role);
    if (role) {
      sessionStorage.setItem("userRole", role);
    } else {
      sessionStorage.removeItem("userRole");
    }
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole: updateUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
