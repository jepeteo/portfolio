import { render, screen } from "@testing-library/react"
import ModernNav from "./ModernNav"
import { ThemeProvider } from "../../context/ThemeContext"

describe("ModernNav", () => {
  it("renders the core navigation links", () => {
    render(
      <ThemeProvider>
        <ModernNav />
      </ThemeProvider>
    )

    expect(
      screen.getByRole("button", { name: /navigate to home section/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: /navigate to client projects section/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: /navigate to featured web projects section/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /navigate to experience section/i })
    ).toBeInTheDocument()
  })
})
