const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Read the myProjects.json file
const filePath = path.join(__dirname, '../src/assets/myProjects.json');
const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Function to fetch HTML content from a URL
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    protocol.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHTML(res.headers.location).then(resolve).catch(reject);
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

// Function to detect technologies from HTML content
function detectTechnologies(html, url) {
  const lowerHtml = html.toLowerCase();
  let platform = 'WordPress'; // Default
  let pageBuilder = null;
  let ecommerce = null;
  
  // 1. Detect Platform (WordPress OR OpenCart - mutually exclusive)
  if (lowerHtml.includes('opencart') || 
      lowerHtml.includes('catalog/view/theme/') ||
      lowerHtml.includes('route=product/product') ||
      lowerHtml.includes('index.php?route=')) {
    platform = 'OpenCart';
  } else if (lowerHtml.includes('wp-content') || 
             lowerHtml.includes('wordpress') ||
             lowerHtml.includes('wp-includes')) {
    platform = 'WordPress';
  }
  
  // 2. Detect E-commerce (only if WordPress - be very strict)
  if (platform === 'WordPress') {
    const woocommerceScore = (lowerHtml.match(/woocommerce/g) || []).length;
    const wcScore = (lowerHtml.match(/wc-block|wc_|woocommerce-|\/woocommerce\//g) || []).length;
    
    // Only mark as WooCommerce if we have strong evidence (multiple matches)
    if (woocommerceScore >= 3 || wcScore >= 2) {
      ecommerce = 'WooCommerce';
    }
  }
  
  // OpenCart is already e-commerce, no need to add separate tag
  if (platform === 'OpenCart') {
    ecommerce = null; // OpenCart implies e-commerce
  }
  
  // 3. Detect Page Builder (only ONE - priority based on occurrence count)
  if (platform === 'WordPress') {
    // Count occurrences more precisely
    const elementorScore = (lowerHtml.match(/elementor-section|elementor-widget|elementor-element/g) || []).length;
    const diviScore = (lowerHtml.match(/et_pb_section|et_pb_row|et_pb_column|et-db/g) || []).length;
    const wpbakeryScore = (lowerHtml.match(/vc_row|vc_column|wpb_/g) || []).length;
    
    // Only assign if we have strong evidence (at least 3 occurrences)
    if (elementorScore >= 3 && elementorScore > diviScore && elementorScore > wpbakeryScore) {
      pageBuilder = 'Elementor';
    } else if (diviScore >= 3 && diviScore > elementorScore && diviScore > wpbakeryScore) {
      pageBuilder = 'Divi';
    } else if (wpbakeryScore >= 3) {
      pageBuilder = 'WPBakery';
    } else {
      pageBuilder = 'Custom Theme';
    }
  }
  
  // Build final tech array
  const tech = [platform];
  if (ecommerce) tech.push(ecommerce);
  if (pageBuilder) tech.push(pageBuilder);
  
  return tech;
}

// Analyze all sites
async function analyzeSites() {
  const results = [];
  let completed = 0;
  
  console.log(`\n🔍 Starting analysis of ${projects.length} websites...\n`);
  
  for (const project of projects) {
    try {
      console.log(`Analyzing: ${project.prName} (${project.prUrl})`);
      const html = await fetchHTML(project.prUrl);
      const detectedTech = detectTechnologies(html, project.prUrl);
      
      results.push({
        name: project.prName,
        url: project.prUrl,
        type: project.prType,
        detectedTech: detectedTech
      });
      
      completed++;
      console.log(`  ✓ Found: ${detectedTech.join(', ')}`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      results.push({
        name: project.prName,
        url: project.prUrl,
        type: project.prType,
        detectedTech: ['WordPress'], // Fallback
        error: error.message
      });
    }
    
    console.log(`Progress: ${completed}/${projects.length}\n`);
  }
  
  // Save results
  const outputPath = path.join(__dirname, 'site-analysis-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  // Generate summary
  console.log('\n📊 Analysis Summary:');
  const techCounts = {};
  results.forEach(r => {
    r.detectedTech.forEach(tech => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });
  
  Object.entries(techCounts).sort((a, b) => b[1] - a[1]).forEach(([tech, count]) => {
    console.log(`   ${tech}: ${count} sites`);
  });
  
  console.log(`\n✅ Results saved to: ${outputPath}`);
  
  return results;
}

// Run analysis
analyzeSites().catch(console.error);
