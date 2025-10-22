import React, { useState, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import { useCertificatesData } from "../hooks/useCertificatesData"
import { CertificateStatsComponent } from "./certificates/CertificateStats"
import { CertificateCard } from "./certificates/CertificateCard"
import { TopIssuers, CertificationTimeline } from "./certificates/TopIssuers"
import { GraduationCap, Filter, Grid, List } from "lucide-react"

const ModernCertificates: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const { certificates, stats, categories } = useCertificatesData()

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const filteredCertificates =
    selectedCategory === "all"
      ? certificates
      : certificates.filter((cert) => cert.category === selectedCategory)

  const handleToggleExpanded = useCallback((certificateId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(certificateId)) {
        newSet.delete(certificateId)
      } else {
        newSet.add(certificateId)
      }
      return newSet
    })
  }, [])

  // Performance monitoring removed - usePerformanceMonitor hook handles it

  return (
    <section
      ref={targetRef}
      id="certificates"
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <span className="text-blue-500 font-semibold">
              Certifications & Learning
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Continuous{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Learning
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {stats.total} professional certifications across {categories.length}{" "}
            categories, representing my commitment to staying current with
            technology trends.
          </p>
        </div>

        <CertificateStatsComponent stats={stats} isDark={isDark} />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Filter
              className={`w-5 h-5 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            />
            <span
              className={`font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                isDark
                  ? "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  : "bg-white/70 text-slate-700 border border-slate-200"
              }`}
            >
              <option value="all">
                All Categories ({certificates.length})
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category} ({stats.byCategory[category]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? isDark
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDark
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  : "bg-white/70 text-slate-700 hover:bg-white border border-slate-200"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? isDark
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDark
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  : "bg-white/70 text-slate-700 hover:bg-white border border-slate-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className={`mb-16 ${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-6"
          }`}
        >
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              isDark={isDark}
              isExpanded={expandedCards.has(certificate.id)}
              onToggleExpanded={() => handleToggleExpanded(certificate.id)}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <TopIssuers stats={stats} isDark={isDark} />
          <CertificationTimeline stats={stats} isDark={isDark} />
        </div>
      </div>
    </section>
  )
}

export default ModernCertificates
