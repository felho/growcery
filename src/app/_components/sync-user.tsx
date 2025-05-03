"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  organizationId: number | null;
};

export function SyncUser({ organizationId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!organizationId || !pathname) return;

    const expectedPrefix = `/o/${organizationId}`;

    if (pathname.startsWith("/o/") && !pathname.startsWith(expectedPrefix)) {
      router.replace(expectedPrefix);
    }
  }, [organizationId, pathname, router]);

  return null;
}
