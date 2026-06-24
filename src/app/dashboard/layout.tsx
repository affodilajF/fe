import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { GlobalErrorDialog } from "@/components/global-error-provider";
import { GlobalConfirmDialog } from "@/components/ui/confirm-dialog";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-hidden">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 60)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="min-w-0">
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
      <GlobalErrorDialog />
      <GlobalConfirmDialog />
    </div>
  );
}
