import React from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "../../../utils/styles"

type ProjectCardOverlayProps = {
  href: string
  label?: string
  ariaLabel: string
  className?: string
}

const ProjectCardOverlay: React.FC<ProjectCardOverlayProps> = ({
  href,
  label = "View Project",
  ariaLabel,
  className,
}) => (
  <>
    <div
      className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent",
        "dark:from-slate-900/80 dark:via-slate-900/40",
        className
      )}
      aria-hidden="true"
    />
    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl bg-white/90 px-6 py-3 text-sm font-medium text-slate-900 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
        aria-label={ariaLabel}
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        {label}
      </a>
    </div>
  </>
)

export default ProjectCardOverlay
