/**
 * Debug utility to help identify render loops and performance issues
 */

interface RenderTracker {
  componentName: string
  renderCount: number
  lastRenderTime: number
  renders: number[]
}

class RenderLoopDebugger {
  private static instance: RenderLoopDebugger
  private trackers = new Map<string, RenderTracker>()
  private warningThreshold = 10 // renders per second
  private enabled = process.env.NODE_ENV === "development"

  static getInstance(): RenderLoopDebugger {
    if (!RenderLoopDebugger.instance) {
      RenderLoopDebugger.instance = new RenderLoopDebugger()
    }
    return RenderLoopDebugger.instance
  }

  trackRender(componentName: string): void {
    if (!this.enabled) return

    const now = Date.now()
    const tracker = this.trackers.get(componentName) || {
      componentName,
      renderCount: 0,
      lastRenderTime: now,
      renders: [],
    }

    tracker.renderCount++
    tracker.lastRenderTime = now
    tracker.renders.push(now)

    // Keep only last 20 renders
    if (tracker.renders.length > 20) {
      tracker.renders = tracker.renders.slice(-20)
    }

    this.trackers.set(componentName, tracker)

    // Check for potential render loops
    this.checkForRenderLoop(tracker)
  }

  private checkForRenderLoop(tracker: RenderTracker): void {
    const now = Date.now()
    const recentRenders = tracker.renders.filter((time) => now - time < 1000) // Last second

    if (recentRenders.length > this.warningThreshold) {
      console.warn(
        `🔥 Potential render loop detected in ${tracker.componentName}!`
      )
      console.warn(`📊 ${recentRenders.length} renders in the last second`)
      console.trace("Component render trace")

      // Clear recent renders to avoid spam
      tracker.renders = tracker.renders.filter((time) => now - time >= 1000)
    }
  }

  getReport(): Record<string, any> {
    const report: Record<string, any> = {}

    this.trackers.forEach((tracker, componentName) => {
      const now = Date.now()
      const recentRenders = tracker.renders.filter((time) => now - time < 5000) // Last 5 seconds

      report[componentName] = {
        totalRenders: tracker.renderCount,
        recentRenders: recentRenders.length,
        lastRenderTime: new Date(tracker.lastRenderTime).toLocaleTimeString(),
        status:
          recentRenders.length > this.warningThreshold
            ? "⚠️ High"
            : "✅ Normal",
      }
    })

    return report
  }

  logReport(): void {
    if (!this.enabled) return

    const report = this.getReport()
    console.group("🔍 Render Loop Debug Report")
    console.table(report)
    console.groupEnd()
  }

  reset(): void {
    this.trackers.clear()
  }
}

// React hook for easy component tracking
export function useRenderTracker(componentName: string): void {
  if (process.env.NODE_ENV === "development") {
    RenderLoopDebugger.getInstance().trackRender(componentName)
  }
}

// Global debug functions
if (process.env.NODE_ENV === "development") {
  ;(window as any).debugRenders = {
    getReport: () => RenderLoopDebugger.getInstance().getReport(),
    logReport: () => RenderLoopDebugger.getInstance().logReport(),
    reset: () => RenderLoopDebugger.getInstance().reset(),
  }
}

export default RenderLoopDebugger
