#!/usr/bin/env node

/**
 * Performance Budget Check Script
 * Validates bundle sizes and performance metrics against defined budgets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance budgets (in KB)
const PERFORMANCE_BUDGETS = {
    // Bundle size budgets
    mainBundle: 350,      // Current: ~280KB
    vendorBundle: 200,    // Current: ~141KB
    cssBundle: 250,       // Current: ~223KB
    totalJS: 600,         // Total JavaScript
    totalCSS: 300,        // Total CSS

    // Asset budgets
    images: 2000,         // Total images
    fonts: 500,           // Total fonts

    // Performance metrics (in ms)
    fcp: 1500,           // First Contentful Paint
    lcp: 2500,           // Largest Contentful Paint
    fid: 100,            // First Input Delay
    cls: 0.1,            // Cumulative Layout Shift
    tti: 3500,           // Time to Interactive
};

class PerformanceBudgetChecker {
    constructor() {
        this.distPath = path.join(process.cwd(), 'dist');
        this.errors = [];
        this.warnings = [];
    }

    async checkBundleSizes() {
        console.log('📊 Checking bundle sizes...');

        if (!fs.existsSync(this.distPath)) {
            this.errors.push('❌ Dist folder not found. Run build first.');
            return;
        }

        const assetsPath = path.join(this.distPath, 'assets');
        if (!fs.existsSync(assetsPath)) {
            this.errors.push('❌ Assets folder not found in dist.');
            return;
        }

        const files = fs.readdirSync(assetsPath);
        const jsFiles = files.filter(f => f.endsWith('.js'));
        const cssFiles = files.filter(f => f.endsWith('.css'));

        // Calculate total sizes
        const totalJSSize = this.getTotalSize(jsFiles, assetsPath);
        const totalCSSSize = this.getTotalSize(cssFiles, assetsPath);

        // Check main bundle (largest JS file)
        const mainBundleSize = this.getLargestFileSize(jsFiles, assetsPath);

        console.log(`\n📦 Bundle Analysis:`);
        console.log(`├── Main Bundle: ${this.formatSize(mainBundleSize)} (Budget: ${this.formatSize(PERFORMANCE_BUDGETS.mainBundle * 1024)})`);
        console.log(`├── Total JS: ${this.formatSize(totalJSSize)} (Budget: ${this.formatSize(PERFORMANCE_BUDGETS.totalJS * 1024)})`);
        console.log(`└── Total CSS: ${this.formatSize(totalCSSSize)} (Budget: ${this.formatSize(PERFORMANCE_BUDGETS.totalCSS * 1024)})`);

        // Budget checks
        this.checkBudget('Main Bundle', mainBundleSize, PERFORMANCE_BUDGETS.mainBundle * 1024);
        this.checkBudget('Total JavaScript', totalJSSize, PERFORMANCE_BUDGETS.totalJS * 1024);
        this.checkBudget('Total CSS', totalCSSSize, PERFORMANCE_BUDGETS.totalCSS * 1024);
    }

    getTotalSize(files, basePath) {
        return files.reduce((total, file) => {
            const filePath = path.join(basePath, file);
            const stats = fs.statSync(filePath);
            return total + stats.size;
        }, 0);
    }

    getLargestFileSize(files, basePath) {
        return files.reduce((largest, file) => {
            const filePath = path.join(basePath, file);
            const stats = fs.statSync(filePath);
            return Math.max(largest, stats.size);
        }, 0);
    }

    checkBudget(name, actual, budget) {
        const percentage = (actual / budget) * 100;

        if (actual > budget) {
            this.errors.push(`❌ ${name} exceeds budget: ${this.formatSize(actual)} > ${this.formatSize(budget)} (${percentage.toFixed(1)}%)`);
        } else if (percentage > 90) {
            this.warnings.push(`⚠️ ${name} approaching budget limit: ${this.formatSize(actual)} (${percentage.toFixed(1)}% of budget)`);
        } else {
            console.log(`✅ ${name}: ${this.formatSize(actual)} (${percentage.toFixed(1)}% of budget)`);
        }
    }

    async checkAssetOptimization() {
        console.log('\n🖼️ Checking asset optimization...');

        const publicPath = path.join(process.cwd(), 'public');
        const srcAssetsPath = path.join(process.cwd(), 'src', 'assets');

        // Check for unoptimized images
        this.checkImageOptimization(publicPath);
        this.checkImageOptimization(srcAssetsPath);
    }

    checkImageOptimization(basePath) {
        if (!fs.existsSync(basePath)) return;

        const checkDirectory = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            entries.forEach(entry => {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    checkDirectory(fullPath);
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    const stats = fs.statSync(fullPath);

                    // Check for large images
                    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                        if (stats.size > 500 * 1024) { // 500KB
                            this.warnings.push(`⚠️ Large image found: ${entry.name} (${this.formatSize(stats.size)})`);
                        }
                    }

                    // Check for missing WebP alternatives
                    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                        if (!fs.existsSync(webpPath)) {
                            this.warnings.push(`💡 Consider WebP version for: ${entry.name}`);
                        }
                    }
                }
            });
        };

        checkDirectory(basePath);
    }

    async checkDependencies() {
        console.log('\n📦 Checking dependencies...');

        const packagePath = path.join(process.cwd(), 'package.json');
        const packageLockPath = path.join(process.cwd(), 'package-lock.json');

        if (!fs.existsSync(packagePath)) {
            this.errors.push('❌ package.json not found');
            return;
        }

        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const dependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies
        };

        // Check for heavy dependencies
        const heavyDeps = [
            'lodash', 'moment', 'axios', 'jquery', 'bootstrap'
        ];

        heavyDeps.forEach(dep => {
            if (dependencies[dep]) {
                this.warnings.push(`⚠️ Heavy dependency detected: ${dep}. Consider lighter alternatives.`);
            }
        });

        console.log(`✅ Dependencies checked: ${Object.keys(dependencies).length} packages`);
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async generateReport() {
        console.log('\n📊 Generating performance report...');

        const report = {
            timestamp: new Date().toISOString(),
            budgets: PERFORMANCE_BUDGETS,
            status: this.errors.length === 0 ? 'PASSED' : 'FAILED',
            errors: this.errors,
            warnings: this.warnings,
            summary: {
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length
            }
        };

        const reportPath = path.join(this.distPath, 'performance-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📄 Report saved to: ${reportPath}`);
        return report;
    }

    async run() {
        console.log('🚀 Starting Performance Budget Check...\n');

        try {
            await this.checkBundleSizes();
            await this.checkAssetOptimization();
            await this.checkDependencies();

            const report = await this.generateReport();

            // Print summary
            console.log('\n' + '='.repeat(50));
            console.log('📊 PERFORMANCE BUDGET SUMMARY');
            console.log('='.repeat(50));

            if (this.errors.length > 0) {
                console.log('\n❌ ERRORS:');
                this.errors.forEach(error => console.log(error));
            }

            if (this.warnings.length > 0) {
                console.log('\n⚠️ WARNINGS:');
                this.warnings.forEach(warning => console.log(warning));
            }

            if (this.errors.length === 0 && this.warnings.length === 0) {
                console.log('\n🎉 All performance budgets passed!');
            }

            console.log(`\n📈 Total: ${this.errors.length} errors, ${this.warnings.length} warnings`);

            // Exit with error code if there are budget violations
            if (this.errors.length > 0) {
                process.exit(1);
            }

        } catch (error) {
            console.error('❌ Performance budget check failed:', error);
            process.exit(1);
        }
    }
}

// Run the checker
const checker = new PerformanceBudgetChecker();
checker.run();
