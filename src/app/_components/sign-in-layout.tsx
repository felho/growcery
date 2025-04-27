"use client";

import { TopNav } from "./top-nav";

const SignInLayout = () => {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      <TopNav toggleSidebar={() => {}} />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex h-full w-full items-center justify-center text-center">
          <div className="text-center text-3xl">Please sign in above</div>
        </main>
      </div>
    </div>
  );
};

export default SignInLayout;
