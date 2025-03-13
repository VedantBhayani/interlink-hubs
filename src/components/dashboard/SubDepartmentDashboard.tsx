
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import StatCard from "./StatCard";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Users, CheckSquare, ClipboardList, Clock, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const SubDepartmentDashboard = () => {
  const { stats, loading, refetch } = useDashboardData("sub-department-admin");
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse-subtle"></div>
        ))}
        <div className="md:col-span-2 lg:col-span-4 h-64 rounded-xl bg-gray-200 animate-pulse-subtle"></div>
      </div>
    );
  }

  // Mock team members
  const teamMembers = [
    { id: 1, name: "Aditya Sharma", role: "Team Lead", tasksCompleted: 28, tasksTotal: 35 },
    { id: 2, name: "Priya Reddy", role: "Analyst", tasksCompleted: 19, tasksTotal: 24 },
    { id: 3, name: "Vikram Singh", role: "Specialist", tasksCompleted: 15, tasksTotal: 22 },
    { id: 4, name: "Kavita Patel", role: "Coordinator", tasksCompleted: 24, tasksTotal: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sub-department Dashboard</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Team Members"
          value={teamMembers.length}
          icon={Users}
          variant="primary"
          glass
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={CheckSquare}
          variant="success"
          glass
          trend={{ value: 12, up: true }}
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingTasks || 0}
          icon={ClipboardList}
          variant="warning"
          glass
        />
        <StatCard
          title="Department Progress"
          value={`${stats?.departmentProgress || 0}%`}
          icon={BarChart3}
          variant="info"
          glass
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
          <TabsTrigger value="reports">Progress Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardCard title="Team Performance" className="h-80">
              <div className="space-y-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round((member.tasksCompleted / member.tasksTotal) * 100)}%
                      </div>
                    </div>
                    <Progress 
                      value={Math.round((member.tasksCompleted / member.tasksTotal) * 100)} 
                      className="h-1.5" 
                    />
                    <div className="text-xs text-muted-foreground">
                      {member.tasksCompleted} of {member.tasksTotal} tasks completed
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard title="Recent Activity" className="h-80">
              <div className="space-y-4">
                {stats?.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {activity.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
          
          <DashboardCard title="Upcoming Tasks" className="h-80">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats?.upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover-lift">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div
                    className={`text-xs inline-flex items-center rounded-full px-2 py-1 font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : task.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.status}
                  </div>
                  {task.assignee && (
                    <div className="mt-3 text-sm">
                      Assigned to: <span className="font-medium">{task.assignee}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="tasks">
          <DashboardCard className="h-[500px]">
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <ClipboardList className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="text-xl font-medium">Task Management</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Detailed task management tools will be displayed here.
              </p>
              <Button onClick={() => toast.info("Task management module is under development")}>
                Explore Tasks
              </Button>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="reports">
          <DashboardCard className="h-[500px]">
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="text-xl font-medium">Progress Reports</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Comprehensive progress reports and analytics will be displayed here.
              </p>
              <Button onClick={() => toast.info("Reporting module is under development")}>
                View Reports
              </Button>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubDepartmentDashboard;
