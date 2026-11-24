import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Hero from "./Hero"
import { ThemeProvider } from "../../context/ThemeContext"

describe("Hero CTA accessibility", () => {
  it("exposes the primary and secondary CTAs with correct destinations", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </ThemeProvider>
    )

    const requestCta = screen.getByRole("link", {
      name: /i need help with a website/i,
    })
    const projectsCta = screen.getByRole("link", {
      name: /see selected projects/i,
    })

    expect(requestCta).toHaveAttribute("href", "/contact")
    expect(projectsCta).toHaveAttribute("href", "/projects")
    expect(screen.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
      "href",
      "/contact"
    )
    expect(
      screen.getByRole("link", { name: /emergency help/i })
    ).toHaveAttribute("href", "/services/emergency-website-help")
  })

  it("renders a single H1", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </ThemeProvider>
    )

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  })
})
