

import { A11yChecker, ColorContrast } from "../utils/accessibilityOptimization"

export interface AccessibilityReport {
  score: number
  issues: {
    critical: string[]
    warning: string[]
    info: string[]
  }
  wcagCompliance: {
    level: "A" | "AA" | "AAA" | "FAIL"
    passed: number
    total: number
  }
  recommendations: string[]
}

export class AccessibilityTester {
  private static instance: AccessibilityTester
  private colorChecker = ColorContrast

  static getInstance(): AccessibilityTester {
    if (!AccessibilityTester.instance) {
      AccessibilityTester.instance = new AccessibilityTester()
    }
    return AccessibilityTester.instance
  }
  async runAudit(
    containerId?: string,
    options: {
      includeColorContrast?: boolean
      includeLighthouseMetrics?: boolean
      includeKeyboardTest?: boolean
    } = {}
  ): Promise<AccessibilityReport> {
    const {
      includeColorContrast = true,
      includeLighthouseMetrics = false,
      includeKeyboardTest = true,
    } = options

    const container = containerId
      ? document.getElementById(containerId)
      : document.body

    if (!container) {
      throw new Error(`Container ${containerId} not found`)
    }

    const issues = {
      critical: [] as string[],
      warning: [] as string[],
      info: [] as string[],
    }
    const basicChecks = A11yChecker.runAllChecks()
    issues.critical.push(...basicChecks.images)
    issues.warning.push(...basicChecks.headings)
    issues.warning.push(...basicChecks.keyboard)
    this.checkSemanticStructure(container, issues)
    this.checkARIAImplementation(container, issues)
    if (includeColorContrast) {
      await this.checkColorContrast(container, issues)
    }
    if (includeKeyboardTest) {
      this.checkKeyboardNavigation(container, issues)
    }
    this.checkFocusManagement(container, issues)
    this.checkScreenReaderCompatibility(container, issues)
    const totalIssues =
      issues.critical.length + issues.warning.length + issues.info.length
    const score = Math.max(
      0,
      100 -
        (issues.critical.length * 10 +
          issues.warning.length * 5 +
          issues.info.length * 2)
    )

    const wcagCompliance = this.calculateWCAGCompliance(issues)
    const recommendations = this.generateRecommendations(issues)

    return {
      score,
      issues,
      wcagCompliance,
      recommendations,
    }
  }

