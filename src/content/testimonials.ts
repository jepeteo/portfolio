export type Testimonial = {
  id: string
  quote: string
  author: string
  role?: string
  company?: string
  sourceUrl?: string
  featured?: boolean
}

/**
 * Production must not render placeholder quotes.
 * Add a real testimonial object here when one exists.
 */
export const testimonials: Testimonial[] = []

export const hasTestimonials = () => testimonials.length > 0
