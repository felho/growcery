"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  route?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  route,
}: StatCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`stat-card border-border border transition-all duration-300 ease-in-out ${route ? "hover:border-primary/20 group cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)]" : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground group-hover:text-muted-foreground/80 text-sm font-medium">
          {title}
        </CardTitle>
        <div className="bg-primary/20 group-hover:bg-primary/30 flex h-8 w-8 items-center justify-center rounded-full transition-colors">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="group-hover:text-primary origin-left text-2xl font-bold transition-all duration-300 ease-in-out group-hover:scale-105">
          {value}
        </div>
        {description && (
          <p className="text-muted-foreground group-hover:text-muted-foreground/80 mt-1 text-xs transition-colors">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
