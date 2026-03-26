"use client";

import { usePathname } from "next/navigation";

export default function ConditionalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Paths that should NOT have the global header and footer
  const isExcluded =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/access") ||
    pathname?.startsWith("/request-access");

  if (isExcluded) return null;

  return <>{children}</>;
}
