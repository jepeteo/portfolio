import React from "react"
import { TrendingUp, Target } from "lucide-react"

interface SkillCardProps {
  skill: {
    name: string
    level: number
    experience: string
    experienceYears: number
    icon: string
    trend: "up" | "stable" | "down"
    description: string
    mastery: string
  }
  index: number
  isVisible: boolean
  hoveredSkill: string | null
  onHover: (skillName: string | null) => void
  mobile?: boolean
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  index,
  isVisible,
  hoveredSkill,
  onHover,
  mobile = false,
}) => {
  const isHovered = hoveredSkill === skill.name

  // Single, on-brand accent scale: acid (mastered) → brand (strong) → brand-2.
  const barColor =
    skill.level >= 90
      ? "var(--v2-acid)"
      : skill.level >= 80
      ? "var(--v2-brand)"
      : "var(--v2-brand-2)"

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-[var(--v2-acid)]" />
      case "down":
        return (
          <TrendingUp className="h-3 w-3 rotate-180 text-[var(--v2-soft)]" />
        )
      default:
        return <Target className="h-3 w-3 text-[var(--v2-soft)]" />
    }
  }

  return (
    <div
      className="group"
      onMouseEnter={() => !mobile && onHover(skill.name)}
      onMouseLeave={() => !mobile && onHover(null)}
    >
      <div
        className={`relative cursor-pointer rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] transition-all duration-300 hover:border-[var(--v2-acid)]/40 motion-reduce:transition-none ${
          mobile ? "p-4" : "p-6"
        } ${isHovered && !mobile ? "border-[var(--v2-acid)]/40" : ""}`}
        onClick={() => mobile && onHover(isHovered ? null : skill.name)}
      >
        <div
          className={`flex items-start justify-between ${
            mobile ? "mb-3" : "mb-6"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={mobile ? "block text-2xl" : "block text-3xl"}
              aria-hidden="true"
            >
              {skill.icon}
            </span>
            <div>
              <h4
                className={`font-bold tracking-tight text-[var(--v2-text)] ${
                  mobile ? "text-base" : "text-xl"
                }`}
              >
                {skill.name}
              </h4>
              {mobile && (
                <span className="text-xs text-[var(--v2-muted)]">
                  {skill.mastery}
                </span>
              )}
            </div>
          </div>
          <span className="flex items-center gap-2">{getTrendIcon(skill.trend)}</span>
        </div>

        {!mobile && (
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--v2-muted)]">
              {skill.mastery}
            </span>
            <span className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-3 py-1 text-xs font-bold text-[var(--v2-text)]">
              {skill.level}%
            </span>
          </div>
        )}

        <div
          className={`relative w-full overflow-hidden rounded-full bg-[var(--v2-line)] ${
            mobile ? "h-2" : "h-2.5"
          }`}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${skill.level}%` : "0%",
              transitionDelay: `${index * 100}ms`,
              backgroundColor: barColor,
            }}
          />
        </div>

        {mobile && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-[var(--v2-soft)]">
              {skill.level}%
            </span>
          </div>
        )}

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isHovered
              ? `${mobile ? "mt-3 max-h-32" : "mt-4 max-h-40"} opacity-100`
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[var(--v2-line)] pt-3">
            <p className="text-sm leading-relaxed text-[var(--v2-muted)]">
              {skill.description}
            </p>
            {mobile && (
              <p className="mt-2 text-xs font-medium text-[var(--v2-soft)]">
                {skill.experience}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillCard
