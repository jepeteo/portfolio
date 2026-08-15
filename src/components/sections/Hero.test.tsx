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
    const engineeringCta = screen.getByRole("link", {
      name: /explore my engineering portfolio/i,
    })

    expect(requestCta).toHaveAttribute("href", "/services")
    expect(engineeringCta).toHaveAttribute("href", "/engineering")
    expect(
      screen.queryByRole("link", { name: /^contact$/i })
    ).not.toBeInTheDocument()
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
