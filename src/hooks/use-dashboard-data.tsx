
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserRole } from "@/hooks/use-user-role";

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

// Mock data generator functions
const generateMockStats = (role: UserRole): DashboardStats => {
  // Adjust task count based on role
  const taskMultiplier = role === "hod" ? 1.5 : role === "sub-department-admin" ? 1.2 : 1;
  const totalTasks = Math.floor((125 + Math.floor(Math.random() * 50)) * taskMultiplier);
  const completedTasks = Math.floor(totalTasks * (0.5 + Math.random() * 0.2));
  const pendingTasks = totalTasks - completedTasks;
  
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    teamMembers: role === "team-member" ? 12 : role === "sub-department-admin" ? 28 : 87,
    resources: 34 + Math.floor(Math.random() * 10),
    departmentProgress: 68 + Math.floor(Math.random() * 20),
    communications: 56 + Math.floor(Math.random() * 30),
    recentActivity: generateMockActivities(5, role),
    upcomingTasks: generateMockTasks(4, role),
  };
};

const generateMockActivities = (count: number, role: UserRole): Activity[] => {
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
  
  // Customize users based on role
  const users = role === "hod" 
    ? [
        { name: "Priya Patel", role: "Department Head" },
        { name: "Rajesh Kumar", role: "Sub-Department Admin" },
        { name: "Sarah Chen", role: "Data Analyst" },
        { name: "Miguel Santos", role: "Project Manager" },
        { name: "James Wilson", role: "Team Lead" },
      ]
    : role === "sub-department-admin"
    ? [
        { name: "Rajesh Kumar", role: "Sub-Department Admin" },
        { name: "Alex Johnson", role: "Team Lead" },
        { name: "Sarah Chen", role: "Data Analyst" },
        { name: "James Wilson", role: "Developer" },
        { name: "Priya Patel", role: "Department Head" },
      ]
    : [
        { name: "Amit Singh", role: "Team Member" },
        { name: "Alex Johnson", role: "Team Lead" },
        { name: "Sarah Chen", role: "Data Analyst" },
        { name: "James Wilson", role: "Developer" },
        { name: "Rajesh Kumar", role: "Sub-Department Admin" },
      ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `act-${i + 1}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    user: users[Math.floor(Math.random() * users.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)),
    details: Math.random() > 0.5 ? "Additional context about this activity" : undefined,
  }));
};

const generateMockTasks = (count: number, role: UserRole): Task[] => {
  // Role-specific tasks
  const hodTitles = [
    "Review department annual budget",
    "Approve quarterly strategy plan",
    "Conduct performance review meeting",
    "Present department initiatives to minister",
    "Review policy implementation report",
    "Finalize interdepartmental collaboration framework",
    "Review skill development program effectiveness",
    "Approve labour welfare scheme amendments",
  ];
  
  const adminTitles = [
    "Complete sub-department quarterly report",
    "Review team performance metrics",
    "Prepare resource allocation plan",
    "Conduct team skill assessment",
    "Update training program documentation",
    "Schedule departmental review meeting",
    "Prepare presentation for HOD review",
    "Submit budget utilization report",
  ];
  
  const memberTitles = [
    "Complete training module documentation",
    "Submit weekly progress report",
    "Update project tracking database",
    "Prepare presentation for team meeting",
    "Complete assigned training modules",
    "Review and comment on departmental guidelines",
    "Submit expense claims for field visits",
    "Update skills registry information",
  ];

  const titles = role === "hod" 
    ? hodTitles 
    : role === "sub-department-admin" 
      ? adminTitles 
      : memberTitles;

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
