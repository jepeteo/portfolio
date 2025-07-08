import React, { memo } from "react"
import { ReactTyped } from "react-typed"
import { useTheme } from "../context/ThemeContext"

const TypedText: React.FC = memo(() => {
  const { isDark } = useTheme()

  return (
    <ReactTyped
      strings={[
        "Building your vision together",
        "Listening to your ideas first",
        "Co-creating digital experiences",
        "Partnering for your success",
      ]}
      typeSpeed={48}
      backSpeed={24}
      backDelay={1000}
      className={`text-lg md:text-xl font-bold typed-text transition-colors ${
        isDark ? "text-blue-400" : "text-blue-600"
      }`}
      loop
    >
      <span></span>
    </ReactTyped>
  )
})

TypedText.displayName = "TypedText"

export default TypedText
