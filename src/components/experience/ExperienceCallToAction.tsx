import React from "react"
import { Mail, Download } from "lucide-react"

interface ExperienceCallToActionProps {
  isDark: boolean
}

export const ExperienceCallToAction: React.FC<ExperienceCallToActionProps> = ({
  isDark,
}) => {
  return (
    <div
      className={`rounded-2xl p-8 text-center ${
        isDark
          ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
          : "bg-gradient-to-br from-slate-50/50 to-white/50 border border-slate-200/50"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Let's Work Together
      </h3>

      <p
        className={`text-lg mb-8 max-w-2xl mx-auto ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        Ready to bring your project to life? Let's discuss how my experience can
        help you achieve your goals.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#contact"
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
            isDark
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          } shadow-lg`}
        >
          <Mail className="w-5 h-5" />
          Get In Touch
        </a>

        <a
          href="/cv/Theodoros-Mentis-CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
            isDark
              ? "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500"
              : "bg-white/70 text-slate-700 border border-slate-300/50 hover:bg-white hover:border-slate-400"
          } shadow-lg`}
        >
          <Download className="w-5 h-5" />
          Download CV
        </a>
      </div>
    </div>
  )
}