  private checkSemanticStructure(
    container: Element,
    issues: AccessibilityReport["issues"]
  ): void {
    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6")
    let previousLevel = 0

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1])

      if (index === 0 && level !== 1) {
        issues.critical.push("Page should start with h1 element")
      }

      if (level > previousLevel + 1) {
        issues.warning.push(
          `Heading level jumps from h${previousLevel} to h${level}`
        )
      }

      previousLevel = level
    })
    const landmarks = container.querySelectorAll(
      "main, nav, aside, section, article, header, footer"
    )
    if (landmarks.length === 0) {
      issues.warning.push("No landmark elements found for navigation")
    }
    const lists = container.querySelectorAll("ul, ol")
    lists.forEach((list) => {
      const listItems = list.querySelectorAll("li")
      if (listItems.length === 0) {
        issues.warning.push("Empty list element found")
      }
    })
  }

  private checkARIAImplementation(
    container: Element,
    issues: AccessibilityReport["issues"]
  ): void {
    const interactiveElements = container.querySelectorAll(
      "button, a, input, select, textarea, [role='button'], [role='link']"
    )

    interactiveElements.forEach((element, index) => {
      const hasLabel =
        element.hasAttribute("aria-label") ||
        element.hasAttribute("aria-labelledby") ||
        element.textContent?.trim() ||
        element.querySelector("img[alt]")

      if (!hasLabel) {
        issues.critical.push(
          `Interactive element ${index + 1} lacks accessible name`
        )
      }
    })
    const elementsWithRoles = container.querySelectorAll("[role]")
    elementsWithRoles.forEach((element) => {
      const role = element.getAttribute("role")
      const validRoles = [
        "button",
        "link",
        "navigation",
        "banner",
        "main",
        "complementary",
        "contentinfo",
        "search",
        "form",
        "region",
        "article",
        "section",
        "heading",
        "list",
        "listitem",
        "tab",
        "tabpanel",
        "tablist",
      ]

      if (role && !validRoles.includes(role)) {
        issues.warning.push(`Invalid ARIA role: ${role}`)
      }
    })
    const ariaElements = container.querySelectorAll(
      "[aria-expanded], [aria-hidden], [aria-current]"
    )
    ariaElements.forEach((element) => {
      const expanded = element.getAttribute("aria-expanded")
      if (expanded && !["true", "false"].includes(expanded)) {
        issues.warning.push("Invalid aria-expanded value")
      }
    })
  }

  private async checkColorContrast(
    container: Element,
    issues: AccessibilityReport["issues"]
  ): Promise<void> {
    const textElements = container.querySelectorAll(
      "p, span, div, h1, h2, h3, h4, h5, h6, a, button"
    )

    for (const element of textElements) {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor

      if (color && backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)") {
        try {
          const ratio = this.colorChecker.getContrastRatio(
            color,
            backgroundColor
          )
          const fontSize = parseFloat(styles.fontSize)
          const isLarge =
            fontSize >= 18 || (fontSize >= 14 && styles.fontWeight === "bold")

          if (
            !this.colorChecker.meetsWCAG(
              color,
              backgroundColor,
              "AA",
              isLarge ? "large" : "normal"
            )
          ) {
            issues.warning.push(
              `Low color contrast ratio (${ratio.toFixed(
                2
              )}:1) for text element`
            )
          }
        } catch (error) {
        }
      }
    }
  }

  private checkKeyboardNavigation(
    container: Element,
    issues: AccessibilityReport["issues"]
  ): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute("tabindex")

      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.warning.push(
          `Element ${
            index + 1
          } has positive tabindex which can disrupt tab order`
        )
      }
    })
    const skipLinks = container.querySelectorAll("a[href^='#']")
    if (skipLinks.length === 0) {
      issues.info.push("Consider adding skip links for keyboard navigation")
    }
  }

  private checkFocusManagement(
    container: Element,
    issues: AccessibilityReport["issues"]
  ): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    focusableElements.forEach((element) => {
      const styles = window.getComputedStyle(element)

      if (styles.outline === "none" && !element.classList.contains("focus:")) {
        issues.warning.push("Interactive element lacks visible focus indicator")
      }
    })
  }

  private checkScreenReaderCompatibility(
    container: Element,
    issues: AccessibilityReport["issues"]
  ): void {
    const srOnlyElements = container.querySelectorAll(
      ".sr-only, .visually-hidden"
    )
    if (srOnlyElements.length === 0) {
      issues.info.push("Consider adding screen reader only content for context")
    }
    const liveRegions = container.querySelectorAll("[aria-live]")
    liveRegions.forEach((element) => {
      const politeness = element.getAttribute("aria-live")
      if (!["polite", "assertive", "off"].includes(politeness || "")) {
        issues.warning.push("Invalid aria-live value")
      }
    })
  }

  private calculateWCAGCompliance(
    issues: AccessibilityReport["issues"]
  ): AccessibilityReport["wcagCompliance"] {
    const criticalCount = issues.critical.length
    const warningCount = issues.warning.length

    if (criticalCount > 0) {
      return { level: "FAIL", passed: 0, total: 100 }
    }

    if (warningCount === 0) {
      return { level: "AAA", passed: 100, total: 100 }
    }

    if (warningCount <= 2) {
      return { level: "AA", passed: 95, total: 100 }
    }

    return { level: "A", passed: 80, total: 100 }
  }

  private generateRecommendations(
    issues: AccessibilityReport["issues"]
  ): string[] {
    const recommendations: string[] = []

    if (issues.critical.length > 0) {
      recommendations.push(
        "🚨 Address critical accessibility issues immediately"
      )
      recommendations.push(
        "🔍 Ensure all interactive elements have accessible names"
      )
      recommendations.push("📝 Add proper alt text to all images")
    }

    if (issues.warning.length > 0) {
      recommendations.push(
        "⚠️ Fix color contrast issues for better readability"
      )
      recommendations.push("🎯 Improve heading hierarchy structure")
      recommendations.push("⌨️ Enhance keyboard navigation support")
    }

    if (issues.info.length > 0) {
      recommendations.push(
        "💡 Consider adding skip links for better navigation"
      )
      recommendations.push(
        "🔊 Add screen reader announcements for dynamic content"
      )
      recommendations.push("🎨 Implement high contrast mode support")
    }
    recommendations.push(
      "🧪 Test with actual screen readers (NVDA, JAWS, VoiceOver)"
    )
    recommendations.push("📱 Validate mobile accessibility with touch gestures")
    recommendations.push("🔄 Set up automated accessibility testing in CI/CD")

    return recommendations
  }
  async getLighthouseScore(): Promise<number> {
    try {
      const report = await this.runAudit()
      return report.score
    } catch (error) {
      return 0
    }
  }
}
export const accessibilityTester = AccessibilityTester.getInstance()
export async function quickA11yCheck(containerId?: string): Promise<void> {
  const report = await accessibilityTester.runAudit(containerId)
  if (report.issues.critical.length > 0) {
    report.issues.critical.forEach((issue) => 
  }

  if (report.issues.warning.length > 0) {
    report.issues.warning.forEach((issue) => 
  }

  if (report.issues.info.length > 0) {
    report.issues.info.forEach((issue) => 
  }
  report.recommendations.forEach((rec) => 
}
