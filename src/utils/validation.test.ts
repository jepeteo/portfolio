import {
  sanitizeInput,
  validateContactForm,
  validateEmail,
} from "./validation"

describe("validation utils", () => {
  it("sanitizes dangerous payloads", () => {
    const input = "<script>javascript:alert(1)</script>"
    expect(sanitizeInput(input)).toBe("scriptalert(1)/script")
  })

  it("validates email shape", () => {
    expect(validateEmail("hello@example.com")).toBe(true)
    expect(validateEmail("invalid-email")).toBe(false)
  })

  it("validates contact form required fields", () => {
    const result = validateContactForm({
      name: "T",
      email: "invalid",
      message: "short",
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBeTruthy()
    expect(result.errors.email).toBeTruthy()
    expect(result.errors.message).toBeTruthy()
  })
})
