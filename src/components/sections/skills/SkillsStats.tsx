import React from "react"
import { Coffee, Heart, Star } from "lucide-react"

interface SkillsStatsProps {
  totalSkills: number
  masteredSkills: number
  proficientSkills: number
  compact?: boolean
}

const SkillsStats: React.FC<SkillsStatsProps> = ({
  totalSkills,
  masteredSkills,
  proficientSkills,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-around rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--v2-text)]">
            {totalSkills}
          </div>
          <div className="text-xs text-[var(--v2-soft)]">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--v2-acid)]">
            {masteredSkills}
          </div>
          <div className="text-xs text-[var(--v2-soft)]">Mastered</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--v2-brand)]">
            {proficientSkills}
          </div>
          <div className="text-xs text-[var(--v2-soft)]">Proficient</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6">
      <h4 className="mb-4 text-lg font-bold tracking-tight text-[var(--v2-text)]">
        My journey so far
      </h4>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--v2-muted)]">
            <Coffee className="h-4 w-4" aria-hidden="true" />
            Technologies learned
          </span>
          <span className="font-bold text-[var(--v2-text)]">{totalSkills}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--v2-muted)]">
            <Heart className="h-4 w-4" aria-hidden="true" />
            Mastered
          </span>
          <span className="font-bold text-[var(--v2-acid)]">
            {masteredSkills}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--v2-muted)]">
            <Star className="h-4 w-4" aria-hidden="true" />
            Proficiently using
          </span>
          <span className="font-bold text-[var(--v2-brand)]">
            {proficientSkills}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SkillsStats
