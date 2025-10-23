const fs = require('fs');
const path = require('path');

// Read the myProjects.json file
const filePath = path.join(__dirname, '../src/assets/myProjects.json');
const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Simple categorization based on project type
function categorizeTech(project) {
  const tech = [];
  
  // All are WordPress by default (you can manually change specific OpenCart ones)
  tech.push('WordPress');
  
  // E-Shop gets WooCommerce
  if (project.prType === 'E-Shop') {
    tech.push('WooCommerce');
  }
  
  // No page builder assigned by default - will be "Custom Theme"
  // You can manually add 'Divi', 'Elementor', or 'WPBakery' for specific sites
  tech.push('Custom Theme');
  
  return tech;
}

// Update all projects
const updatedProjects = projects.map(project => ({
  ...project,
  tech: categorizeTech(project)
}));

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(updatedProjects, null, 2));

console.log('✅ Successfully updated tech field for all projects!');
console.log(`Updated ${updatedProjects.length} projects.`);
console.log('\n📊 Default categorization:');
console.log('   - All projects: WordPress + Custom Theme');
console.log('   - E-Shop projects: + WooCommerce');
console.log('\n💡 Next steps:');
console.log('   1. Manually edit myProjects.json to change specific sites');
console.log('   2. Replace "Custom Theme" with "Divi", "Elementor", or "WPBakery" as needed');
console.log('   3. Change "WordPress" to "OpenCart" for OpenCart sites');
console.log('   4. PHP and MySQL have been removed');
