import React from "react"
import { Link } from "react-router-dom"
import { MotionSection } from "../motion"
import { v2PrimaryButton, v2SecondaryButton } from "../ui/v2Styles"
import { site } from "../../config/site"

const ContactCTA: React.FC = () => (
  <MotionSection
    id="contact-cta"
    aria-labelledby="contact-cta-heading"
    className="relative py-16 md:py-20"
  >
    <div className="container mx-auto max-w-4xl px-6 text-center">
      <p className="m-0 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--v2-acid)]">
        Contact
      </p>
      <h2
        id="contact-cta-heading"
        className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight text-[var(--v2-text)]"
      >
        Tell me what broke — or what you want to build.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--v2-muted)]">
        Name, email, and a short description is enough. I reply with a fixed
        quote before any production work. {site.location.label}, {site.workMode}.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/contact" className={v2PrimaryButton}>
          Open the contact form
        </Link>
        <Link to="/services/emergency-website-help" className={v2SecondaryButton}>
          Emergency help
        </Link>
      </div>
    </div>
  </MotionSection>
)

export default ContactCTA
