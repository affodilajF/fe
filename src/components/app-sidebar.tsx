"use client";

import * as React from "react";
import {
  IconInnerShadowTop,
  IconReport,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { t } from "@/lib/translations";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: "",
      email: "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("ai_detection_system"),
        url: "/dashboard/upload-detect",
        icon: IconReport,
      },
      {
        title: t("compliance_dashboard"),
        url: "/dashboard/compliance-dashboard-v2",
        icon: IconReport,
      },
    ],
    navSecondary: [],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader >
        <SidebarMenu >
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard/upload-detect">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  {t("ppe_monitor")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent >
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
