import React from "react"
import { motion } from "framer-motion"
import { Wrench, AppWindow, ServerCog } from "lucide-react"
import SectionShell from "../ui/SectionShell"
import SurfaceCard from "../ui/SurfaceCard"
import IconWell from "../ui/IconWell"
import { useMotionConfig } from "../../hooks/useMotionConfig"

const intents = [
  {
    id: "intent-wordpress",
    title: "WordPress / WooCommerce",
    description:
      "Conversion-focused websites, e-commerce stores, and long-term WordPress support. See 120+ live client sites.",
    href: "#projects",
    cta: "See WordPress projects",
    icon: Wrench,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "intent-apps",
    title: "Custom app (React / TS)",
    description:
      "Custom frontends, product features, and web apps built with React and TypeScript.",
    href: "#projects?tab=client",
    cta: "See featured web apps",
    icon: AppWindow,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "intent-infra",
    title: "Server / Infrastructure support",
    description:
      "Server administration, hosting hardening, deployment pipelines, performance tuning, and incident support.",
    href: "#experience",
    cta: "See infrastructure experience",
    icon: ServerCog,
    gradient: "from-emerald-500 to-teal-500",
  },
]

const BuyerIntentSection: React.FC = () => {
  const { stagger } = useMotionConfig()

  return (
    <SectionShell
      id="buyer-intent"
      eyebrow="Start here"
      title="Choose What You Need"
      subtitle="Pick the path that matches your immediate goal and jump straight to the most relevant proof."
      variant="muted"
      decoration="grid"
      align="center"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {intents.map((intent, index) => {
          const Icon = intent.icon
          return (
            <motion.div
              key={intent.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stagger(index) }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <SurfaceCard
                as="a"
                id={intent.id}
                href={intent.href}
                interactive
                accent="left"
                className="group flex h-full flex-col p-6"
              >
                <IconWell
                  icon={Icon}
                  gradient={intent.gradient}
                  className="mb-4"
                />
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {intent.title}
                </h3>
                <p className="mb-4 flex-grow text-slate-600 dark:text-slate-400">
                  {intent.description}
                </p>
                <span className="mt-auto text-sm font-semibold text-blue-500 transition-transform group-hover:translate-x-1 dark:text-blue-400">
                  {intent.cta} →
                </span>
              </SurfaceCard>
            </motion.div>
          )
        })}
      </div>
    </SectionShell>
  )
}

export default BuyerIntentSection
