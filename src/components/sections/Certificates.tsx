import React, { useMemo, useState, memo, useCallback } from "react"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import { ModernCertificate } from "../../types"
import { validateCertificate } from "../../utils/validation"
import Loading from "../system/loading/Loading"
import SectionShell from "../ui/SectionShell"
import myCertificates from "../../assets/myCertificates.json"
import {
  Award,
  Calendar,
  ExternalLink,
  Filter,
  GraduationCap,
  Users,
  Code,
  Shield,
  Zap,
  Database,
  Globe,
  Server,
  Smartphone,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
} from "lucide-react"

// Schema.org structured data for certificates
const generateCertificatesSchema = (certificates: ModernCertificate[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://www.theodorosmentis.com/#certificates",
    name: "Professional Certifications & Credentials",
    description:
      "Educational and professional certifications earned by Theodoros Mentis",
    numberOfItems: certificates.length,
    itemListElement: certificates.map((certificate, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        "@id": `https://www.theodorosmentis.com/#certificate-${certificate.id}`,
        name: certificate.name,
        description: certificate.description,
        dateCreated: certificate.issueDate,
        url: certificate.credentialUrl,
        credentialCategory: mapCategoryToCredentialCategory(
          certificate.category || "Technology"
        ),
        educationalLevel: "Professional Development",
        competencyRequired: certificate.skills,
        recognizedBy: {
          "@type": "Organization",
          name: certificate.issuer,
          url: getIssuerUrl(certificate.issuer),
        },
        about: certificate.skills?.map((skill: string) => ({
          "@type": "DefinedTerm",
          name: skill,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: certificate.category,
          },
        })),
        credentialSubject: {
          "@type": "Person",
          "@id": "https://www.theodorosmentis.com/#person",
          name: "Theodoros Mentis",
          hasCredential: certificate.name,
        },
      },
    })),
  }
}

// Individual certificate schema component
const CertificateSchema: React.FC<{ certificate: ModernCertificate }> = ({
  certificate,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "@id": `https://www.theodorosmentis.com/#credential-${certificate.id}`,
    name: certificate.name,
    description: certificate.description,
    dateCreated: certificate.issueDate,
    url: certificate.credentialUrl,
    credentialCategory: mapCategoryToCredentialCategory(
      certificate.category || "Technology"
    ),
    educationalLevel: "Professional Development",
    competencyRequired: certificate.skills,
    recognizedBy: {
      "@type": "Organization",
      name: certificate.issuer,
      url: getIssuerUrl(certificate.issuer),
    },
    teaches: certificate.skills?.map((skill: string) => ({
      "@type": "DefinedTerm",
      name: skill,
    })),
    credentialSubject: {
      "@type": "Person",
      "@id": "https://www.theodorosmentis.com/#person",
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
    },
    isPartOf: {
      "@type": "CreativeWork",
      "@id": "https://www.theodorosmentis.com/#portfolio",
      name: "Theodoros Mentis Professional Portfolio",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  )
}

// Helper functions
const mapCategoryToCredentialCategory = (category: string): string => {
  const mapping: Record<string, string> = {
    "AI & Machine Learning": "Technology",
    "Frontend Development": "Technology",
    "Backend Development": "Technology",
    "Programming Fundamentals": "Technology",
    "Digital Marketing": "Marketing",
    "Security & Compliance": "Security",
    "CMS Development": "Technology",
    "DevOps & Infrastructure": "Technology",
    "Database Management": "Technology",
    "Performance & Optimization": "Technology",
    "E-commerce": "Business",
    "Productivity Tools": "Technology",
  }
  return mapping[category] || "Technology"
}

const getIssuerUrl = (issuer: string): string => {
  const mapping: Record<string, string> = {
    "LinkedIn Learning": "https://www.linkedin.com/learning/",
    Coursera: "https://www.coursera.org/",
    Udemy: "https://www.udemy.com/",
    Microsoft: "https://docs.microsoft.com/en-us/learn/",
    Google: "https://developers.google.com/training/",
    "Amazon Web Services": "https://aws.amazon.com/training/",
  }
  return (
    mapping[issuer] ||
    `https://www.${issuer.toLowerCase().replace(/\s+/g, "")}.com/`
  )
}

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "AI & Machine Learning": Zap,
  "Frontend Development": Code,
  "Backend Development": Server,
  "Programming Fundamentals": GraduationCap,
  "Digital Marketing": TrendingUp,
  "Security & Compliance": Shield,
  "CMS Development": Globe,
  "DevOps & Infrastructure": Settings,
  "Database Management": Database,
  "Performance & Optimization": Zap,
  "E-commerce": Smartphone,
  "Productivity Tools": Settings,
}

