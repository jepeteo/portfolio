// Quick performance test for portfolio
// Navigate to projects section and measure render times

console.log('🚀 Starting performance test...');

// Function to scroll to projects section
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
        console.log('✅ Scrolled to projects section');
    } else {
        console.warn('❌ Projects section not found');
    }
}

// Function to measure component render times
function measureRenderTimes() {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.name.includes('React') || entry.duration > 50) {
                console.log(`⏱️ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
            }
        });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Stop observing after 10 seconds
    setTimeout(() => {
        observer.disconnect();
        console.log('📊 Performance measurement complete');
    }, 10000);
}

// Function to check for React Profiler data
function checkReactProfiler() {
    if (window.React && window.React.Profiler) {
        console.log('✅ React Profiler available');
    } else {
        console.log('ℹ️ React Profiler not available');
    }
}

// Run tests
checkReactProfiler();
measureRenderTimes();

// Export functions for manual testing
window.performanceTest = {
    scrollToProjects,
    measureRenderTimes,
    checkReactProfiler
};

console.log('🎯 Performance test setup complete. Use window.performanceTest to run manual tests.');
