import {
  schemaReactProjects,
  schemaWordPressProjects,
  portfolioStats,
} from "../content/projects"

export const usePortfolioSchema = () => ({
  portfolioProjects: schemaWordPressProjects,
  reactProjects: schemaReactProjects,
  portfolioStats,
})
