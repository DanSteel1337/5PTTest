// Debug utility for consistent logging
const DEBUG_ENABLED = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEBUG === "true"

export const debug = {
  log: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.log("[DEBUG]", ...args)
    }
  },
  error: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.error("[ERROR]", ...args)
    }
  },
  warn: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.warn("[WARN]", ...args)
    }
  },
  trace: (message: string) => {
    if (DEBUG_ENABLED) {
      console.log("[TRACE]", message)
      console.trace()
    }
  },
  group: (label: string, fn: () => void) => {
    if (DEBUG_ENABLED) {
      console.group(`[DEBUG] ${label}`)
      try {
        fn()
      } finally {
        console.groupEnd()
      }
    }
  },
}

// Add component debugging helper
export function debugComponent(componentName: string) {
  return {
    render: () => debug.log(`${componentName} rendering`),
    mount: () => debug.log(`${componentName} mounted`),
    update: (deps: any[]) => debug.log(`${componentName} updated`, deps),
    unmount: () => debug.log(`${componentName} unmounting`),
    error: (error: any) => debug.error(`${componentName} error:`, error),
    props: (props: any) => debug.log(`${componentName} props:`, props),
    state: (state: any) => debug.log(`${componentName} state:`, state),
  }
}
