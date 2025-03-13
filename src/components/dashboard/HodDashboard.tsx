
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import StatCard from "./StatCard";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Download, FileBarChart, FileCheck, FileClock, FileText, PieChart, RefreshCcw, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

const HodDashboard = () => {
  const { stats, departments, loading, refetch } = useDashboardData("hod");
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    toast.success("Dashboard data exported successfully");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Department Overview</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sub-departments"
          value={departments.length}
          icon={Users}
          variant="primary"
          glass
        />
        <StatCard
          title="Total Team Members"
          value={stats?.teamMembers || 0}
          icon={UserPlus}
          variant="info"
          glass
          trend={{ value: 12, up: true }}
        />
        <StatCard
          title="Active Tasks"
          value={stats?.pendingTasks || 0}
          icon={FileClock}
          variant="warning"
          glass
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={FileCheck}
          variant="success"
          glass
          trend={{ value: 8, up: true }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Department Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardCard title="Sub-department Performance" className="h-[400px]">
            <div className="space-y-8">
              {departments.map((dept) => (
                <div key={dept.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground">Lead: {dept.head}</p>
                    </div>
                    <div className="text-sm font-medium">{dept.progress}%</div>
                  </div>
                  <Progress value={dept.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>{dept.members} team members</div>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      View Details <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard title="Recent Communications" className="col-span-2 h-80">
              <div className="space-y-4">
                {stats?.recentActivity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 border-b pb-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.user.name} {activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                      {activity.details && (
                        <p className="mt-1 text-sm">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-2">
                View all communications
              </Button>
            </DashboardCard>
            
            <DashboardCard title="Upcoming Tasks" className="h-80">
              <div className="space-y-4">
                {stats?.upcomingTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="space-y-1">
                    <div className="flex items-center justify-between">
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
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
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
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4">
                View all tasks
              </Button>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <DashboardCard className="h-[500px]">
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <PieChart className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="text-xl font-medium">Performance Metrics</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Detailed performance analytics and metrics for all departments will be displayed here.
              </p>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="resources">
          <DashboardCard className="h-[500px]">
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <FileBarChart className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="text-xl font-medium">Resource Allocation</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Comprehensive resource allocation data and management tools will be displayed here.
              </p>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HodDashboard;
