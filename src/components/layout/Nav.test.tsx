import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Nav from "./Nav"
import { ThemeProvider } from "../../context/ThemeContext"
import { navLinks } from "../../config/navigation"

describe("Nav", () => {
  it("renders the core navigation links in scroll order", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Nav />
        </ThemeProvider>
      </MemoryRouter>
    )

    for (const link of navLinks) {
      expect(
        screen.getByRole("button", { name: link.ariaLabel })
      ).toBeInTheDocument()
    }

    expect(
      screen.getByRole("button", { name: /navigate to skills section/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /navigate to projects section/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /navigate to experience section/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /navigate to services page/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /web projects/i })
    ).not.toBeInTheDocument()
  })
})
