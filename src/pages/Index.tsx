
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm, { UserRole } from "@/components/auth/LoginForm";
import { UserRoleContext } from "@/hooks/use-user-role";

const Index = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-in-bottom">
          <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
            <div className="text-primary font-bold text-2xl">DMS</div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Departmental Management System</h1>
          <p className="text-muted-foreground">
            Labour, Skill Development and Employment Department
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 shadow-xl p-8 animate-scale-in">
          <h2 className="text-xl font-semibold mb-6 text-center">Sign In to Your Account</h2>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
          <p>
            Unified platform for departmental coordination and communication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
