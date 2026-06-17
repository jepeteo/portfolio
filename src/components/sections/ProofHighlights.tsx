import React from "react"
import { useTheme } from "../../context/ThemeContext"
import SectionShell from "../ui/SectionShell"

const proofItems = [
  { label: "Years of experience", value: "18+" },
  { label: "Projects delivered", value: "100+" },
  { label: "Client focus", value: "WordPress, React, Infra" },
]

const ProofHighlights: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <SectionShell
      id="proof"
      title="Proof You Can Trust"
      variant="default"
    >
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
    </SectionShell>
  )
}

export default ProofHighlights
