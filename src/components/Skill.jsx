import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import mySkills from "../assets/mySkills.json";
import { initPopovers } from 'flowbite';

// Initialize Flowbite popovers
const initializeFlowbite = () => {
  initPopovers();
};

export default function Skills({ category, animation }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    initializeFlowbite();
  }, []);

  const skillList = mySkills
    .filter((skill) => skill.category === category)
    .filter((skill) => skill.visible === true)
    .map((skill) => (
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
            <h3 className="font-semibold text-gray-900 dark:text-white">{skill.skillName}</h3>
          </div>
          <div className="px-3 py-2">
            <p>{skill.description}</p>
          </div>
          <div data-popper-arrow></div>
        </div>
      </li>
    ));

  return (
    <div
      className={`skill--container flex flex-col mb-8 p-4 items-center w-[96%] md:w-[48%] grow-0 ${animation}`}
    >
      <h3 className="text-2xl mt-4 text-center">{category}</h3>
      <ul className="list-none list-inside mt-4 flex flex-wrap gap-4">
        {skillList}
      </ul>
    </div>
  );
}

Skills.propTypes = {
  category: PropTypes.string,
  animation: PropTypes.string,
};



//   const handleMouseEnter = (skill) => setHoveredSkill(skill)
//   const handleMouseLeave = () => setHoveredSkill(null)

//   const skillList = mySkills
//     .filter((skill) => skill.category === category)
//     .filter((skill) => skill.visible === true)
//     .map((skill) => (
//         {/* <li
//           className="skill grow px-4 py-2 text-center"
//           key={skill.skillName}
//           onMouseEnter={() => handleMouseEnter(skill)}
//           onMouseLeave={handleMouseLeave}>
//           {skill.skillName}
//           {hoveredSkill === skill && (
//               <div className="skill--description">{skill.description}</div>
//           )}
//         </li> */}
//     ))
