"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard as AdminIcon,
  Users as UsersIcon,
  CalendarCheck as CalendarCheckIcon,
  Grid3X3 as Grid3X3Icon,
  Settings as SettingsIcon,
  Import as ImportIcon,
  ChartArea as ChartAreaIcon,
} from "lucide-react";
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
      path: "/admin*",
      icon: <AdminIcon className="h-5 w-5" />,
    },
    {
      name: "Competency Matrix",
      path: "/comp-matrix*",
      icon: <Grid3X3Icon className="h-5 w-5" />,
    },
    {
      name: "Comp Matrix Calibration",
      path: "/comp-matrix-calibration*",
      icon: <CalendarCheckIcon className="h-5 w-5" />,
    },
    {
      name: "Comp Matrix Editor",
      path: "/comp-matrix-editor*",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
    {
      name: "Comp Matrix Reports",
      path: "/comp-matrix-reports*",
      icon: <ChartAreaIcon className="h-5 w-5" />,
    },
    {
      name: "Comp Matrix Import",
      path: "/comp-matrix-import*",
      icon: <ImportIcon className="h-5 w-5" />,
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
            const isActive = item.path.endsWith("*")
              ? pathname.startsWith(item.path.slice(0, -1)) &&
                !pathname.slice(item.path.slice(0, -1).length).startsWith("-")
              : pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path.replace("*", "")}
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
