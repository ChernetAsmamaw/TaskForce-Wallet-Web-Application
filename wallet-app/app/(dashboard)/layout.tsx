// app/(dashboard)/layout.tsx
import React, { ReactNode } from "react";
import NavBar from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <NavBar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
