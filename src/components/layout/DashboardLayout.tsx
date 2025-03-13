
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import NavLink from "@/components/ui/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, FileBarChart, Home, LayoutDashboard, LogOut, MessageSquare, PieChart, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/components/auth/LoginForm";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  
  const sidebarItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Reports", icon: FileBarChart, url: "/reports" },
    { title: "Teams", icon: Users, url: "/teams" },
    { title: "Communication", icon: MessageSquare, url: "/communication" },
    { title: "Analytics", icon: PieChart, url: "/analytics" },
  ];
  
  // Get username based on role
  const getUserInfo = () => {
    switch (userRole) {
      case "hod":
        return { name: "Dr. Sharma", role: "Head of Department" };
      case "sub-department-admin":
        return { name: "Rajesh Kumar", role: "Sub-Department Admin" };
      case "team-member":
        return { name: "Amit Singh", role: "Team Member" };
    }
  };
  
  const userInfo = getUserInfo();
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  // Show welcome notification on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success(`Welcome, ${userInfo.name}!`, {
        description: "You're now signed in to your dashboard",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userInfo.name]);
  
  const checkNotifications = () => {
    toast.info(`You have ${notifications} unread notifications`);
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background/80 w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="flex justify-center pt-6 pb-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold">
              {userRole === "hod" ? "HOD" : userRole === "sub-department-admin" ? "SDA" : "TM"}
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <NavLink to={item.url} className="flex items-center gap-3 py-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {userRole === "hod" && (
              <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <NavLink to="/departments" className="flex items-center gap-3 py-2">
                        <Users className="h-5 w-5" />
                        <span>Departments</span>
                      </NavLink>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <NavLink to="/settings" className="flex items-center gap-3 py-2">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </NavLink>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          
          <SidebarFooter>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userInfo.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{userInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{userInfo.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {userRole === "hod" 
                  ? "HOD Dashboard" 
                  : userRole === "sub-department-admin" 
                    ? "Sub-Department Admin" 
                    : "Team Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={checkNotifications} className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {notifications}
                  </span>
                )}
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
