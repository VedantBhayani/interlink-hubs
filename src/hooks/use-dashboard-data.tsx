
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  teamMembers: number;
  resources: number;
  departmentProgress: number;
  communications: number;
  recentActivity: Activity[];
  upcomingTasks: Task[];
}

export interface Activity {
  id: string;
  action: string;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: Date;
  details?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  status: "completed" | "in-progress" | "pending" | "overdue";
  assignee?: string;
  priority: "low" | "medium" | "high";
}

export interface Department {
  id: string;
  name: string;
  head: string;
  members: number;
  progress: number;
}

export type UserRole = "hod" | "sub-department-admin" | "team-member";

// Mock data generator functions
const generateMockStats = (role: UserRole): DashboardStats => {
  return {
    totalTasks: 125 + Math.floor(Math.random() * 50),
    completedTasks: 78 + Math.floor(Math.random() * 20),
    pendingTasks: 32 + Math.floor(Math.random() * 15),
    teamMembers: role === "team-member" ? 12 : role === "sub-department-admin" ? 28 : 87,
    resources: 34 + Math.floor(Math.random() * 10),
    departmentProgress: 68 + Math.floor(Math.random() * 20),
    communications: 56 + Math.floor(Math.random() * 30),
    recentActivity: generateMockActivities(5),
    upcomingTasks: generateMockTasks(4),
  };
};

const generateMockActivities = (count: number): Activity[] => {
  const actions = [
    "updated task",
    "completed task",
    "assigned task",
    "commented on task",
    "shared resource",
    "sent notification",
    "updated report",
    "submitted form",
  ];
  
  const users = [
    { name: "Alex Johnson", role: "Team Lead" },
    { name: "Sarah Chen", role: "Data Analyst" },
    { name: "Miguel Santos", role: "Project Manager" },
    { name: "Priya Patel", role: "Department Head" },
    { name: "James Wilson", role: "Developer" },
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `act-${i + 1}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    user: users[Math.floor(Math.random() * users.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)),
    details: Math.random() > 0.5 ? "Additional context about this activity" : undefined,
  }));
};

const generateMockTasks = (count: number): Task[] => {
  const titles = [
    "Complete quarterly report",
    "Review team performance metrics",
    "Update department documentation",
    "Prepare presentation for executives",
    "Schedule team meeting",
    "Review budget allocation",
    "Submit resource request form",
    "Update project timeline",
  ];

  const statuses: Array<Task["status"]> = ["completed", "in-progress", "pending", "overdue"];
  const priorities: Array<Task["priority"]> = ["low", "medium", "high"];

  return Array.from({ length: count }).map((_, i) => ({
    id: `task-${i + 1}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 86400000 * 14)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    assignee: Math.random() > 0.3 ? "John Doe" : undefined,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
  }));
};

const generateMockDepartments = (): Department[] => {
  return [
    {
      id: "dept-1",
      name: "Labour Relations",
      head: "Dr. Rajesh Kumar",
      members: 32,
      progress: 78,
    },
    {
      id: "dept-2",
      name: "Skill Development",
      head: "Prof. Anita Singh",
      members: 45,
      progress: 65,
    },
    {
      id: "dept-3",
      name: "Employment Services",
      head: "Mr. David Chen",
      members: 28,
      progress: 82,
    },
    {
      id: "dept-4",
      name: "Training Programs",
      head: "Dr. Sophia Williams",
      members: 36,
      progress: 71,
    },
  ];
};

export const useDashboardData = (role: UserRole) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setStats(generateMockStats(role));
        setDepartments(generateMockDepartments());
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  return {
    loading,
    stats,
    departments,
    error,
    refetch: () => {
      setLoading(true);
      setStats(generateMockStats(role));
      setDepartments(generateMockDepartments());
      setLoading(false);
      toast.success("Dashboard data refreshed");
    },
  };
};
