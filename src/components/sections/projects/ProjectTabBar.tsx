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
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 backdrop-blur-sm dark:border-slate-600/70 dark:bg-slate-800/95">
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
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="project-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab.label}
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-white/20 text-inherit"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  )}
                >
                  {count}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {projectTabs.find((tab) => tab.id === activeTab)?.description}
      </p>
    </div>
  )
}

export default ProjectTabBar
