export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}
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
