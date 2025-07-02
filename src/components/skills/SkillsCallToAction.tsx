import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { Heart, ArrowRight } from "lucide-react"

interface SkillsCallToActionProps {
  onScrollToProjects: () => void
  onScrollToContact: () => void
}

const SkillsCallToAction: React.FC<SkillsCallToActionProps> = ({
  onScrollToProjects,
  onScrollToContact,
}) => {
  const { isDark } = useTheme()

  return (
    <div className="mt-16">
      <div
        className={`p-8 rounded-2xl backdrop-blur-sm border text-center relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50"
            : "bg-gradient-to-br from-white/40 to-slate-50/40 border-slate-200/50"
        }`}
      >
        <div className="relative z-10">
          <h3
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Let's Create Something Amazing Together
          </h3>
          <p
            className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            These technologies are more than just tools to me—they're the way I
            bring ideas to life. I'd love to use them to help you build
            something incredible.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onScrollToProjects}
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-violet-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              View My Projects
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onScrollToContact}
              className={`px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                isDark
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              Start a Conversation
            </button>
          </div>
        </div>

        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-violet-500" />
          <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-purple-500" />
        </div>
      </div>
    </div>
  )
}

export default SkillsCallToAction
