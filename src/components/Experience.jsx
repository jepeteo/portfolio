import jobExperience from "../assets/jobExperience.json"
import { nanoid } from "nanoid"

export default function Experience() {
  const jobs = jobExperience.map((job) => (
    <div
      key={nanoid(8)}
      className="flex flex-col w-full md:flex-row justify-between py-4"
    >
      <div className="flex flex-col grow p-8 border shadow-lg scroll-appear">
        <h3 className="text-xl font-bold mb-2">{job.title}</h3>
        <p className="text-md font-light italic mb-2">
          {job.company} || {job.from} - {job.to ? job.to : "Present"}
        </p>
        <p>{job.description}</p>
      </div>
    </div>
  ))

  return (
    <section className="container" id="experience">
      <h2 className="text-5xl font-bold ">Experience</h2>
      {jobs}
    </section>
  )
}
