import React from "react"
import { ArrowRight } from "lucide-react"
import { v2PrimaryButton, v2SecondaryButton } from "../../ui/v2Styles"

interface SkillsCallToActionProps {
  onScrollToProjects: () => void
  onScrollToContact: () => void
}

const SkillsCallToAction: React.FC<SkillsCallToActionProps> = ({
  onScrollToProjects,
  onScrollToContact,
}) => {
  return (
    <div className="mt-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--v2-line-strong)] bg-[radial-gradient(circle_at_15%_20%,rgb(from_var(--v2-brand)_r_g_b/0.16),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(from_var(--v2-acid)_r_g_b/0.12),transparent_44%),var(--v2-panel)] p-8 text-center">
        <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--v2-text)] md:text-3xl">
          Have a project that needs these skills?
        </h3>
        <p className="mx-auto mb-8 mt-4 max-w-2xl leading-relaxed text-[var(--v2-muted)]">
          These are the tools I use to fix, improve and build business websites.
          Tell me what you need and I'll map out a practical plan.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onScrollToProjects}
            className={v2PrimaryButton}
          >
            View my work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onScrollToContact}
            className={v2SecondaryButton}
          >
            Start a project
          </button>
        </div>
      </div>
    </div>
  )
}

export default SkillsCallToAction
