import React from "react"
import TypedText from "./TypedText.tsx"
import programmer from "/src/assets/images/new_programmer.webp"

const Hero: React.FC = () => {
  return (
    <section className="container flex flex-col items-center justify-between min-h-[80vh] lg:flex-row">
      <div className="exit">
        <p className="py-4">
          <TypedText />
        </p>
        <h1 className="text-3xl font-bold md:text-5xl">
          Hi 👋,<br></br> I am Theodore Mentis.
        </h1>
        <p className="mt-8 tagline">
          Transforming Complex Problems into Elegant Solutions
        </p>
      </div>

      <div className="">
        <img
          className="max-h-[400px] object-cover shadow-lg rounded-3xl"
          src={programmer}
          alt="Theodore Mentis - Senior Wordpress Developer"
        />
      </div>
    </section>
  )
}

export default Hero
