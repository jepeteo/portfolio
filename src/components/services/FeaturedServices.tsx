import React from "react"
import { featuredServices } from "../../content/services"
import ServiceCard from "./ServiceCard"
import V2SectionHead from "../ui/V2SectionHead"

const FeaturedServices: React.FC = () => {
  return (
    <section aria-labelledby="featured-services-heading">
      <V2SectionHead
        titleId="featured-services-heading"
        label="Featured"
        title="High-demand services I deliver regularly."
        copy="Practical, well-scoped work for businesses and agencies — each with a clear starting price."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredServices.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedServices
