"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="border-border animate-slide-in fixed h-[calc(100%-4rem)] w-64 overflow-y-auto border-r">
      <Link href="/admin">Admin</Link>
    </aside>
  );
}
