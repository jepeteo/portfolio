import React, { useState } from "react"
import { MotionCard } from "../../motion"
import type { SkillsLayer } from "../../../content/skillsLayers"

type SkillsLayerCardProps = {
  layer: SkillsLayer
  index: number
  zIndex: number
}

const SkillsLayerCard: React.FC<SkillsLayerCardProps> = ({
  layer,
  index,
  zIndex,
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <MotionCard
      index={index}
      className="relative"
      style={{ zIndex }}
      enableHover
    >
      <div
        className={`rounded-3xl border bg-[var(--v2-panel)] p-6 transition-[transform,box-shadow,border-color] duration-300 motion-reduce:transition-none ${
          focused
            ? "-translate-y-1 border-[var(--v2-acid)]/40 shadow-[var(--v2-shadow)]"
            : "border-[var(--v2-line)]"
        }`}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={0}
      >
        <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--v2-acid)]">
          Layer {index + 1}
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[var(--v2-text)]">
          {layer.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--v2-muted)]">{layer.subtitle}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {layer.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-3 py-1.5 text-xs font-medium text-[var(--v2-muted)]"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </MotionCard>
  )
}

export default SkillsLayerCard
