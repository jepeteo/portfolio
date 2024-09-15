import React, { useEffect, useMemo } from "react"
import mySkills from "../assets/mySkills.json"
import { initPopovers } from "flowbite"

interface SkillProps {
  category: string
  animation: string
}

interface Skill {
  skillName: string
  category: string
  description: string
  visible: boolean
}

const initializeFlowbite = () => {
  initPopovers()
}

const Skill: React.FC<SkillProps> = ({ category, animation }) => {
  useEffect(() => {
    initializeFlowbite()
  }, [])

  const memoSkills = useMemo(() => {
    return mySkills
      .filter((skill: Skill) => skill.category === category && skill.visible)
      .map((skill: Skill) => (
        <li key={skill.skillName} className="mySkill">
          <button
            data-popover-target={`popover-${skill.skillName}`}
            type="button"
            className="skill grow px-3 py-2 text-center"
          >
            {skill.skillName}
          </button>
          <div
            id={`popover-${skill.skillName}`}
            role="tooltip"
            className="absolute z-10 invisible inline-block w-64 text-sm text-gray-900 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-100 dark:border-gray-500 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {skill.skillName}
              </h3>
            </div>
            <div className="px-3 py-2">
              <p>{skill.description}</p>
            </div>
            <div data-popper-arrow></div>
          </div>
        </li>
      ))
  }, [category])

  if (!memoSkills.length) {
    return <div>No skills available</div>
  }

  return (
    <div
      className={`skill--container flex flex-col mb-8 p-4 items-center w-[96%] md:w-[48%] grow-0 ${animation}`}
    >
      <h3 className="text-2xl mt-4 text-center">{category}</h3>
      <ul className="list-none list-inside mt-4 flex flex-wrap gap-4">
        {memoSkills}
      </ul>
    </div>
  )
}

export default Skill
