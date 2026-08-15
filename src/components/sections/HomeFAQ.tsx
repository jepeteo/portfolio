import React from "react"
import { homeFaq } from "../../content/homeFaq.js"
import V2SectionHead from "../ui/V2SectionHead"

const HomeFAQ: React.FC = () => {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="v2-grid-bg relative py-20 md:py-24"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="faq-heading"
          label="FAQ"
          title="Common questions."
          copy="Straight answers about how I work and what I can help with."
        />
        <dl className="space-y-6">
          {homeFaq.map((item) => (
            <div
              key={item.question}
              className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 md:p-8"
            >
              <dt className="m-0 font-display text-lg font-bold tracking-tight text-[var(--v2-text)] md:text-xl">
                {item.question}
              </dt>
              <dd className="m-0 mt-3 text-base leading-relaxed text-[var(--v2-muted)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default HomeFAQ
