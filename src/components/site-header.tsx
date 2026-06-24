"use client";

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { t, CURRENT_LANG, setLanguage } from "@/lib/translations"

export function SiteHeader() {
  const pathname = usePathname()
  const lastSegment = pathname?.split("/").filter(Boolean).pop() ?? ""

  const TITLE_MAP: Record<string, string> = {
    streaming: t("video_streaming"),
    analytics: t("analytics"),
    logs: t("reports"),
    dashboard: t("dashboard"),
    "compliance-dashboard-v2": t("compliance_dashboard"),
    "upload-detect": t("ai_detection_system"),
  }

  const title = TITLE_MAP[lastSegment] ?? capitalize(lastSegment)

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                CURRENT_LANG === "id"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                CURRENT_LANG === "en"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              EN
            </button>
          </div>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

