import React from "react"
import { Mail, Download } from "lucide-react"
import { v2PrimaryButton, v2SecondaryButton } from "../../ui/v2Styles"

interface ExperienceCallToActionProps {
  isDark: boolean
}

export const ExperienceCallToAction: React.FC<
  ExperienceCallToActionProps
> = () => {
  return (
    <div className="rounded-[2rem] border border-[var(--v2-line-strong)] bg-[radial-gradient(circle_at_15%_20%,rgb(from_var(--v2-brand)_r_g_b/0.16),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(from_var(--v2-acid)_r_g_b/0.12),transparent_44%),var(--v2-panel)] p-8 text-center">
      <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
        Let's work together
      </h3>

      <p className="mx-auto mb-8 mt-4 max-w-2xl text-lg text-[var(--v2-muted)]">
        Need someone who can fix, improve and build? Tell me about your project
        and I'll explain how my experience maps to it.
      </p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <a href="#contact" className={v2PrimaryButton}>
          <Mail className="h-5 w-5" aria-hidden="true" />
          Start a project
        </a>

        <a
          href="/cv/Theodoros-Mentis-CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={v2SecondaryButton}
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Download CV
        </a>
      </div>
    </div>
  )
}
