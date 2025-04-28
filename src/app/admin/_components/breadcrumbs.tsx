"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  path: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumb items based on the current path
  const getBreadcrumbs = (): Breadcrumb[] => {
    const pathnames = pathname.split("/").filter((x) => x);
    const breadcrumbs: Breadcrumb[] = [];

    let currentPath = "";

    // Add home breadcrumb
    breadcrumbs.push({
      label: "Admin",
      path: "/admin",
    });

    // Add subsequent breadcrumbs
    pathnames.forEach((name, index) => {
      if (index === 0 && name === "admin") return; // Skip admin in the path

      currentPath = `/admin/${pathnames.slice(1, index + 1).join("/")}`;

      const formattedName = name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label: formattedName,
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <div className="text-muted-foreground mb-4 flex items-center text-sm">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={breadcrumb.path} className="flex items-center">
            {isLast ? (
              <span className="text-foreground font-medium">
                {breadcrumb.label}
              </span>
            ) : (
              <>
                <Link
                  href={breadcrumb.path}
                  className="hover:text-foreground transition-colors"
                >
                  {breadcrumb.label}
                </Link>
                <ChevronRight className="text-muted-foreground/60 mx-2 h-4 w-4" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
