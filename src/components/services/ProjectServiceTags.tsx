import React from "react"
import { useTheme } from "../../context/ThemeContext"

type ProjectServiceTagsProps = {
  tags: string[]
}

const ProjectServiceTags: React.FC<ProjectServiceTagsProps> = ({ tags }) => {
  const { isDark } = useTheme()

  if (!tags.length) return null

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-slate-300/40 dark:border-slate-600/40">
      <p
        className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Services demonstrated
      </p>
      <ul className="flex flex-wrap gap-2" aria-label="Services demonstrated">
        {tags.map((tag) => (
          <li
            key={tag}
            className={`text-xs px-2 py-1 rounded-full ${
              isDark
                ? "bg-slate-700/80 text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectServiceTags
