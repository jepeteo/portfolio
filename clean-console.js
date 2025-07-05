const fs = require('fs');
const path = require('path');

function removeConsoleStatements(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove console.log, console.warn, console.error, console.group, etc.
        // But preserve the structure and formatting
        content = content.replace(/^\s*console\.[a-zA-Z]+\([^)]*\)\s*$/gm, '');
        content = content.replace(/console\.[a-zA-Z]+\([^)]*\);?\s*$/gm, '');
        content = content.replace(/console\.[a-zA-Z]+\([^)]*\)[,;]?\s*$/gm, '');

        // Remove multi-line console statements
        content = content.replace(/console\.[a-zA-Z]+\(\s*[\s\S]*?\)\s*[;,]?\s*$/gm, '');

        // Clean up empty lines that are left behind
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        fs.writeFileSync(filePath, content);
        console.log(`Cleaned: ${filePath}`);
    } catch (error) {
        console.error(`Error cleaning ${filePath}:`, error.message);
    }
}

function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDirectory(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            removeConsoleStatements(filePath);
        }
    }
}

// Start cleaning from src directory
walkDirectory('./src');
console.log('Console statement cleanup complete!');
