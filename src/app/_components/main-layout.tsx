"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import { TopNav } from "./top-nav";

// Define paths where sidebar should always be hidden
const noSidebarPaths = ["/sign-in", "/verify-email"];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHasBeenToggled, setSidebarHasBeenToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setSidebarHasBeenToggled(true);
  };
  
  // Check if current path is in the no-sidebar list
  const isNoSidebarPath = noSidebarPaths.some(path => pathname?.startsWith(path));
  
  // Determine if we should show the sidebar based on authentication status and current path
  const showSidebar = isSignedIn === true && !isNoSidebarPath;

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <TopNav toggleSidebar={showSidebar ? toggleSidebar : undefined} hasSidebar={showSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar isOpen={sidebarOpen} hasBeenToggled={sidebarHasBeenToggled} />}
        <main
          className={`flex-1 overflow-auto p-4 transition-all duration-200 md:p-6 ${showSidebar && sidebarOpen ? "ml-64" : "ml-0"}`}
        >
          {showSidebar ? (
            <div className="mx-auto max-w-7xl">{children}</div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
