"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import { TopNav } from "./top-nav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHasBeenToggled, setSidebarHasBeenToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setSidebarHasBeenToggled(true);
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <TopNav toggleSidebar={toggleSidebar} hasSidebar={true} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} hasBeenToggled={sidebarHasBeenToggled} />
        <main
          className={`flex-1 overflow-auto p-4 transition-all duration-200 md:p-6 ${sidebarOpen ? "ml-64" : "ml-0"}`}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
