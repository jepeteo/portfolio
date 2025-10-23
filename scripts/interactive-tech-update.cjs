const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read the myProjects.json file
const filePath = path.join(__dirname, '../src/assets/myProjects.json');
const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let currentIndex = 0;
let updatedProjects = [...projects];

console.log('\n🔧 Interactive Project Technology Updater\n');
console.log('For each project, you can:');
console.log('  1. Select platform: WordPress (w) or OpenCart (o)');
console.log('  2. For E-Shops: WooCommerce is auto-added');
console.log('  3. Select page builder: Divi (d), Elementor (e), WPBakery (v), Custom Theme (c)');
console.log('  4. Add optional features: Multilingual (m), Custom Dev/ACF (a), Booking (b)');
console.log('  5. Skip (s) to keep current, or Quit (q) to save and exit\n');
console.log('═══════════════════════════════════════════════════════════\n');

function askForProject() {
    if (currentIndex >= projects.length) {
        saveAndExit();
        return;
    }

    const project = projects[currentIndex];
    const currentTech = project.tech || [];

    console.log(`\n[${currentIndex + 1}/${projects.length}] ${project.prName}`);
    console.log(`   URL: ${project.prUrl}`);
    console.log(`   Type: ${project.prType}`);
    console.log(`   Current tech: ${currentTech.join(', ') || 'None'}`);
    console.log('');

    rl.question('Enter choices (e.g., "w d m b" for WordPress+Divi+Multilingual+Booking) or (s)kip/(q)uit: ', (answer) => {
        const choices = answer.toLowerCase().trim().split(/\s+/);

        if (choices.includes('q')) {
            saveAndExit();
            return;
        }

        if (choices.includes('s') || answer.trim() === '') {
            console.log('   ⏭️  Skipped');
            currentIndex++;
            askForProject();
            return;
        }

        const tech = [];

        // Platform
        if (choices.includes('o')) {
            tech.push('OpenCart');
        } else {
            tech.push('WordPress');
        }

        // E-commerce (auto for E-Shop type with WordPress)
        if (project.prType === 'E-Shop' && tech.includes('WordPress')) {
            tech.push('WooCommerce');
        }

        // Page Builder
        if (choices.includes('d')) {
            tech.push('Divi');
        } else if (choices.includes('e')) {
            tech.push('Elementor');
        } else if (choices.includes('v')) {
            tech.push('WPBakery');
        } else if (choices.includes('c')) {
            tech.push('Custom Theme');
        } else {
            // Default to Custom Theme if nothing specified
            tech.push('Custom Theme');
        }

        // Optional features
        if (choices.includes('m')) {
            tech.push('Multilingual');
        }
        if (choices.includes('a')) {
            tech.push('Custom Development');
        }
        if (choices.includes('b')) {
            tech.push('Booking System');
        }

        updatedProjects[currentIndex] = {
            ...project,
            tech: tech
        };

        console.log(`   ✅ Updated: ${tech.join(', ')}`);

        currentIndex++;
        askForProject();
    });
}

function saveAndExit() {
    console.log('\n💾 Saving changes...');
    fs.writeFileSync(filePath, JSON.stringify(updatedProjects, null, 2));
    console.log(`✅ Successfully updated ${currentIndex} projects!`);

    // Show summary
    const techCounts = {};
    updatedProjects.forEach(p => {
        if (p.tech) {
            p.tech.forEach(t => {
                techCounts[t] = (techCounts[t] || 0) + 1;
            });
        }
    });

    console.log('\n📊 Technology Summary:');
    Object.entries(techCounts).sort((a, b) => b[1] - a[1]).forEach(([tech, count]) => {
        console.log(`   ${tech}: ${count} projects`);
    });

    rl.close();
    process.exit(0);
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Interrupted! Saving progress...');
    saveAndExit();
});

// Start the interactive session
askForProject();
