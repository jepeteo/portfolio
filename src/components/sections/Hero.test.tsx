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
      name: /request a fix or quote/i,
    })
    const servicesCta = screen.getByRole("link", { name: /browse services/i })

    expect(requestCta).toHaveAttribute("href", "#contact")
    expect(servicesCta).toHaveAttribute("href", "/services")
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
