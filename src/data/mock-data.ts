export interface Function {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUnit {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  orgUnit: number;
  functions: string[];
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

// Functions Data
export const functions: Function[] = [
  {
    id: "f1",
    name: "Inventory Management",
    description: "Managing and tracking inventory levels",
    type: "Core",
    createdAt: "2025-03-15T10:30:00Z",
    updatedAt: "2025-04-01T14:45:00Z",
  },
  {
    id: "f2",
    name: "Order Processing",
    description: "Processing customer orders and payments",
    type: "Core",
    createdAt: "2025-03-15T11:15:00Z",
    updatedAt: "2025-04-10T09:30:00Z",
  },
  {
    id: "f3",
    name: "Customer Management",
    description: "Managing customer data and interactions",
    type: "Support",
    createdAt: "2025-03-16T09:45:00Z",
    updatedAt: "2025-04-05T16:20:00Z",
  },
  {
    id: "f4",
    name: "Supplier Relations",
    description: "Managing supplier relationships and orders",
    type: "Support",
    createdAt: "2025-03-17T14:00:00Z",
    updatedAt: "2025-04-12T11:10:00Z",
  },
  {
    id: "f5",
    name: "Reporting",
    description: "Generating sales and performance reports",
    type: "Analytics",
    createdAt: "2025-03-18T13:30:00Z",
    updatedAt: "2025-04-15T10:45:00Z",
  },
  {
    id: "f6",
    name: "Marketing",
    description: "Planning and executing marketing campaigns",
    type: "Growth",
    createdAt: "2025-03-19T15:20:00Z",
    updatedAt: "2025-04-07T09:15:00Z",
  },
  {
    id: "f7",
    name: "Human Resources",
    description: "Managing employee data and benefits",
    type: "Support",
    createdAt: "2025-03-20T10:00:00Z",
    updatedAt: "2025-04-18T14:30:00Z",
  },
];

// Org Units Data
export const orgUnits: OrgUnit[] = [
  {
    id: 1,
    name: "Executive",
    description: "Executive leadership team",
    parentId: null,
    level: 1,
    createdAt: "2025-03-10T08:00:00Z",
    updatedAt: "2025-04-01T09:30:00Z",
  },
  {
    id: 2,
    name: "Sales",
    description: "Sales and customer relations team",
    parentId: 1,
    level: 2,
    createdAt: "2025-03-10T08:15:00Z",
    updatedAt: "2025-04-02T10:45:00Z",
  },
  {
    id: 3,
    name: "Operations",
    description: "Day-to-day operations management",
    parentId: 1,
    level: 2,
    createdAt: "2025-03-10T08:30:00Z",
    updatedAt: "2025-04-03T11:20:00Z",
  },
  {
    id: 4,
    name: "Marketing",
    description: "Marketing and promotions team",
    parentId: 1,
    level: 2,
    createdAt: "2025-03-10T09:00:00Z",
    updatedAt: "2025-04-04T13:10:00Z",
  },
  {
    id: 5,
    name: "IT",
    description: "Information technology support",
    parentId: 1,
    level: 2,
    createdAt: "2025-03-10T09:15:00Z",
    updatedAt: "2025-04-05T14:30:00Z",
  },
  {
    id: 6,
    name: "Human Resources",
    description: "Employee management and benefits",
    parentId: 1,
    level: 2,
    createdAt: "2025-03-10T09:30:00Z",
    updatedAt: "2025-04-06T15:45:00Z",
  },
];

// Users Data
export const users = [
  {
    id: "u1",
    name: "John Smith",
    email: "john.smith@growcery.com",
    role: "Admin",
    avatar: "",
    orgUnit: 1,
    functions: ["f1", "f2", "f5"],
    status: "active" as const,
    lastLogin: "2025-04-25T09:15:00Z",
    createdAt: "2025-03-05T10:00:00Z",
  },
  {
    id: "u2",
    name: "Sarah Johnson",
    email: "sarah.johnson@growcery.com",
    role: "Manager",
    avatar: "",
    orgUnit: 1,
    functions: ["f2", "f3"],
    status: "active" as const,
    lastLogin: "2025-04-24T14:30:00Z",
    createdAt: "2025-03-06T11:15:00Z",
  },
  {
    id: "u3",
    name: "Michael Brown",
    email: "michael.brown@growcery.com",
    role: "Manager",
    avatar: "",
    orgUnit: 3,
    functions: ["f1", "f4"],
    status: "active" as const,
    lastLogin: "2025-04-25T11:45:00Z",
    createdAt: "2025-03-07T09:30:00Z",
  },
  {
    id: "u4",
    name: "Emily Davis",
    email: "emily.davis@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 4,
    functions: ["f6"],
    status: "active" as const,
    lastLogin: "2025-04-23T16:20:00Z",
    createdAt: "2025-03-08T13:45:00Z",
  },
  {
    id: "u5",
    name: "David Wilson",
    email: "david.wilson@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 5,
    functions: ["f5"],
    status: "active" as const,
    lastLogin: "2025-04-24T10:30:00Z",
    createdAt: "2025-03-09T15:00:00Z",
  },
  {
    id: "u6",
    name: "Jessica Martinez",
    email: "jessica.martinez@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 6,
    functions: ["f7"],
    status: "active" as const,
    lastLogin: "2025-04-25T08:45:00Z",
    createdAt: "2025-03-10T09:15:00Z",
  },
  {
    id: "u7",
    name: "Robert Taylor",
    email: "robert.taylor@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 2,
    functions: ["f2", "f3"],
    status: "active" as const,
    lastLogin: "2025-04-23T13:10:00Z",
    createdAt: "2025-03-11T10:30:00Z",
  },
  {
    id: "u8",
    name: "Lisa Anderson",
    email: "lisa.anderson@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 3,
    functions: ["f1", "f4"],
    status: "inactive" as const,
    lastLogin: "2025-04-20T15:45:00Z",
    createdAt: "2025-03-12T11:45:00Z",
  },
  {
    id: "u9",
    name: "Thomas White",
    email: "thomas.white@growcery.com",
    role: "Manager",
    avatar: "",
    orgUnit: 4,
    functions: ["f6"],
    status: "active" as const,
    lastLogin: "2025-04-24T09:20:00Z",
    createdAt: "2025-03-13T14:00:00Z",
  },
  {
    id: "u10",
    name: "Jennifer Harris",
    email: "jennifer.harris@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 5,
    functions: ["f5"],
    status: "active" as const,
    lastLogin: "2025-04-25T10:15:00Z",
    createdAt: "2025-03-14T16:30:00Z",
  },
  {
    id: "u11",
    name: "Daniel Lewis",
    email: "daniel.lewis@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 6,
    functions: ["f7"],
    status: "inactive" as const,
    lastLogin: "2025-04-15T11:30:00Z",
    createdAt: "2025-03-15T09:45:00Z",
  },
  {
    id: "u12",
    name: "Michelle Clark",
    email: "michelle.clark@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 2,
    functions: ["f2"],
    status: "active" as const,
    lastLogin: "2025-04-24T14:00:00Z",
    createdAt: "2025-03-16T13:15:00Z",
  },
  {
    id: "u13",
    name: "Kevin Moore",
    email: "kevin.moore@growcery.com",
    role: "User",
    avatar: "",
    orgUnit: 3,
    functions: ["f4"],
    status: "active" as const,
    lastLogin: "2025-04-22T16:45:00Z",
    createdAt: "2025-03-17T10:00:00Z",
  },
];

// Recent Activity Data
export const activities: Activity[] = [
  {
    id: "a1",
    user: "John Smith",
    action: "Created",
    target: "Function: Customer Feedback",
    timestamp: "2025-04-25T16:30:00Z",
  },
  {
    id: "a2",
    user: "Sarah Johnson",
    action: "Updated",
    target: "Org Unit: Sales",
    timestamp: "2025-04-25T15:45:00Z",
  },
  {
    id: "a3",
    user: "Michael Brown",
    action: "Assigned",
    target: "User: Kevin Moore to Operations",
    timestamp: "2025-04-25T14:20:00Z",
  },
  {
    id: "a4",
    user: "Emily Davis",
    action: "Created",
    target: "Marketing Campaign: Spring Sale",
    timestamp: "2025-04-25T13:10:00Z",
  },
  {
    id: "a5",
    user: "John Smith",
    action: "Deleted",
    target: "Function: Legacy Report Generator",
    timestamp: "2025-04-25T11:30:00Z",
  },
  {
    id: "a6",
    user: "David Wilson",
    action: "Updated",
    target: "User: Lisa Anderson",
    timestamp: "2025-04-25T10:15:00Z",
  },
  {
    id: "a7",
    user: "Sarah Johnson",
    action: "Created",
    target: "User: Amanda Taylor",
    timestamp: "2025-04-24T16:45:00Z",
  },
];

// Helper function to get org unit name by ID
export const getOrgUnitName = (id: number): string => {
  const orgUnit = orgUnits.find((ou) => ou.id === id);
  return orgUnit ? orgUnit.name : "Unknown";
};

// Helper function to get function name by ID
export const getFunctionName = (id: string): string => {
  const func = functions.find((f) => f.id === id);
  return func ? func.name : "Unknown";
};
