import { render, screen } from "@testing-library/react"
import Hero from "./Hero"
import { ThemeProvider } from "../context/ThemeContext"

describe("Hero CTA accessibility", () => {
  it("matches CTA labels with their destination anchors", () => {
    render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    )

    const startProjectCta = screen.getByLabelText(
      "Start a Project - jump to contact form"
    )
    const viewWorkCta = screen.getByLabelText(
      "View My Work - jump to portfolio projects"
    )

    expect(startProjectCta).toHaveAttribute("href", "#contact")
    expect(viewWorkCta).toHaveAttribute("href", "#projects")
  })
})
