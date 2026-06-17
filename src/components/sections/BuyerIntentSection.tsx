import React from "react"
import { useTheme } from "../context/ThemeContext"
import { Wrench, AppWindow, ServerCog } from "lucide-react"

const intents = [
  {
    id: "intent-wordpress",
    title: "WordPress / WooCommerce",
    description:
      "Conversion-focused websites, e-commerce stores, and long-term WordPress support. See 120+ live client sites.",
    href: "#projects",
    cta: "See WordPress projects",
    icon: Wrench,
  },
  {
    id: "intent-apps",
    title: "Custom app (React / TS)",
    description:
      "Custom frontends, product features, and web apps built with React and TypeScript.",
    href: "#web-projects",
    cta: "See featured web apps",
    icon: AppWindow,
  },
  {
    id: "intent-infra",
    title: "Server / Infrastructure support",
    description:
      "Server administration, hosting hardening, deployment pipelines, performance tuning, and incident support.",
    href: "#experience",
    cta: "See infrastructure experience",
    icon: ServerCog,
  },
]

const BuyerIntentSection: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <section id="buyer-intent" className={isDark ? "bg-slate-950 py-16" : "bg-slate-50 py-16"}>
      <div className="container px-6">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
          Choose What You Need
        </h2>
        <p className={`text-center max-w-3xl mx-auto mb-10 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Pick the path that matches your immediate goal and jump straight to the most relevant proof.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {intents.map((intent) => {
            const Icon = intent.icon
            return (
              <a
                key={intent.id}
                id={intent.id}
                href={intent.href}
                className={`group flex flex-col rounded-2xl border p-6 transition-colors ${
                  isDark
                    ? "bg-slate-900 border-slate-700 hover:border-blue-500"
                    : "bg-white border-slate-200 hover:border-blue-500"
                }`}
              >
                <Icon className="w-7 h-7 text-blue-500 mb-4" />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {intent.title}
                </h3>
                <p
                  className={`mb-4 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {intent.description}
                </p>
                <span className="mt-auto text-sm font-semibold text-blue-500 group-hover:text-blue-400">
                  {intent.cta} →
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BuyerIntentSection
