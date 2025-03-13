
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HodDashboard from "@/components/dashboard/HodDashboard";
import SubDepartmentDashboard from "@/components/dashboard/SubDepartmentDashboard";
import TeamMemberDashboard from "@/components/dashboard/TeamMemberDashboard";
import { useUserRole } from "@/hooks/use-user-role";
import { toast } from "sonner";

const Dashboard = () => {
  const { userRole } = useUserRole();
  
  useEffect(() => {
    // Show welcome message when dashboard is loaded
    if (userRole) {
      const roleDisplay = userRole === "hod" 
        ? "Department Head" 
        : userRole === "sub-department-admin" 
          ? "Sub-Department Admin" 
          : "Team Member";
          
      toast.success(`Logged in as ${roleDisplay}`, {
        description: "Welcome to your department dashboard"
      });
    }
  }, [userRole]);
  
  // Handle case where user isn't authenticated
  if (!userRole) {
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
