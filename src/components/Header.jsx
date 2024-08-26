import PropTypes from "prop-types"
import Nav from "./Nav"
import logo from "../assets/images/teo.png"

export default function Header({ toggleDarkMode, darkMode }) {
  return (
    <header className="border-b border-slate-700 sticky top-0 bg-slate-900/50 backdrop-blur-md z-10">
      <div className="container flex justify-between items-center py-2">
        <img src={logo} alt="logo" width="80px" className="p-2" />
        <span className="w-0 mr-auto md:invisible xl:visible xl:w-auto">
          Theodoros Mentis
        </span>
        <Nav toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </header>
  )
}

Header.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
}
