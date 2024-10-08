import React from "react"
import Nav from "./Nav.tsx"
import logo from "../assets/images/teo.png"

interface HeaderProps {
  toggleDarkMode: () => void
  darkMode: boolean
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode }) => {
  return (
    <header className="border-b border-slate-700 sticky top-0 bg-slate-900/50 backdrop-blur-md z-10">
      <div className="container flex justify-between items-center py-2">
        <img src={logo} alt="logo" width="80px" className="p-2" />
        <span className="w-0 mr-auto md:invisible xl:visible xl:w-auto">
          Theodoros Mentis
          <br />
          <span className="hidden md:inline">
            Full Stack Developer | Wordpress Expert
          </span>
        </span>
        <Nav toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </header>
  )
}
export default Header
