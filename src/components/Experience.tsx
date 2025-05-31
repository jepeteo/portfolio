import React, { memo, useMemo } from "react"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import jobExperience from "../assets/jobExperience.json"

interface Job {
  title: string
  company: string
  location?: string
  from: string
  to: string | null
  description: string
}

const Experience: React.FC = memo(() => {
  const { targetRef: ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  // Validate and type-safe the data
  const validJobs = useMemo(() => {
    return jobExperience.filter((job: any): job is Job => {
      return job.title && job.company && job.from && job.description
    })
  }, [])

  if (validJobs.length === 0) {
    return (
      <section
        className="container py-20"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="text-center">
          <h2
            id="experience-title"
            className="text-4xl md:text-6xl font-display font-bold mb-4 text-primary-foreground bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent"
          >
            Experience
          </h2>
          <div className="py-12">
            <p className="text-xl text-muted-foreground font-body">
              No experience data available
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className={`container py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="text-center mb-16">
        <h2
          id="experience-title"
          className="text-4xl md:text-6xl font-display font-bold mb-4 text-primary-foreground bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent"
        >
          Professional Experience
        </h2>
        <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
          A journey through my professional growth and the impact I've made
          across different organizations
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-accent-500 to-secondary-500 rounded-full hidden md:block opacity-30" />

        <div className="space-y-12">
          {validJobs.map((job, index) => (
            <article
              key={`${job.company}-${job.from}-${index}`}
              className={`group relative glass rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                index % 2 === 0
                  ? "animate-fade-in-left"
                  : "animate-fade-in-right"
              }`}
              role="article"
              aria-labelledby={`job-title-${index}`}
            >
              {/* Gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Timeline dot */}
              <div className="absolute left-6 top-8 w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full border-4 border-background shadow-lg hidden md:block transform group-hover:scale-110 transition-transform duration-300" />

              <div className="relative p-8 md:p-12 md:pl-20">
                <header className="mb-6">
                  <h3
                    id={`job-title-${index}`}
                    className="text-2xl md:text-3xl font-display font-bold text-primary-foreground group-hover:text-primary-600 transition-colors duration-300 mb-2"
                  >
                    {job.title}
                  </h3>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-xl font-semibold text-accent-600 dark:text-accent-400">
                        {job.company}
                      </p>
                      {job.location && (
                        <span className="text-muted-foreground text-lg flex items-center">
                          <span className="hidden sm:inline mx-2">•</span>
                          📍 {job.location}
                        </span>
                      )}
                    </div>
                    <time className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 dark:from-primary-900/30 dark:to-accent-900/30 dark:text-primary-300">
                      {job.from} - {job.to || "Present"}
                    </time>
                  </div>
                </header>

                <p className="text-lg leading-relaxed text-muted-foreground font-body">
                  {job.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
})

Experience.displayName = "Experience"

Experience.displayName = "Experience"

export default Experience
