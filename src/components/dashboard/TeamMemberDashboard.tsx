
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import StatCard from "./StatCard";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckSquare, ChevronDown, Clock, MessageSquare, RefreshCcw, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const TeamMemberDashboard = () => {
  const { stats, loading, refetch } = useDashboardData("team-member");
  const [activeTab, setActiveTab] = useState("tasks");
  const [message, setMessage] = useState("");

  const handleRefresh = () => {
    refetch();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      toast.success("Message sent successfully");
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse-subtle"></div>
        ))}
        <div className="md:col-span-2 lg:col-span-3 h-64 rounded-xl bg-gray-200 animate-pulse-subtle"></div>
      </div>
    );
  }

  // Mock personal tasks data
  const myTasks = [
    {
      id: "task-1",
      title: "Complete quarterly performance report",
      dueDate: new Date(Date.now() + 86400000 * 2),
      status: "in-progress" as const,
      priority: "high" as const,
    },
    {
      id: "task-2",
      title: "Review team resources allocation",
      dueDate: new Date(Date.now() + 86400000 * 5),
      status: "pending" as const,
      priority: "medium" as const,
    },
    {
      id: "task-3",
      title: "Prepare presentation for department meeting",
      dueDate: new Date(Date.now() + 86400000 * 3),
      status: "in-progress" as const,
      priority: "medium" as const,
    },
    {
      id: "task-4",
      title: "Update project documentation",
      dueDate: new Date(Date.now() - 86400000 * 1),
      status: "completed" as const,
      priority: "low" as const,
    },
  ];

  // Calculate completion percentages
  const totalTasks = myTasks.length;
  const completedTasks = myTasks.filter(task => task.status === "completed").length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="My Tasks"
          value={totalTasks}
          icon={CheckSquare}
          variant="primary"
          glass
        />
        <StatCard
          title="Completion Rate"
          value={`${completionPercentage}%`}
          icon={Calendar}
          variant="success"
          glass
        />
        <StatCard
          title="Team Communications"
          value={stats?.communications || 0}
          icon={MessageSquare}
          variant="info"
          glass
        />
      </div>

      <Tabs defaultValue="tasks" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <DashboardCard title="Task Progress" className="h-28">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Overall Completion</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{completedTasks} completed</span>
                    <span>•</span>
                    <span>{totalTasks - completedTasks} remaining</span>
                  </div>
                </div>
                <div className="text-lg font-semibold">{completionPercentage}%</div>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </DashboardCard>
          
          <DashboardCard className="overflow-hidden">
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {myTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 border rounded-lg ${
                    task.status === "completed" 
                      ? "bg-green-50 border-green-100" 
                      : task.priority === "high" 
                        ? "bg-red-50 border-red-100" 
                        : ""
                  } hover-lift`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={task.status === "completed" ? "outline" : "default"} className="ml-2">
                      {task.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className={
                      task.priority === "high" 
                        ? "text-red-700 bg-red-50" 
                        : task.priority === "medium" 
                          ? "text-amber-700 bg-amber-50" 
                          : "text-green-700 bg-green-50"
                    }>
                      {task.priority} priority
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => toast.info(`Task details: ${task.title}`)}
                    >
                      Details <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="communications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardCard title="Team Messages" className="h-96 flex flex-col">
              <div className="flex-1 space-y-4 overflow-auto mb-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {activity.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium">{activity.user.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        {activity.action.includes("message") 
                          ? "Hey team! Just checking in on our progress with the quarterly objectives." 
                          : `${activity.user.name} ${activity.action}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-auto">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </DashboardCard>
            
            <DashboardCard title="Upcoming Meetings" className="h-96">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 hover-lift">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        {["Weekly Team Sync", "Department Update", "Project Planning"][i]}
                      </h4>
                      <Badge variant="outline">
                        {["Today", "Tomorrow", "Next Week"][i]}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Clock className="mr-1 h-3 w-3" />
                      {["10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM", "11:30 AM - 12:30 PM"][i]}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {["Updates", "Reports", "Planning", "Discussion"][i === 2 ? 3 : i].split(" ").map((tag, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-xs">
                        Join Meeting
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <DashboardCard className="h-[500px]">
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <CheckSquare className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="text-xl font-medium">Resources</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Department resources and documents will be displayed here.
              </p>
              <Button onClick={() => toast.info("Resources module is under development")}>
                Explore Resources
              </Button>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamMemberDashboard;
