import React from "react"
import PropTypes from "prop-types"
import mySkills from "../assets/mySkills.json"

export default function Skills({ category, animation }) {
  const [hoveredSkill, setHoveredSkill] = React.useState(null)
  const handleMouseEnter = (skill) => setHoveredSkill(skill)
  const handleMouseLeave = () => setHoveredSkill(null)

  const skillList = mySkills
    .filter((skill) => skill.category === category)
    .filter((skill) => skill.visible === true)
    .map((skill) => (
      <li
        className="skill grow px-4 py-2 text-center"
        key={skill.skillName}
        onMouseEnter={() => handleMouseEnter(skill)}
        onMouseLeave={handleMouseLeave}
      >
        {skill.skillName}
        {hoveredSkill === skill && (
          <div className="skill--description">{skill.description}</div>
        )}
      </li>
    ))

  return (
    <div
      className={`skill--container flex flex-col mb-8 p-4 items-center w-[96%] md:w-[48%] grow-0 ${animation}`}
    >
      <h3 className="text-2xl mt-4 text-center">{category}</h3>
      <ul className="list-none list-inside mt-4 flex flex-wrap gap-4">
        {skillList}
      </ul>
    </div>
  )
}

Skills.propTypes = {
  category: PropTypes.string,
  animation: PropTypes.string,
}
