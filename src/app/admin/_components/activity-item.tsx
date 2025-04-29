"use client";

import type { Activity } from "~/data/mock-data";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "Created":
        return "text-green-400";
      case "Updated":
        return "text-blue-400";
      case "Deleted":
        return "text-red-400";
      case "Assigned":
        return "text-yellow-400";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="border-border/50 flex items-center gap-4 border-b py-3 last:border-none">
      <div className="text-muted-foreground flex-shrink-0 text-sm">
        {formatTime(activity.timestamp)}
      </div>
      <div>
        <span className="font-medium">{activity.user}</span>{" "}
        <span className={getActionColor(activity.action)}>
          {activity.action.toLowerCase()}
        </span>{" "}
        <span className="text-muted-foreground">{activity.target}</span>
      </div>
    </div>
  );
}
