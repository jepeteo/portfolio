import react from "../assets/images/react.svg"
import tailwind from "../assets/images/tailwindcss.svg"
import github from "../assets/images/github.svg"
import linkedin from "../assets/images/linkedin.svg"

export default function Footer() {
  return (
    <footer className="p-2 border-t border-slate-700	">
      <div className="container flex p-0 justify-between items-center flex-col gap-4 md:flex-row">
        <div>&copy; {new Date().getFullYear()} Theodore Mentis</div>
        <div className="connect flex justify-center gap-2">
          <a href="https://github.com/jepeteo" className="p-2 rounded-xl">
            <img className="inline h-6" src={github} alt="Find me on Github" />
          </a>
          <a
            href="https://www.linkedin.com/in/thmentis/"
            className="p-2 rounded-xl"
          >
            <img
              className="inline h-6"
              src={linkedin}
              alt="View my profile on LinkedIn"
            />
          </a>
        </div>
        <div>
          Made with React{" "}
          <img className="inline h-6" src={react} alt="React Logo" /> & Tailwind
          CSS{" "}
          <img className="inline h-4" src={tailwind} alt="Tailwind CSS Logo" />
        </div>
      </div>
    </footer>
  )
}
