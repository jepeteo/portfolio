import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { featuredServices } from "../../content/services"
import ServiceCard from "./ServiceCard"

const FeaturedServices: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <section aria-labelledby="featured-services-heading">
      <h2
        id="featured-services-heading"
        className={`text-2xl md:text-3xl font-bold mb-3 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Featured Services
      </h2>
      <p
        className={`mb-8 max-w-2xl text-lg ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        Practical, high-demand services I deliver regularly for businesses and
        agencies.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredServices.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedServices
