import React, { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  allNormalizedProjects,
  engineeringProjects,
  publicProjectDescription,
} from "../../../content/projectTaxonomy"
import {
  applyProjectQuery,
  parseProjectQuery,
  PROJECT_PAGE_SIZES,
  projectFilterOptions,
  serializeProjectQuery,
  type ProjectQuery,
  type ProjectSort,
} from "../../../content/projectFilters"
import { v2Panel } from "../../ui/v2Styles"

const selectClass =
  "min-h-[48px] w-full rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] px-3 text-sm text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"

type ProjectsArchiveProps = {
  engineeringOnly?: boolean
}

const labelize = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const ProjectsArchive: React.FC<ProjectsArchiveProps> = ({
  engineeringOnly = false,
}) => {
  const source = useMemo(
    () => (engineeringOnly ? engineeringProjects() : allNormalizedProjects()),
    [engineeringOnly]
  )
  const options = useMemo(() => projectFilterOptions(source), [source])
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => {
    const parsed = parseProjectQuery(searchParams.toString())
    return engineeringOnly ? { ...parsed, engineering: true } : parsed
  }, [engineeringOnly, searchParams])
  const result = useMemo(
    () => applyProjectQuery(source, query),
    [source, query]
  )

  const updateQuery = (patch: Partial<ProjectQuery>) => {
    const next: ProjectQuery = {
      ...query,
      ...patch,
      page: patch.page ?? 1,
    }
    const serialized = serializeProjectQuery(
      next,
      engineeringOnly ? ["engineering"] : []
    )
    setSearchParams(serialized, { replace: true })
  }

  const rangeStart = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1
  const rangeEnd = Math.min(result.page * result.pageSize, result.total)
  const liveMessage =
    result.total === 0
      ? "No projects match the current filters."
      : `Showing ${rangeStart} to ${rangeEnd} of ${result.total} projects.`

  return (
    <section className="container mx-auto max-w-6xl px-6 pb-20" id="projects">
      <form
        className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filter projects"
      >
        <label className="xl:col-span-2">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Search
          </span>
          <input
            type="search"
            value={query.q}
            onChange={(event) => updateQuery({ q: event.target.value, page: 1 })}
            placeholder="Title, stack, or domain"
            className={selectClass}
          />
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Ownership
          </span>
          <select
            value={query.ownership}
            onChange={(event) =>
              updateQuery({ ownership: event.target.value, page: 1 })
            }
            className={selectClass}
          >
            <option value="">All ownership</option>
            {options.ownership.map((value) => (
              <option key={value} value={value}>
                {labelize(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Domain
          </span>
          <select
            value={query.domain}
            onChange={(event) =>
              updateQuery({ domain: event.target.value, page: 1 })
            }
            className={selectClass}
          >
            <option value="">All domains</option>
            {options.domain.map((value) => (
              <option key={value} value={value}>
                {labelize(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Work type
          </span>
          <select
            value={query.workType}
            onChange={(event) =>
              updateQuery({ workType: event.target.value, page: 1 })
            }
            className={selectClass}
          >
            <option value="">All work types</option>
            {options.workType.map((value) => (
              <option key={value} value={value}>
                {labelize(value)}
              </option>
            ))}
          </select>
        </label>
        {engineeringOnly ? null : (
          <label>
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
              Source
            </span>
            <select
              value={query.source}
              onChange={(event) =>
                updateQuery({ source: event.target.value, page: 1 })
              }
              className={selectClass}
            >
              <option value="">All sources</option>
              {options.source.map((value) => (
                <option key={value} value={value}>
                  {labelize(value)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Sort
          </span>
          <select
            value={query.sort}
            onChange={(event) =>
              updateQuery({
                sort: event.target.value as ProjectSort,
                page: 1,
              })
            }
            className={selectClass}
          >
            <option value="featured">Featured first</option>
            <option value="title">Title</option>
            <option value="source">Source</option>
          </select>
        </label>
      </form>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm text-[var(--v2-muted)]" aria-live="polite">
          {liveMessage}
        </p>
        <label className="flex items-center gap-2 text-sm text-[var(--v2-muted)]">
          Per page
          <select
            value={query.pageSize}
            onChange={(event) =>
              updateQuery({
                pageSize: Number(event.target.value) as ProjectQuery["pageSize"],
                page: 1,
              })
            }
            className="min-h-[40px] rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel)] px-2 text-[var(--v2-text)]"
          >
            {PROJECT_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {result.items.length === 0 ? (
        <p className={`${v2Panel} p-8 text-center text-[var(--v2-muted)]`}>
          No projects match these filters. The full archive stays in the dataset.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((project) => (
            <li key={`${project.source}-${project.id}`}>
              <Link
                to={`/projects/${project.slug}`}
                className={`${v2Panel} flex h-full flex-col p-6 transition-colors hover:border-[var(--v2-acid)]/40`}
              >
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                  {labelize(project.ownership)} · {labelize(project.workType)}
                </p>
                <h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--v2-text)]">
                  {project.title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--v2-muted)]">
                  {publicProjectDescription(project)}
                </p>
                <p className="mt-4 font-mono text-[11px] text-[var(--v2-soft)]">
                  {labelize(project.domain)} · {labelize(project.source)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {result.totalPages > 1 ? (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="Project pagination"
        >
          <button
            type="button"
            className="min-h-[44px] rounded-full border border-[var(--v2-line)] px-4 font-bold text-[var(--v2-text)] disabled:opacity-40"
            onClick={() => updateQuery({ page: result.page - 1 })}
            disabled={result.page <= 1}
          >
            Previous
          </button>
          <p className="m-0 px-3 text-sm text-[var(--v2-muted)]">
            Page {result.page} of {result.totalPages}
          </p>
          <button
            type="button"
            className="min-h-[44px] rounded-full border border-[var(--v2-line)] px-4 font-bold text-[var(--v2-text)] disabled:opacity-40"
            onClick={() => updateQuery({ page: result.page + 1 })}
            disabled={result.page >= result.totalPages}
          >
            Next
          </button>
        </nav>
      ) : null}
    </section>
  )
}

export default ProjectsArchive
