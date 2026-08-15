// FAQ content shared by routeMeta (prerender) and HomeFAQ component.

export const homeFaq = [
  {
    question: "What technologies does Theodoros Mentis specialize in?",
    answer:
      "WordPress, WooCommerce, React, TypeScript, PHP, DNS, email routing, technical SEO, and website performance. Work spans fixes, rebuilds, and ongoing support for business sites.",
  },
  {
    question: "How many projects has Theodoros Mentis completed?",
    answer:
      "18+ years of professional web work across 390+ projects and 172+ clients: WordPress builds, WooCommerce stores, React applications, and production support.",
  },
  {
    question: "What types of projects does Theodoros Mentis work on?",
    answer:
      "Business websites, e-commerce stores, landing pages, site recoveries after updates, SEO migrations, DNS and email fixes, and performance improvements for agencies and small businesses.",
  },
]

export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
