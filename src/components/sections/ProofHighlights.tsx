import React from "react"
import { useTheme } from "../context/ThemeContext"

const proofItems = [
  { label: "Years of experience", value: "18+" },
  { label: "Projects delivered", value: "100+" },
  { label: "Client focus", value: "WordPress, React, Infra" },
]

const ProofHighlights: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <section id="proof" className={isDark ? "bg-slate-900 py-16" : "bg-white py-16"}>
      <div className="container px-6">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${isDark ? "text-white" : "text-slate-900"}`}>
          Proof You Can Trust
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {proofItems.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl p-6 border ${
                isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <p className="text-2xl font-bold text-blue-500 mb-2">{item.value}</p>
              <p className={isDark ? "text-slate-300" : "text-slate-600"}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProofHighlights
