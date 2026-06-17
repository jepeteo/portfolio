import React from "react"
import { useTheme } from "../../../context/ThemeContext"
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
  const { isDark } = useTheme()

  return (
    <div
      className="mb-10 flex flex-col gap-4"
      role="tablist"
      aria-label="Project categories"
    >
      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-2xl p-1.5",
          isDark ? "bg-slate-800/80" : "bg-slate-100"
        )}
      >
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
                "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                isDark ? "focus-visible:ring-offset-slate-900" : "focus-visible:ring-offset-white",
                isActive
                  ? isDark
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-blue-700 shadow-sm"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-700/60"
                    : "text-slate-600 hover:bg-white/70"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "ml-2 rounded-full px-2 py-0.5 text-xs",
                  isActive
                    ? "bg-white/20 text-inherit"
                    : isDark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-600"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        {projectTabs.find((tab) => tab.id === activeTab)?.description}
      </p>
    </div>
  )
}

export default ProjectTabBar
