import React, { useCallback } from "react"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import SectionShell from "../ui/SectionShell"
import SkillsCallToAction from "./skills/SkillsCallToAction"
import SkillsLayerCard from "./skills/SkillsLayerCard"
import { skillsLayers } from "../../content/skillsLayers"
import { MotionSection } from "../motion"

const Skills: React.FC = () => {
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const scrollToProjects = useCallback(() => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <SectionShell
        ref={targetRef}
        id="skills"
        variant="muted"
        eyebrow="Stack depth"
        title="Skills across the full stack."
        subtitle="Structured by layer — from interfaces users touch to infrastructure and stability work that keeps production safe."
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <MotionSection as="div" className="space-y-4">
          {skillsLayers.map((layer, index) => (
            <SkillsLayerCard
              key={layer.id}
              layer={layer}
              index={index}
              zIndex={skillsLayers.length - index}
            />
          ))}
        </MotionSection>

        <SkillsCallToAction
          onScrollToProjects={scrollToProjects}
          onScrollToContact={scrollToContact}
        />
      </SectionShell>
  )
}

Skills.displayName = "Skills"
export default Skills
