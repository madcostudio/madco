"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function NavigationWrapper({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-grow z-10">{children}</main>
      {footer}
    </>
  );
}
