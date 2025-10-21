if (process.env.NODE_ENV === "development") {
  import("./accessibilityTester")
    .then(({ quickA11yCheck }) => {
      setTimeout(() => {
        quickA11yCheck()
          .then(() => {
            console.log("Accessibility check completed")
          })
          .catch((error: Error) => {
            console.warn("Accessibility check failed:", error.message)
          })
      }, 2000)
    })
    .catch(() => {
      console.warn("Could not load accessibility tester")
    })

  setTimeout(() => {
    if ("webVitals" in window) {
      console.log("Web Vitals available")
    }
  }, 1000)
}

export default {}
