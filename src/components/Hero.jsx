import TypedText from "./TypedText"
import programmer from "../assets/images/programmer.webp"

export default function Hero() {
  return (
    <section className="container flex flex-col items-center justify-between min-h-[80vh] lg:flex-row">
      <div className="">
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
          className="h-80 object-cover shadow-lg rounded-xl"
          src={programmer}
          alt="Theodore Mentis"
        />
      </div>
    </section>
  )
}
