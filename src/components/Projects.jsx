import { useState, useMemo } from "react"
import myProjects from "./../assets/myProjects.json"
import FilterButtons from "./FilterButtons"
import usePagination from "./../hooks/usePagination"

const Projects = () => {
  const [projectType, setProjectType] = useState(null)
  const projectsPerPage = 9

  const filteredProjects = useMemo(() => {
    const featured = myProjects.filter((project) => project.prFeatured)
    const nonFeatured = myProjects
      .filter((project) => project.prFeatured === false)
      .filter(
        (project) => projectType === null || project.prType === projectType
      )
      .sort((a, b) => a.prName.localeCompare(b.prName))

    return [...featured, ...nonFeatured]
  }, [projectType])

  const {
    displayItems: displayProjects,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(filteredProjects, projectsPerPage)

  const memoizedProjects = useMemo(() => {
    return displayProjects.map((project) => (
      <div key={project.prName}>
        <a
          href={project.prUrl}
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div
            className="bg-cover w-full rounded-md h-56 animate-scrollImage"
            style={{
              backgroundImage: `url(images/projects/${project.prImageSlug}.webp)`,
            }}
            role="img"
            aria-label={`Snapshot of project ${project.prName}`}
          ></div>
          <div className="flex flex-col justify-between p-4 w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {project.prName}
            </h5>
            <p className=" mb-3 font-normal text-gray-700 dark:text-gray-400 pb-2 border-b border-slate-600 md:leading-tight md:min-h-12">
              {project.prDescription}
            </p>
            <div className="border rounded-xl min-w-16 px-2 py-1 text-center text-sm bg-slate-700 ml-auto">
              {project.prType}
            </div>
          </div>
        </a>
      </div>
    ))
  }, [displayProjects])

  return (
    <section className="container" id="projects">
      <h2 className="text-5xl font-bold">Projects</h2>

      <FilterButtons
        setProjectType={setProjectType}
        setCurrentPage={() => goToPage(1)}
      />

      <ul className="grid my-8 gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {memoizedProjects}
      </ul>
      <nav aria-label="Projects navigation">
        <ul className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`border rounded-xl w-12 py-1 text-center text-sm bg-slate-700 mx-1 ${
                  currentPage === index + 1 ? "bg-gray-900 text-white" : ""
                }`}
                onClick={() => goToPage(index + 1)}
                aria-label={`Go to page ${index + 1}`}
                aria-current={currentPage === index + 1 ? "page" : undefined}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}

export default Projects
