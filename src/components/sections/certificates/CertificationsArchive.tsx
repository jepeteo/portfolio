import React, { useMemo } from "react"
import { ExternalLink } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useCertificatesData } from "../../../hooks/useCertificatesData"
import {
  applyCertificateQuery,
  certificateFilterOptions,
  CERT_PAGE_SIZES,
  parseCertificateQuery,
  serializeCertificateQuery,
  type CertificateQuery,
  type CertificateSort,
} from "../../../content/certificateFilters"
import { normalizeCertificates } from "../../../content/certificateModel"
import { CertificateStatsComponent } from "./CertificateStats"
import { v2Panel } from "../../ui/v2Styles"

const selectClass =
  "min-h-[48px] w-full rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] px-3 text-sm text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"

const CertificationsArchive: React.FC = () => {
  const { stats } = useCertificatesData()
  const certificates = useMemo(() => normalizeCertificates(), [])
  const options = useMemo(
    () => certificateFilterOptions(certificates),
    [certificates]
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(
    () => parseCertificateQuery(searchParams.toString()),
    [searchParams]
  )
  const result = useMemo(
    () => applyCertificateQuery(certificates, query),
    [certificates, query]
  )

  const updateQuery = (patch: Partial<CertificateQuery>) => {
    const next: CertificateQuery = {
      ...query,
      ...patch,
      page: patch.page ?? 1,
    }
    const serialized = serializeCertificateQuery(next)
    setSearchParams(serialized, { replace: true })
  }

  const rangeStart = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1
  const rangeEnd = Math.min(result.page * result.pageSize, result.total)
  const liveMessage =
    result.total === 0
      ? "No certificates match the current filters."
      : `Showing ${rangeStart} to ${rangeEnd} of ${result.total} certificates.`

  return (
    <section className="container mx-auto max-w-6xl px-6 pb-20" id="certificates">
      <CertificateStatsComponent stats={stats} isDark />

      <form
        className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filter certifications"
      >
        <label className="xl:col-span-2">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Search
          </span>
          <input
            type="search"
            value={query.q}
            onChange={(event) => updateQuery({ q: event.target.value, page: 1 })}
            placeholder="Title, issuer, or skill"
            className={selectClass}
          />
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Category
          </span>
          <select
            value={query.category}
            onChange={(event) =>
              updateQuery({ category: event.target.value, page: 1 })
            }
            className={selectClass}
          >
            <option value="">All categories</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Issuer
          </span>
          <select
            value={query.issuer}
            onChange={(event) =>
              updateQuery({ issuer: event.target.value, page: 1 })
            }
            className={selectClass}
          >
            <option value="">All issuers</option>
            {options.issuers.map((issuer) => (
              <option key={issuer} value={issuer}>
                {issuer}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Year
          </span>
          <select
            value={query.year}
            onChange={(event) => updateQuery({ year: event.target.value, page: 1 })}
            className={selectClass}
          >
            <option value="">All years</option>
            {options.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
            Sort
          </span>
          <select
            value={query.sort}
            onChange={(event) =>
              updateQuery({
                sort: event.target.value as CertificateSort,
                page: 1,
              })
            }
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="issuer">Issuer</option>
            <option value="title">Title</option>
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
                pageSize: Number(event.target.value) as CertificateQuery["pageSize"],
                page: 1,
              })
            }
            className="min-h-[40px] rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel)] px-2 text-[var(--v2-text)]"
          >
            {CERT_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {result.items.length === 0 ? (
        <p className={`${v2Panel} p-8 text-center text-[var(--v2-muted)]`}>
          No certificates match these filters. Clear a filter to see more of the
          archive. Every credential stays in the dataset.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((cert) => (
            <li key={cert.id} className={`${v2Panel} flex h-full flex-col p-6`}>
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                {cert.year} · {cert.category}
              </p>
              <h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--v2-text)]">
                {cert.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--v2-brand)]">
                {cert.issuer}
              </p>
              {cert.description ? (
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-[var(--v2-muted)]">
                  {cert.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              {cert.skills.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-1">
                  {cert.skills.slice(0, 4).map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)] px-2 py-1 text-xs text-[var(--v2-muted)]"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : null}
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--v2-acid)]"
                >
                  Verify credential
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {result.totalPages > 1 ? (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="Certificate pagination"
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

export default CertificationsArchive
