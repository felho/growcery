"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  route: string;
}

export default function QuickAction({ icon, label, route }: QuickActionProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <Button
      variant="outline"
      className="border-border hover:border-primary hover:bg-primary/10 border transition-all"
      onClick={handleClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}
