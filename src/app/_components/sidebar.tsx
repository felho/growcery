"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard as AdminIcon } from "lucide-react";
import { Home as HomeIcon } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  hasBeenToggled: boolean;
}

const Sidebar = ({ isOpen, hasBeenToggled }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Admin",
      path: "/admin",
      icon: <AdminIcon className="h-5 w-5" />,
    },
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={`border-border ${
        hasBeenToggled ? "animate-slide-in" : ""
      } fixed top-16 h-[calc(100%-4rem)] w-64 overflow-y-auto border-r transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
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
