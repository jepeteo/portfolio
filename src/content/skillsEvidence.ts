import mySkills from "../assets/mySkills.json"
import { skillsLayers, type SkillsLayer } from "./skillsLayers"

export type SkillEvidenceLevel =
  | "core-production"
  | "extensive"
  | "working"
  | "developing"

export type SkillRecord = {
  skillName: string
  category: string
  description?: string
  level: number
  experienceYears: number
  icon?: string
  trend?: string
  visible?: boolean
}

export type EvidenceSkill = {
  name: string
  category: string
  evidence: SkillEvidenceLevel
  experienceYears: number
}

/**
 * Maps existing numeric skill data to evidence labels.
 * Percentages stay in JSON but must not be a primary UI device.
 */
export const evidenceLevelFromSkill = (
  skill: Pick<SkillRecord, "level" | "experienceYears">
): SkillEvidenceLevel => {
  if (skill.level >= 90 || skill.experienceYears >= 10) return "core-production"
  if (skill.level >= 80 || skill.experienceYears >= 5) return "extensive"
  if (skill.level >= 65 || skill.experienceYears >= 2) return "working"
  return "developing"
}

export const evidenceLabel: Record<SkillEvidenceLevel, string> = {
  "core-production": "Core production expertise",
  extensive: "Extensive professional use",
  working: "Active working knowledge",
  developing: "Currently developing",
}

export const evidenceSkills = (records: SkillRecord[] = mySkills as SkillRecord[]) =>
  records
    .filter((skill) => skill.visible !== false)
    .map((skill) => ({
      name: skill.skillName,
      category: skill.category,
      evidence: evidenceLevelFromSkill(skill),
      experienceYears: skill.experienceYears,
    }))

export const skillsByEvidence = (
  skills: EvidenceSkill[] = evidenceSkills()
): Record<SkillEvidenceLevel, EvidenceSkill[]> => ({
  "core-production": skills.filter((skill) => skill.evidence === "core-production"),
  extensive: skills.filter((skill) => skill.evidence === "extensive"),
  working: skills.filter((skill) => skill.evidence === "working"),
  developing: skills.filter((skill) => skill.evidence === "developing"),
})

export const evidenceLayers: Array<SkillsLayer & { evidence: SkillEvidenceLevel }> =
  skillsLayers.map((layer) => ({
    ...layer,
    evidence:
      layer.id === "wordpress" || layer.id === "backend"
        ? "core-production"
        : layer.id === "frontend"
          ? "extensive"
          : "working",
  }))
