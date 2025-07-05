import React from "react"
import { LucideIcon } from "lucide-react"

interface CategoryHeaderProps {
  category: {
    title: string
    subtitle: string
    icon: LucideIcon
    gradient: string
    description: string
  }
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category }) => {
  return (
    <div
      className={`p-8 rounded-2xl mb-8 text-white relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${category.gradient
          .replace("from-", "")
          .replace(" via-", ", ")
          .replace(" to-", ", ")})`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <category.icon className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">{category.title}</h3>
            <p className="text-xl opacity-90">{category.subtitle}</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed opacity-80">
          {category.description}
        </p>
      </div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

export default CategoryHeader
