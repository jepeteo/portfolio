import React from "react"
import Skill from "./Skill"

const Skills: React.FC = () => {
  return (
    <section className="container flex flex-wrap justify-around" id="skills">
      <h2 className="section-title mb-8 w-full">Skills & Tools</h2>
      <Skill
        key="proglang"
        animation="scroll-appear-fromleft"
        category="Programming Languages"
      />
      <Skill
        key="webgrame"
        animation="scroll-appear-fromright"
        category="Web Frameworks"
      />
      <Skill
        key="database"
        animation="scroll-appear-fromleft"
        category="Databases"
      />
      <Skill
        key="stylesht"
        animation="scroll-appear-fromright"
        category="Stylesheet Pre-processors & Data Formats"
      />
      <Skill
        key="cmsystem"
        animation="scroll-appear-fromleft"
        category="Content Management Systems"
      />
      <Skill
        key="wservers"
        animation="scroll-appear-fromright"
        category="Web Servers & Control Panels"
      />
      <Skill
        key="servermg"
        animation="scroll-appear-fromleft"
        category="Server Management"
      />
      <Skill
        key="idetexte"
        animation="scroll-appear-fromright"
        category="IDEs & Text Editors"
      />
      <Skill
        key="osystems"
        animation="scroll-appear-fromleft"
        category="Operating Systems"
      />
      <Skill
        key="containe"
        animation="scroll-appear-fromright"
        category="Containerization & Virtualization"
      />
      <Skill
        key="netwtool"
        animation="scroll-appear"
        category="Network Analysis Tools"
      />
    </section>
  )
}

export default Skills
