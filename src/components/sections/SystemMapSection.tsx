import React, { useState } from "react"
import { motion } from "framer-motion"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import useMotionConfig from "../../hooks/useMotionConfig"
import {
  systemMapCenter,
  systemMapNodes,
  getSystemMapPosition,
} from "../../content/systemMap"

const CENTER = { x: 50, y: 50 }

const SystemMapSection: React.FC = () => {
  const { lineDraw, prefersReducedMotion } = useMotionConfig()
  const [activeId, setActiveId] = useState(systemMapNodes[0]?.id ?? "")
  const activeNode =
    systemMapNodes.find((node) => node.id === activeId) ?? systemMapNodes[0]

  return (
    <MotionSection
      id="system-map"
      aria-labelledby="system-map-heading"
      className="relative py-20 md:py-24"
    >
      <div className="container relative mx-auto max-w-6xl px-6">
        <V2SectionHead
          layout="stacked"
          titleId="system-map-heading"
          label="Systems map"
          title="One developer across the parts that usually break."
          copy="Frontend, WordPress, hosting, DNS, email, SEO, and performance — connected so problems get traced to the right layer."
        />

        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-4 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(var(--v2-line) 1px, transparent 1px), linear-gradient(90deg, var(--v2-line) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative mx-auto aspect-square w-full max-w-xl">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="36"
                  fill="none"
                  stroke="var(--v2-line)"
                  strokeWidth="0.25"
                  strokeDasharray="1 2"
                />
                {systemMapNodes.map((node, index) => {
                  const pos = getSystemMapPosition(index, systemMapNodes.length)
                  return (
                    <motion.line
                      key={`line-${node.id}`}
                      x1={CENTER.x}
                      y1={CENTER.y}
                      x2={pos.x}
                      y2={pos.y}
                      stroke="var(--v2-line-strong)"
                      strokeWidth="0.4"
                      strokeOpacity={activeId === node.id ? 0.9 : 0.45}
                      {...lineDraw}
                    />
                  )
                })}
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="2.2"
                  className="fill-[var(--v2-acid)]"
                />
              </svg>

              <div
                className="absolute left-1/2 top-1/2 z-20 max-w-[9rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-3 py-2 text-center shadow-[var(--v2-shadow)]"
                aria-hidden="true"
              >
                <span className="text-xs font-bold leading-tight text-[var(--v2-text)] md:text-sm">
                  {systemMapCenter.label}
                </span>
              </div>

              {systemMapNodes.map((node, index) => {
                const pos = getSystemMapPosition(index, systemMapNodes.length)
                const isActive = activeId === node.id
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-expanded={isActive}
                    aria-controls={`system-map-detail-${node.id}`}
                    className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-bold tracking-tight transition-[border-color,background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none md:px-3 md:py-2 md:text-xs ${
                      isActive
                        ? "border-[var(--v2-acid)] bg-[var(--v2-acid)]/12 text-[var(--v2-text)] shadow-[0_0_0_1px_rgba(77,124,15,0.25)]"
                        : "border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/35"
                    } ${!prefersReducedMotion && isActive ? "scale-105" : ""}`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    {node.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 md:hidden">
            {systemMapNodes.map((node) => (
              <button
                key={`chip-${node.id}`}
                type="button"
                onClick={() => setActiveId(node.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                  activeId === node.id
                    ? "border-[var(--v2-acid)] bg-[var(--v2-acid)]/10 text-[var(--v2-text)]"
                    : "border-[var(--v2-line)] text-[var(--v2-muted)]"
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>

          {activeNode ? (
            <div
              id={`system-map-detail-${activeNode.id}`}
              className="mt-6 rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6"
              role="region"
              aria-label={`${activeNode.label} details`}
            >
              <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--v2-acid)]">
                Coverage detail
              </p>
              <h3 className="mb-3 mt-2 text-lg font-bold text-[var(--v2-text)]">
                {activeNode.label}
              </h3>
              <ul className="space-y-2 text-sm text-[var(--v2-muted)]">
                {activeNode.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="text-[var(--v2-acid)]" aria-hidden="true">
                      →
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="sr-only">
          <h3>All coverage areas</h3>
          <ul>
            {systemMapNodes.map((node) => (
              <li key={node.id}>
                <strong>{node.label}</strong>: {node.details.join("; ")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MotionSection>
  )
}

export default SystemMapSection
