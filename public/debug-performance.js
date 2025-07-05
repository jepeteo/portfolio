/**
 * Performance Testing and Debugging Utility
 * Run this in the browser console to analyze performance issues
 */

// Add this function to help debug render issues
window.runPerformanceAnalysis = function () {
    console.group('🔍 Portfolio Performance Analysis')

    // 1. Check for memory leaks
    if (performance.memory) {
        const memory = performance.memory
        console.log('💾 Memory Usage:', {
            used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
            usage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)}%`
        })
    }

    // 2. Check event listeners count (Chrome DevTools only)
    let totalListeners = 'N/A (Chrome DevTools required)'
    if (typeof getEventListeners === 'function') {
        const elementsWithListeners = document.querySelectorAll('*')
        let count = 0
        elementsWithListeners.forEach(el => {
            try {
                const listeners = getEventListeners(el) || {}
                count += Object.keys(listeners).reduce((acc, key) => acc + listeners[key].length, 0)
            } catch (e) {
                // Ignore errors
            }
        })
        totalListeners = count
    }
    console.log('👂 Total Event Listeners:', totalListeners)

    // 3. Check observer count
    const observers = []
    const originalObserver = window.IntersectionObserver
    window.IntersectionObserver = function (...args) {
        const observer = new originalObserver(...args)
        observers.push(observer)
        return observer
    }
    console.log('👁️ Intersection Observers:', observers.length)

    // 4. Check for excessive React renders
    if (window.debugRenders) {
        console.log('⚛️ React Component Renders:')
        window.debugRenders.logReport()
    }

    // 5. Check for long tasks
    if ('PerformanceObserver' in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
            const longTasks = list.getEntries()
            if (longTasks.length > 0) {
                console.warn('⏱️ Long Tasks Detected:', longTasks.map(task => ({
                    duration: `${task.duration.toFixed(2)}ms`,
                    startTime: `${task.startTime.toFixed(2)}ms`
                })))
            }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
    }

    // 6. Check Core Web Vitals
    const webVitals = {}
    if ('PerformanceObserver' in window) {
        // LCP
        new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            webVitals.LCP = lastEntry.startTime
            console.log('🎯 Largest Contentful Paint:', `${webVitals.LCP.toFixed(2)}ms`)
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // FID
        new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach(entry => {
                webVitals.FID = entry.processingStart - entry.startTime
                console.log('⚡ First Input Delay:', `${webVitals.FID.toFixed(2)}ms`)
            })
        }).observe({ entryTypes: ['first-input'] })

        // CLS
        let clsValue = 0
        new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value
                }
            })
            webVitals.CLS = clsValue
            console.log('📐 Cumulative Layout Shift:', webVitals.CLS.toFixed(4))
        }).observe({ entryTypes: ['layout-shift'] })
    }

    // 7. Check for excessive DOM nodes
    const totalNodes = document.querySelectorAll('*').length
    console.log('🌳 Total DOM Nodes:', totalNodes)
    if (totalNodes > 1500) {
        console.warn('⚠️ High DOM node count detected')
    }

    // 8. Check for unoptimized images and loading states
    const images = document.querySelectorAll('img')
    const unoptimizedImages = Array.from(images).filter(img => {
        return !img.loading || img.loading !== 'lazy'
    })

    // Check for loading spinners that might be stuck
    const loadingSpinners = document.querySelectorAll('.animate-spin')
    const imageContainers = document.querySelectorAll('[class*="project"]')

    console.log('🖼️ Images & Loading States:', {
        total: images.length,
        unoptimized: unoptimizedImages.length,
        loadingSpinners: loadingSpinners.length,
        imageContainers: imageContainers.length,
        imagesWithErrors: Array.from(images).filter(img => img.complete && img.naturalWidth === 0).length,
        imagesLoaded: Array.from(images).filter(img => img.complete && img.naturalWidth > 0).length
    })

    console.groupEnd()

    return {
        memory: performance.memory,
        eventListeners: totalListeners,
        observers: observers.length,
        domNodes: totalNodes,
        images: { total: images.length, unoptimized: unoptimizedImages.length },
        webVitals
    }
}

// Add function to specifically debug image loading issues
window.debugImageLoading = function () {
    console.group('🖼️ Image Loading Debug')

    const images = document.querySelectorAll('img')
    const spinners = document.querySelectorAll('.animate-spin')

    console.log(`Found ${images.length} images and ${spinners.length} loading spinners`)

    images.forEach((img, index) => {
        const container = img.closest('[class*="project"], [class*="card"]')
        const spinner = container ? container.querySelector('.animate-spin') : null

        console.log(`Image ${index + 1}:`, {
            src: img.src,
            alt: img.alt,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            hasError: img.complete && img.naturalWidth === 0,
            hasSpinner: !!spinner,
            spinnerVisible: spinner ? getComputedStyle(spinner).display !== 'none' : false
        })
    })

    if (spinners.length > 0) {
        console.warn(`⚠️ Found ${spinners.length} loading spinners still active`)
        spinners.forEach((spinner, index) => {
            const container = spinner.closest('[class*="project"], [class*="card"]')
            const image = container ? container.querySelector('img') : null
            console.warn(`Spinner ${index + 1}:`, {
                visible: getComputedStyle(spinner).display !== 'none',
                hasImage: !!image,
                imageLoaded: image ? image.complete && image.naturalWidth > 0 : 'no image',
                containerClasses: container ? container.className : 'no container'
            })
        })
    }

    console.groupEnd()
    return { images: images.length, spinners: spinners.length }
}

// Monitor image loading in real-time
window.monitorImageLoading = function (duration = 5000) {
    console.log(`🔍 Monitoring image loading for ${duration / 1000} seconds...`)

    const start = Date.now()
    const interval = setInterval(() => {
        const elapsed = Date.now() - start
        if (elapsed >= duration) {
            clearInterval(interval)
            console.log('📊 Final image loading report:')
            window.debugImageLoading()
        } else {
            // Quick check every second
            if (elapsed % 1000 < 100) {
                const spinners = document.querySelectorAll('.animate-spin')
                if (spinners.length > 0) {
                    console.log(`⏱️ ${elapsed / 1000}s: ${spinners.length} spinners still active`)
                }
            }
        }
    }, 100)

    return interval
}

// Add shortcut function to check for render loops
window.checkRenderLoops = function () {
    if (window.debugRenders) {
        const report = window.debugRenders.getReport()
        const problematicComponents = Object.entries(report).filter(([name, data]) => {
            return data.recentRenders > 5
        })

        if (problematicComponents.length > 0) {
            console.warn('🔥 Components with high render frequency:')
            problematicComponents.forEach(([name, data]) => {
                console.warn(`- ${name}: ${data.recentRenders} renders in last 5 seconds`)
            })
        } else {
            console.log('✅ No render loops detected')
        }

        return problematicComponents
    } else {
        console.log('Debug render tracking not available')
        return []
    }
}

// Add function to monitor for a few seconds
window.monitorPerformance = function (duration = 10000) {
    console.log(`🔍 Monitoring performance for ${duration / 1000} seconds...`)

    const start = Date.now()
    const interval = setInterval(() => {
        const elapsed = Date.now() - start
        if (elapsed >= duration) {
            clearInterval(interval)
            console.log('📊 Final performance report:')
            window.runPerformanceAnalysis()
            window.checkRenderLoops()
        } else {
            // Check for render loops every 2 seconds
            if (elapsed % 2000 < 100) {
                window.checkRenderLoops()
            }
        }
    }, 100)

    return interval
}

// Quick performance check function
function checkCurrentPerformance() {
    console.log('🔍 Checking current performance status...');

    // Check if expensive hooks are still active
    const expensiveTracking = window.expensiveRenderTracking || false;
    if (expensiveTracking) {
        console.warn('⚠️ Expensive render tracking still active');
    } else {
        console.log('✅ Expensive render tracking disabled');
    }

    // Quick render time test
    const startTime = performance.now();
    const projectCards = document.querySelectorAll('[data-project-card]');
    const endTime = performance.now();

    console.log(`📊 Found ${projectCards.length} project cards in ${(endTime - startTime).toFixed(2)}ms`);

    // Memory usage check
    if (performance.memory) {
        const memory = performance.memory;
        console.log('💾 Memory usage:', {
            used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
        });
    }
}

// Add to global debug object
window.debugPerformance = {
    checkCurrentPerformance
}

console.log('🛠️ Performance debugging tools loaded!')
console.log('Available commands:')
console.log('- window.runPerformanceAnalysis() - Full performance analysis')
console.log('- window.checkRenderLoops() - Check for excessive renders')
console.log('- window.monitorPerformance(10000) - Monitor for 10 seconds')
console.log('- window.debugImageLoading() - Debug image loading states')
console.log('- window.monitorImageLoading(5000) - Monitor image loading for 5 seconds')
console.log('- window.debugPerformance.checkCurrentPerformance() - Quick performance check')
