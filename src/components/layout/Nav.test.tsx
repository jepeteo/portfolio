import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Nav from "./Nav"
import { ThemeProvider } from "../../context/ThemeContext"
import { navLinks } from "../../config/navigation"

describe("Nav", () => {
  it("renders core navigation as real links in the confirmed order", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Nav />
        </ThemeProvider>
      </MemoryRouter>
    )

    for (const link of navLinks) {
      expect(
        screen.getByRole("link", { name: link.ariaLabel })
      ).toHaveAttribute("href", link.href)
    }

    expect(
      screen.getByRole("link", { name: /navigate to engineering page/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /navigate to certifications page/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /navigate to skills section/i })
    ).not.toBeInTheDocument()
  })
})
