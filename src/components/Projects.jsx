import { useState, useMemo } from "react"
import myProjects from "./../assets/myProjects.json"
import FilterButtons from "./FilterButtons"
import usePagination from "./../hooks/usePagination"

const Projects = () => {
  const [projectType, setProjectType] = useState(null)
  const projectsPerPage = 6

  const filteredProjects = useMemo(() => {
    const featured = myProjects
      .filter((project) => project.prFeatured)
      .filter(
        (project) => projectType === null || project.prType === projectType
      )
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
          target="_blank"
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
            <p className=" mb-3 font-normal text-gray-700 dark:text-gray-400 pb-2 border-b border-slate-600 md:leading-tight md:min-h-16">
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

  {
    /* PAGINATION */
  }
  const maxVisiblePages = 5 // Number of page buttons to show at once

  const renderPaginationButtons = () => {
    let buttons = []
    let startPage, endPage

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to max visible pages, show all
      startPage = 1
      endPage = totalPages
    } else {
      // Calculate start and end pages
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        startPage = 1
        endPage = maxVisiblePages
      } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1
        endPage = totalPages
      } else {
        startPage = currentPage - Math.floor(maxVisiblePages / 2)
        endPage = startPage + maxVisiblePages - 1
      }
    }

    // Add "Previous" button
    buttons.push(
      <li key="prev">
        <button
          className="border rounded-xl px-3 py-1 text-center text-sm bg-slate-700 mx-1"
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          &laquo;
        </button>
      </li>
    )

    // Add first page button if not visible
    if (startPage > 1) {
      buttons.push(
        <li key={1}>
          <button
            className="border rounded-xl w-8 py-1 text-center text-sm bg-slate-700 mx-1"
            onClick={() => goToPage(1)}
            aria-label="Go to first page"
          >
            1
          </button>
        </li>
      )
      if (startPage > 2) {
        buttons.push(<li key="ellipsis1">...</li>)
      }
    }

    // Add page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i}>
          <button
            className={`border rounded-xl w-8 py-1 text-center text-sm bg-slate-700 mx-1 ${
              currentPage === i ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        </li>
      )
    }

    // Add last page button if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<li key="ellipsis2">...</li>)
      }
      buttons.push(
        <li key={totalPages}>
          <button
            className="border rounded-xl w-8 py-1 text-center text-sm bg-slate-700 mx-1"
            onClick={() => goToPage(totalPages)}
            aria-label="Go to last page"
          >
            {totalPages}
          </button>
        </li>
      )
    }

    // Add "Next" button
    buttons.push(
      <li key="next">
        <button
          className="border rounded-xl px-3 py-1 text-center text-sm bg-slate-700 mx-1"
          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          &raquo;
        </button>
      </li>
    )

    return buttons
  }

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
        <ul className="flex justify-center items-center mt-4">
          {renderPaginationButtons()}
        </ul>
      </nav>
    </section>
  )
}

export default Projects
