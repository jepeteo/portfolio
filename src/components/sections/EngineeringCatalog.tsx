import React from "react"
import { Link } from "react-router-dom"
import { v2Panel, v2SecondaryButton } from "../ui/v2Styles"
import {
  engineeringGroups,
  fintechLearning,
  fintechPath,
} from "../../content/engineeringCatalog"

const EngineeringCatalog: React.FC = () => (
  <div className="container mx-auto max-w-6xl space-y-16 px-6 pb-20">
    {engineeringGroups.map((group) => (
      <section key={group.track} aria-labelledby={`${group.track}-heading`}>
        <h2
          id={`${group.track}-heading`}
          className="font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]"
        >
          {group.title}
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {group.items.map((entry) => (
            <li key={entry.id} className={`${v2Panel} flex h-full flex-col p-6`}>
              <div className="flex flex-wrap gap-2">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                  {group.title}
                </p>
                {entry.confidential ? (
                  <span className="rounded-full border border-[var(--v2-line)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--v2-muted)]">
                    Confidential
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--v2-text)]">
                <Link
                  to={entry.href}
                  className="hover:text-[var(--v2-acid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                >
                  {entry.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-[var(--v2-muted)]">
                {entry.summary}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {entry.stack.slice(0, 5).map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--v2-line)] px-2.5 py-1 font-mono text-[11px] text-[var(--v2-muted)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    ))}

    <section aria-labelledby="fintech-path-heading" className={`${v2Panel} p-8`}>
      <h2
        id="fintech-path-heading"
        className="m-0 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]"
      >
        {fintechPath.title}
      </h2>
      <p className="mt-3 max-w-3xl text-[var(--v2-muted)]">{fintechPath.body}</p>

      {fintechLearning.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-acid)]">
            Current verified learning
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {fintechLearning.map((cert) => (
              <li key={cert.id} className="text-sm text-[var(--v2-muted)]">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    className="font-bold text-[var(--v2-text)] underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cert.title}
                  </a>
                ) : (
                  <span className="font-bold text-[var(--v2-text)]">
                    {cert.title}
                  </span>
                )}
                <span className="block text-xs text-[var(--v2-soft)]">
                  {cert.issuer} · {cert.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-acid)]">
          Future categories
        </h3>
        <p className="mt-2 text-sm text-[var(--v2-muted)]">
          These are learning and documentation categories, not job titles.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {fintechPath.futureCategories.map((category) => (
            <li
              key={category}
              className="rounded-full border border-[var(--v2-line)] px-3 py-1 font-mono text-[11px] text-[var(--v2-muted)]"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      <Link to="/certifications" className={`${v2SecondaryButton} mt-8`}>
        Browse certifications
      </Link>
    </section>
  </div>
)

export default EngineeringCatalog
