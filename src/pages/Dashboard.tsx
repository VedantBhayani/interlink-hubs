
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HodDashboard from "@/components/dashboard/HodDashboard";
import SubDepartmentDashboard from "@/components/dashboard/SubDepartmentDashboard";
import TeamMemberDashboard from "@/components/dashboard/TeamMemberDashboard";
import { UserRole } from "@/components/auth/LoginForm";

const Dashboard = () => {
  // In a real application, this would come from authentication
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // For demo purposes, retrieve role from localStorage
  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") as UserRole | null;
    
    // If no role is found, default to team member for demo
    setUserRole(storedRole || "team-member");
    
    if (!storedRole) {
      sessionStorage.setItem("userRole", "team-member");
    }
  }, []);
  
  if (!userRole) {
    return <div>Loading...</div>;
  }
  
  // Ensure user is authenticated
  const isAuthenticated = true; // This would be a real auth check in production
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case "hod":
        return <HodDashboard />;
      case "sub-department-admin":
        return <SubDepartmentDashboard />;
      case "team-member":
        return <TeamMemberDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };
  
  return (
    <DashboardLayout userRole={userRole}>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
