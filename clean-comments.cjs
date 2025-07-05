const fs = require('fs');
const path = require('path');

function removeComments(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove single-line comments (// ...)
        content = content.replace(/^\s*\/\/.*$/gm, '');

        // Remove JSX comments ({/* ... */})
        content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

        // Remove multi-line comments (/* ... */)
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');

        // Remove TODO, FIXME, etc. comments
        content = content.replace(/^\s*\/\/\s*(TODO|FIXME|NOTE|DEBUG|TEMP|XXX):?.*$/gmi, '');

        // Clean up multiple empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        // Clean up empty lines at the beginning of blocks
        content = content.replace(/\{\s*\n\s*\n/g, '{\n');

        fs.writeFileSync(filePath, content);
        console.log(`Cleaned comments: ${filePath}`);
    } catch (error) {
        console.error(`Error cleaning comments in ${filePath}:`, error.message);
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
            removeComments(filePath);
        }
    }
}

// Start cleaning from src directory
walkDirectory('./src');
console.log('Comment cleanup complete!');
