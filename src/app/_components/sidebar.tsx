"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard as AdminIcon } from "lucide-react";
import { Home as HomeIcon } from "lucide-react";
interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      name: "Admin",
      path: "/admin",
      icon: <AdminIcon className="h-5 w-5" />,
    },
  ];

  if (!isOpen) return null;

  return (
    <aside className="border-border animate-slide-in fixed h-[calc(100%-4rem)] w-64 overflow-y-auto border-r">
      <div className="p-4">
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-item ${isActive ? "active" : ""} `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
