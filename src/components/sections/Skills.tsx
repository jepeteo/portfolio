import React from "react"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import SectionShell from "../ui/SectionShell"
import SkillsCallToAction from "./skills/SkillsCallToAction"
import SkillsLayerCard from "./skills/SkillsLayerCard"
import { evidenceLayers, evidenceLabel } from "../../content/skillsEvidence"
import { MotionSection } from "../motion"

const Skills: React.FC = () => {
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  return (
    <SectionShell
        ref={targetRef}
        id="skills"
        variant="muted"
        eyebrow="Stack depth"
        title="Skills across the full stack."
        subtitle="Grouped by how I use them in production — from interfaces people touch to infrastructure that keeps sites stable."
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <MotionSection as="div" className="space-y-4">
          {evidenceLayers.map((layer, index) => (
            <SkillsLayerCard
              key={layer.id}
              layer={{
                ...layer,
                subtitle: `${layer.subtitle} · ${evidenceLabel[layer.evidence]}`,
              }}
              index={index}
              zIndex={evidenceLayers.length - index}
            />
          ))}
        </MotionSection>

        <SkillsCallToAction />
      </SectionShell>
  )
}

Skills.displayName = "Skills"
export default Skills
