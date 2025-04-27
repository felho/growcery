"use client";

import { useState } from "react";
import Sidebar from "./sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <Sidebar />
      <main
        className={`flex-1 overflow-auto p-4 transition-all duration-200 md:p-6 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
