import React, { useState } from "react"
import sun from "/src/assets/images/sun.svg"
import moon from "/src/assets/images/moon.svg"

interface NavProps {
  toggleDarkMode: () => void
  darkMode: boolean
}

interface Link {
  href: string
  text: string
}

const Nav: React.FC<NavProps> = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  let links: Link[] = [
    { href: "#top", text: "Home" },
    { href: "#skills", text: "Skills" },
    { href: "#experience", text: "Experience" },
    { href: "#certificates", text: "Certificates" },
    { href: "#projects", text: "Projects" },
    { href: "#contact", text: "Contact" },
  ]

  return (
    <nav>
      <div className="flex justify-between items-center p-4">
        {isOpen && (
          <ul className="absolute top-24 slide-menu flex flex-col justify-between items-center gap-8 p-4 w-full left-0 shadow-md md:hidden">
            {links.map((link) => (
              <li key={link.text}>
                <a href={link.href}>{link.text}</a>
              </li>
            ))}
          </ul>
        )}

        <ul className="hidden md-menu md:flex md:static gap-2 mr-4 xl:gap-4">
          {links.map((link) => (
            <li key={link.text}>
              <a className="menu-item" href={link.href}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={toggleMenu}
          className="menu-ham block md:hidden order-2 p-1 rounded-full text-white"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        {toggleDarkMode && (
          <button onClick={toggleDarkMode} className="p-2 rounded-lg">
            {darkMode ? (
              <img
                src={sun}
                className="h-8 toggle-darklight"
                alt="Sun - Switch to light mode"
              />
            ) : (
              <img
                src={moon}
                className="h-8 toggle-darklight"
                alt="Moon - Switch to dark mode"
              />
            )}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Nav
