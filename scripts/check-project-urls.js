#!/usr/bin/env node

/**
 * Project URL Checker
 * Checks if all URLs in myProjects.json are still accessible
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
}

class ProjectURLChecker {
    constructor() {
        this.results = {
            working: [],
            broken: [],
            redirected: [],
            timeout: [],
            errors: []
        }
        this.timeout = 10000 // 10 seconds timeout
    }

    async checkURL(url, maxRedirects = 3) {
        return new Promise((resolve) => {
            const startTime = Date.now()

            const checkRequest = (currentUrl, redirectCount = 0) => {
                if (redirectCount > maxRedirects) {
                    resolve({
                        url: currentUrl,
                        status: 'TOO_MANY_REDIRECTS',
                        statusCode: null,
                        responseTime: Date.now() - startTime,
                        finalUrl: currentUrl,
                        redirects: redirectCount
                    })
                    return
                }

                const urlObj = new URL(currentUrl)
                const isHttps = urlObj.protocol === 'https:'
                const client = isHttps ? https : http

                const options = {
                    hostname: urlObj.hostname,
                    port: urlObj.port || (isHttps ? 443 : 80),
                    path: urlObj.pathname + urlObj.search,
                    method: 'HEAD', // Use HEAD to avoid downloading content
                    timeout: this.timeout,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                }

                const req = client.request(options, (res) => {
                    const responseTime = Date.now() - startTime

                    // Handle redirects
                    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        const redirectUrl = new URL(res.headers.location, currentUrl).toString()
                        checkRequest(redirectUrl, redirectCount + 1)
                        return
                    }

                    resolve({
                        url: currentUrl,
                        status: res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'ERROR',
                        statusCode: res.statusCode,
                        responseTime,
                        finalUrl: currentUrl,
                        redirects: redirectCount
                    })
                })

                req.on('timeout', () => {
                    req.destroy()
                    resolve({
                        url: currentUrl,
                        status: 'TIMEOUT',
                        statusCode: null,
                        responseTime: Date.now() - startTime,
                        finalUrl: currentUrl,
                        redirects: redirectCount
                    })
                })

                req.on('error', (error) => {
                    resolve({
                        url: currentUrl,
                        status: 'ERROR',
                        statusCode: null,
                        responseTime: Date.now() - startTime,
                        finalUrl: currentUrl,
                        redirects: redirectCount,
                        error: error.message
                    })
                })

                req.end()
            }

            checkRequest(url)
        })
    }

    categorizeResult(result, project) {
        const data = { ...result, project }

        switch (result.status) {
            case 'SUCCESS':
                if (result.redirects > 0) {
                    this.results.redirected.push(data)
                } else {
                    this.results.working.push(data)
                }
                break
            case 'TIMEOUT':
                this.results.timeout.push(data)
                break
            case 'ERROR':
            case 'TOO_MANY_REDIRECTS':
                if (result.statusCode >= 400) {
                    this.results.broken.push(data)
                } else {
                    this.results.errors.push(data)
                }
                break
            default:
                this.results.errors.push(data)
        }
    }

    printProgress(current, total, project) {
        const percentage = Math.round((current / total) * 100)
        const bar = '█'.repeat(Math.round(percentage / 2)) + '░'.repeat(50 - Math.round(percentage / 2))
        process.stdout.write(`\r${colors.cyan}Checking: ${bar} ${percentage}% (${current}/${total}) ${colors.reset}${project.prName}`.padEnd(100))
    }

    printResults() {
        console.log('\n\n' + colors.bold + colors.blue + '=' * 80 + colors.reset)
        console.log(colors.bold + colors.blue + '                    PROJECT URL CHECK RESULTS' + colors.reset)
        console.log(colors.bold + colors.blue + '=' * 80 + colors.reset + '\n')

        // Working URLs
        if (this.results.working.length > 0) {
            console.log(colors.bold + colors.green + `✅ WORKING (${this.results.working.length})` + colors.reset)
            this.results.working.forEach(result => {
                console.log(`   ${colors.green}●${colors.reset} ${result.project.prName} - ${result.url} (${result.responseTime}ms)`)
            })
            console.log()
        }

        // Redirected URLs
        if (this.results.redirected.length > 0) {
            console.log(colors.bold + colors.yellow + `🔄 REDIRECTED (${this.results.redirected.length})` + colors.reset)
            this.results.redirected.forEach(result => {
                console.log(`   ${colors.yellow}●${colors.reset} ${result.project.prName} - ${result.url}`)
                console.log(`     ${colors.cyan}→ Final URL: ${result.finalUrl} (${result.redirects} redirects, ${result.responseTime}ms)${colors.reset}`)
            })
            console.log()
        }

        // Broken URLs
        if (this.results.broken.length > 0) {
            console.log(colors.bold + colors.red + `❌ BROKEN (${this.results.broken.length})` + colors.reset)
            this.results.broken.forEach(result => {
                console.log(`   ${colors.red}●${colors.reset} ${result.project.prName} - ${result.url}`)
                console.log(`     ${colors.red}Status: ${result.statusCode || 'Unknown'} ${result.error ? '- ' + result.error : ''}${colors.reset}`)
            })
            console.log()
        }

        // Timeout URLs
        if (this.results.timeout.length > 0) {
            console.log(colors.bold + colors.yellow + `⏱️  TIMEOUT (${this.results.timeout.length})` + colors.reset)
            this.results.timeout.forEach(result => {
                console.log(`   ${colors.yellow}●${colors.reset} ${result.project.prName} - ${result.url}`)
                console.log(`     ${colors.yellow}Timed out after ${this.timeout / 1000}s${colors.reset}`)
            })
            console.log()
        }

        // Error URLs
        if (this.results.errors.length > 0) {
            console.log(colors.bold + colors.red + `🚨 ERRORS (${this.results.errors.length})` + colors.reset)
            this.results.errors.forEach(result => {
                console.log(`   ${colors.red}●${colors.reset} ${result.project.prName} - ${result.url}`)
                console.log(`     ${colors.red}Error: ${result.error || result.status}${colors.reset}`)
            })
            console.log()
        }

        // Summary
        const total = this.results.working.length + this.results.redirected.length +
            this.results.broken.length + this.results.timeout.length + this.results.errors.length

        console.log(colors.bold + colors.blue + '=' * 80 + colors.reset)
        console.log(colors.bold + `SUMMARY: ${total} URLs checked` + colors.reset)
        console.log(`${colors.green}✅ Working: ${this.results.working.length}${colors.reset}`)
        console.log(`${colors.yellow}🔄 Redirected: ${this.results.redirected.length}${colors.reset}`)
        console.log(`${colors.red}❌ Broken: ${this.results.broken.length}${colors.reset}`)
        console.log(`${colors.yellow}⏱️  Timeout: ${this.results.timeout.length}${colors.reset}`)
        console.log(`${colors.red}🚨 Errors: ${this.results.errors.length}${colors.reset}`)

        const successRate = Math.round(((this.results.working.length + this.results.redirected.length) / total) * 100)
        console.log(`${colors.bold}Success Rate: ${successRate}%${colors.reset}`)
        console.log(colors.blue + '=' * 80 + colors.reset)
    }

    async saveReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const reportPath = path.join(__dirname, `url-check-report-${timestamp}.json`)

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.working.length + this.results.redirected.length +
                    this.results.broken.length + this.results.timeout.length + this.results.errors.length,
                working: this.results.working.length,
                redirected: this.results.redirected.length,
                broken: this.results.broken.length,
                timeout: this.results.timeout.length,
                errors: this.results.errors.length
            },
            results: this.results
        }

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
        console.log(`\n${colors.cyan}📁 Detailed report saved: ${reportPath}${colors.reset}`)
    }

    async checkAllProjects() {
        const projectsPath = path.join(__dirname, '..', 'src', 'assets', 'myProjects.json')

        if (!fs.existsSync(projectsPath)) {
            console.error(colors.red + '❌ myProjects.json not found!' + colors.reset)
            process.exit(1)
        }

        const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
        console.log(colors.bold + colors.blue + `Starting URL check for ${projects.length} projects...` + colors.reset + '\n')

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i]
            this.printProgress(i + 1, projects.length, project)

            try {
                const result = await this.checkURL(project.prUrl)
                this.categorizeResult(result, project)
            } catch (error) {
                this.categorizeResult({
                    url: project.prUrl,
                    status: 'ERROR',
                    statusCode: null,
                    responseTime: 0,
                    finalUrl: project.prUrl,
                    redirects: 0,
                    error: error.message
                }, project)
            }

            // Small delay to avoid overwhelming servers
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        this.printResults()
        await this.saveReport()
    }
}

// Run the checker
const checker = new ProjectURLChecker()
checker.checkAllProjects().catch(error => {
    console.error(colors.red + '❌ Error running URL checker:', error.message + colors.reset)
    process.exit(1)
})
