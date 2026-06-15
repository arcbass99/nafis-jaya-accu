import type { ReactNode } from "react";
import RouteScrollReset from "@/components/RouteScrollReset";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RouteScrollReset />
      <Sidebar />
      <main className="app-main">{children}</main>
    </>
  );
}
