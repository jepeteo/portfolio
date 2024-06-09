import { ReactTyped } from "react-typed"

const TypedText = () => (
  <ReactTyped
    strings={[
      "SENIOR FULL STACK DEVELOPER",
      "WORDPRESS &amp; WOOCOMMERCE EXPERT",
      "SERVER ADMINISTRATOR",
    ]}
    typeSpeed={48}
    backSpeed={24}
    backDelay={1000}
    className="text-lg md:text-xl font-bold typed-text"
    loop
  >
    <span></span>
  </ReactTyped>
)

export default TypedText
