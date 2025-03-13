
import { createContext, useContext, useState, ReactNode } from "react";

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

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
