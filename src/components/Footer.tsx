import React from "react"
import { BsEnvelopeAt, BsLinkedin, BsGithub } from "react-icons/bs"

const Footer: React.FC = () => {
  return (
    <footer className="p-2 border-t border-slate-700">
      <div className="container grid grid-cols-1 p-0 justify-between items-center gap-4 md:flex-row md:grid-cols-3">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Theodore Mentis
        </div>
        <div className="connect flex justify-center gap-2">
          <a
            href="https://github.com/jepeteo"
            className="p-2 rounded-xl"
            title="Find me on Github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub className="inline h-6 w-6 text-black" />
          </a>
          <a
            href="https://www.linkedin.com/in/thmentis/"
            className="p-2 rounded-xl"
            title="View my profile on LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsLinkedin className="inline h-6 w-6 text-black" />
          </a>
          <a
            href="mailto:th.mentis@gmail.com"
            className="p-2 rounded-xl"
            title="Send me an email"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsEnvelopeAt className="inline h-6 w-6 text-black" />
          </a>
        </div>
        <div className="text-center md:text-right">
          Made with React / Typescript & Tailwind CSS
        </div>
      </div>
    </footer>
  )
}

export default Footer
