import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../../utils/styles"
import { projectTabCounts, projectTabs } from "../../../content/projects"
import type { ProjectTab } from "../../../config/navigation"

type ProjectTabBarProps = {
  activeTab: ProjectTab
  onTabChange: (tab: ProjectTab) => void
}

const ProjectTabBar: React.FC<ProjectTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      className="mb-10 flex flex-col gap-4"
      role="tablist"
      aria-label="Project categories"
    >
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-1.5">
        {projectTabs.map((tab) => {
          const isActive = activeTab === tab.id
          const count = projectTabCounts[tab.id]

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`projects-panel-${tab.id}`}
              id={`projects-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)]",
                isActive
                  ? "text-[var(--v2-acid-ink)]"
                  : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="project-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-[var(--v2-acid)] shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab.label}
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-black/15 text-inherit"
                      : "border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 text-[var(--v2-muted)]"
                  )}
                >
                  {count}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-sm text-[var(--v2-soft)]">
        {projectTabs.find((tab) => tab.id === activeTab)?.description}
      </p>
    </div>
  )
}

export default ProjectTabBar
