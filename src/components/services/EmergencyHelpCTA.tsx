import React from "react"
import { Link } from "react-router-dom"
import { v2PrimaryButton, v2SecondaryButton } from "../ui/v2Styles"

type EmergencyHelpCTAProps = {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

const EmergencyHelpCTA: React.FC<EmergencyHelpCTAProps> = ({
  title = "Need urgent website help?",
  description = "Send your website URL and a short description of the issue. I will review the scope and reply with a clear quote.",
  primaryLabel = "Request emergency help",
  primaryHref = "/?type=wordpress-emergency#contact",
  secondaryLabel,
  secondaryHref,
}) => {
  return (
    <section
      aria-labelledby="emergency-cta-heading"
      className="relative overflow-hidden rounded-[2rem] border border-[var(--v2-line-strong)] bg-[radial-gradient(circle_at_15%_20%,rgb(from_var(--v2-brand)_r_g_b/0.18),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(from_var(--v2-acid)_r_g_b/0.14),transparent_44%),var(--v2-panel)] p-8 text-center shadow-[var(--v2-shadow)] md:p-10"
    >
      <h2
        id="emergency-cta-heading"
        className="m-0 font-display text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
      >
        {title}
      </h2>
      <p className="mx-auto mt-4 mb-8 max-w-2xl text-lg text-[var(--v2-muted)]">
        {description}
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link to={primaryHref} className={v2PrimaryButton}>
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link to={secondaryHref} className={v2SecondaryButton}>
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  )
}

export default EmergencyHelpCTA
