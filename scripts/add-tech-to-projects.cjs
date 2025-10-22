const fs = require('fs');
const path = require('path');

// Read the myProjects.json file
const filePath = path.join(__dirname, '../src/assets/myProjects.json');
const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Function to determine tech stack based on project type and characteristics
function getTechStack(project) {
  const tech = ['WordPress'];
  
  // E-Shop projects use WooCommerce
  if (project.prType === 'E-Shop') {
    tech.push('WooCommerce');
    
    // Modern e-shops likely use Elementor
    if (project.prTags === 'From scratch') {
      tech.push('Elementor');
    }
  }
  
  // Dynamic sites
  if (project.prType === 'Dynamic Site') {
    // From scratch sites use custom themes or Elementor
    if (project.prTags === 'From scratch') {
      // Newer sites likely use Elementor, older ones custom themes
      tech.push('Elementor');
      tech.push('Custom Theme');
    } else if (project.prTags === 'Redesign') {
      tech.push('Elementor');
    }
  }
  
  // Static sites use basic WordPress with simple themes
  if (project.prType === 'Static') {
    tech.push('Custom Theme');
  }
  
  // Add PHP and MySQL to all WordPress projects
  tech.push('PHP');
  tech.push('MySQL');
  
  return tech;
}

// Add tech field to each project
const updatedProjects = projects.map(project => ({
  ...project,
  tech: getTechStack(project)
}));

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(updatedProjects, null, 2));

console.log('✅ Successfully added tech field to all projects!');
console.log(`Updated ${updatedProjects.length} projects.`);

// Show tech distribution
const techCounts = {};
updatedProjects.forEach(p => {
  p.tech.forEach(t => {
    techCounts[t] = (techCounts[t] || 0) + 1;
  });
});

console.log('\n📊 Technology Distribution:');
Object.entries(techCounts).sort((a, b) => b[1] - a[1]).forEach(([tech, count]) => {
  console.log(`   ${tech}: ${count} projects`);
});