interface ExpandedSkills {
  [certificateId: string]: boolean
}

const Certificates: React.FC = memo(() => {
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [isLoading, setIsLoading] = useState(false)

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)

  const [expandedSkills, setExpandedSkills] = useState<ExpandedSkills>({})

  const { categories, certsByCategory, validCertificates } = useMemo(() => {
    const validCerts = myCertificates
      .filter((cert: ModernCertificate) => validateCertificate(cert))
      .map((cert: ModernCertificate) => cert)

    const grouped = validCerts.reduce(
      (
        acc: { [key: string]: ModernCertificate[] },
        cert: ModernCertificate
      ) => {
        const category = cert.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(cert)
        return acc
      },
      {}
    )

    const sortedCategories = Object.keys(grouped).sort()

    return {
      categories: sortedCategories,
      certsByCategory: grouped,
      validCertificates: validCerts,
    }
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return categories.length > 0 ? categories[0] : "All"
  })

  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  const handleCategoryChange = useCallback((category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)

    setTimeout(() => setIsLoading(false), 150)
  }, [])

  const toggleSummaryExpansion = useCallback(() => {
    setIsSummaryExpanded((prev) => !prev)
  }, [])

  const toggleSkillsExpansion = useCallback((certificateId: string) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [certificateId]: !prev[certificateId],
    }))
  }, [])

  const displayedCertificates = useMemo(() => {
    if (selectedCategory === "All") {
      return validCertificates
    }
    return certsByCategory[selectedCategory] || []
  }, [selectedCategory, validCertificates, certsByCategory])

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || Award
    return IconComponent
  }

  const INITIAL_CATEGORIES_DISPLAY = 5
  const hasMoreCategories = categories.length > INITIAL_CATEGORIES_DISPLAY
  const visibleCategories = isSummaryExpanded
    ? categories
    : categories.slice(0, INITIAL_CATEGORIES_DISPLAY)
  const hiddenCategoriesCount = categories.length - INITIAL_CATEGORIES_DISPLAY

  const INITIAL_SKILLS_DISPLAY = 3

  if (validCertificates.length === 0) {
    return (
      <SectionShell id="certificates" title="Certifications" variant="default">
        <p className="text-center text-xl text-[var(--v2-muted)]">
          No certificates data available
        </p>
      </SectionShell>
    )
  }

  return (
    <>
      {/* SEO Schema for Certificates */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateCertificatesSchema(validCertificates),
            null,
            2
          ),
        }}
      />

      <SectionShell
        ref={targetRef}
        id="certificates"
        variant="default"
        eyebrow="Professional Development"
        title="Skills I've Unlocked"
        subtitle="Professional certifications showcasing expertise across various technologies and methodologies"
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-2 text-[var(--v2-muted)]">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter by category:</span>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] ${
                  selectedCategory === "All"
                    ? "border-2 border-[var(--v2-acid)] bg-[var(--v2-acid)]/15 text-[var(--v2-acid)]"
                    : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                }`}
                aria-pressed={selectedCategory === "All"}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  All ({validCertificates.length})
                </span>
              </button>

              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category)
                const count = certsByCategory[category]?.length || 0

                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] ${
                      selectedCategory === category
                        ? "border-2 border-[var(--v2-acid)] bg-[var(--v2-acid)]/15 text-[var(--v2-acid)]"
                        : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                    }`}
                    aria-pressed={selectedCategory === category}
                  >
                    <span className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {category} ({count})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : (
            <>
              <div className="mb-8 text-center text-[var(--v2-muted)]">
                <p>
                  Showing{" "}
                  <span className="font-bold text-[var(--v2-acid)]">
                    {displayedCertificates.length}
                  </span>{" "}
                  certificate{displayedCertificates.length !== 1 ? "s" : ""}{" "}
                  {selectedCategory !== "All" && (
                    <>
                      in{" "}
                      <span className="font-medium text-[var(--v2-acid)]">
                        {selectedCategory}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCertificates.map((certificate, index) => {
                  const IconComponent = getCategoryIcon(
                    certificate.category || "Uncategorized"
                  )

                  const isSkillsExpanded =
                    expandedSkills[certificate.id] || false
                  const hasMoreSkills =
                    certificate.skills &&
                    certificate.skills.length > INITIAL_SKILLS_DISPLAY
                  const visibleSkills = isSkillsExpanded
                    ? certificate.skills
                    : certificate.skills?.slice(0, INITIAL_SKILLS_DISPLAY)
                  const hiddenSkillsCount = certificate.skills
                    ? certificate.skills.length - INITIAL_SKILLS_DISPLAY
                    : 0

                  return (
                    <React.Fragment key={certificate.id}>
                      <CertificateSchema certificate={certificate} />
                      <div
                        className="group relative overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--v2-acid)]/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]">
                              <IconComponent className="w-6 h-6" />
                            </div>

                            {certificate.category && (
                              <span className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--v2-muted)]">
                                {certificate.category}
                              </span>
                            )}
                          </div>

                          <h3 className="mb-2 line-clamp-2 text-lg font-bold tracking-tight text-[var(--v2-text)] transition-colors group-hover:text-[var(--v2-acid)]">
                            {certificate.name}
                          </h3>

                          <p className="mb-3 text-sm font-medium text-[var(--v2-brand)]">
                            {certificate.issuer}
                          </p>

                          {certificate.description && (
                            <p className="mb-4 line-clamp-3 text-sm text-[var(--v2-muted)]">
                              {certificate.description}
                            </p>
                          )}

                          {certificate.skills &&
                            certificate.skills.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {visibleSkills?.map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-2 py-1 text-xs font-medium text-[var(--v2-muted)]"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>

                                {hasMoreSkills && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleSkillsExpansion(certificate.id)
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-2 py-1 text-xs font-medium text-[var(--v2-muted)] transition-colors hover:border-[var(--v2-acid)]/40"
                                  >
                                    {isSkillsExpanded ? (
                                      <>
                                        <Minus className="w-3 h-3" />
                                        Show Less
                                        <ChevronUp className="w-3 h-3" />
                                      </>
                                    ) : (
                                      <div className="w-8 flex items-center justify-center gap-1">
                                        <Plus className="w-3 h-3" />
                                        {hiddenSkillsCount}
                                      </div>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--v2-muted)]">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(
                                  certificate.issueDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            {certificate.credentialUrl && (
                              <a
                                href={certificate.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-3 py-1 text-sm font-medium text-[var(--v2-text)] transition-colors hover:border-[var(--v2-acid)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>

              <div className="mt-16">
                <div className="rounded-[2rem] border border-[var(--v2-line-strong)] bg-[radial-gradient(circle_at_15%_20%,rgb(from_var(--v2-brand)_r_g_b/0.16),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(from_var(--v2-acid)_r_g_b/0.12),transparent_44%),var(--v2-panel)] p-8 text-center">
                  <GraduationCap className="mx-auto mb-4 h-12 w-12 text-[var(--v2-acid)]" />
                  <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
                    Continuous learning journey
                  </h3>
                  <p className="mb-6 text-lg text-[var(--v2-muted)]">
                    {validCertificates.length} certifications across{" "}
                    {categories.length} technology domains, representing ongoing
                    commitment to professional excellence
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {visibleCategories.map((category) => {
                      const IconComponent = getCategoryIcon(category)
                      return (
                        <div
                          key={category}
                          className="flex items-center gap-2 rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-3 py-2 text-sm font-medium text-[var(--v2-muted)]"
                        >
                          <IconComponent className="w-4 h-4" />
                          {category}
                        </div>
                      )
                    })}
                  </div>

                  {hasMoreCategories && (
                    <button
                      onClick={toggleSummaryExpansion}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-3 py-2 text-sm font-medium text-[var(--v2-text)] transition-colors hover:border-[var(--v2-acid)]/40"
                    >
                      {isSummaryExpanded ? (
                        <>
                          <Minus className="w-4 h-4" />
                          Show Less Categories
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          {hiddenCategoriesCount} more categories
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
      </SectionShell>
    </>
  )
})

Certificates.displayName = "Certificates"
export default Certificates
