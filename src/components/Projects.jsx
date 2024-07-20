import { useState } from "react"
import myProjects from "./../assets/myProjects.json"
import FilterButtons from "./FilterButtons"

const Projects = () => {
  const [projectType, setProjectType] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 8

  const filteredProjects = myProjects.filter(
    (project) => projectType === null || project.prType === projectType
  )
  //   .filter((project) => project.prEmployer != "employer")

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  const displayProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const projects = displayProjects.map((project) => {
    return (
      <div key={project.prName}>
        <a
          href={project.prUrl}
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div
            className="bg-cover w-full rounded-md h-56 animate-scrollImage"
            style={{
              backgroundImage: `url(images/projects/${project.prImageSlug}.png)`,
            }}
            alt={project.prName}
          ></div>
          <div className="flex flex-col justify-between p-4">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {project.prName}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 pb-4 border-b border-slate-600">
              {project.prDescription}
            </p>
            <div className="border rounded-xl min-w-16 px-2 py-1 text-center text-sm bg-slate-700 ml-auto">
              {project.prType}
            </div>
          </div>
        </a>
      </div>
    )
  })

  return (
    <section className="container" id="projects">
      <h2 className="text-5xl font-bold">Projects</h2>
      <FilterButtons
        setProjectType={setProjectType}
        setCurrentPage={setCurrentPage}
      />

      <ul className="grid my-8 gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {projects}
      </ul>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`border rounded-xl w-12 py-1 text-center text-sm bg-slate-700 mx-1 ${
              currentPage === index + 1 ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => goToPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Projects
