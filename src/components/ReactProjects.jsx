import React from "react"
import myReactProjects from "./../assets/myReactProjects.json"

const myRProjects = myReactProjects.map((project) => (
  <li key={project.prName}>
    <a
      href={project.prUrl}
      className="flex flex-row my-6 items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      target="_blank"
    >
      <div
        className="bg-cover w-full rounded-md h-56 max-w-[33%] animate-scrollImage"
        style={{
          backgroundImage: `url(images/react-projects/${project.prImageSlug}.webp)`,
        }}
        role="img"
        aria-label={`Snapshot of project ${project.prName}`}
      ></div>
      <div className="flex flex-col justify-between p-4 w-full">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {project.prName}
        </h5>
        <p className=" mb-3 font-normal text-gray-700 dark:text-gray-400 pb-2 border-b border-slate-600 md:leading-tight md:min-h-16">
          {project.prDescription}
        </p>
        <div className="border rounded-xl min-w-16 px-2 py-1 text-center text-sm bg-slate-700 ml-auto">
          {project.prType}
        </div>
      </div>
    </a>
  </li>
))

const ReactProjects = () => {
  return (
    <section className="container" id="projects">
      <h2 className="text-5xl font-bold">React Projects</h2>
      <ul className="py-4">{myRProjects}</ul>
    </section>
  )
}
export default ReactProjects
