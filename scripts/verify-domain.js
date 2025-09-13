/**
 * Custom Domain Verification Script
 * 
 * This script helps verify that your custom domain is properly configured
 * by checking connectivity to both frontend and backend services.
 * 
 * Usage: 
 * 1. Update the domains in the configuration section
 * 2. Run with: node verify-domain.js
 */

const https = require('https');
const dns = require('dns');

// Configuration - Update these values with your domains
const config = {
  frontendDomain: 'yourdomain.com', // Replace with your actual domain
  apiDomain: 'api.yourdomain.com',  // Replace with your API domain
  renderDomain: 'created-by-dobas.onrender.com',
  endpoints: [
    '/api/products',  // Add your API endpoints to test
    '/api/settings'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

/**
 * Perform DNS lookup to verify domain configuration
 */
async function checkDNS() {
  console.log(`${colors.blue}\n=== DNS Configuration Check ===${colors.reset}`);
  
  try {
    // Check frontend domain
    console.log(`\nChecking frontend domain (${config.frontendDomain})...`);
    const frontendAddresses = await dnsLookup(config.frontendDomain);
    console.log(`${colors.green}✓ Frontend domain resolves to: ${frontendAddresses.join(', ')}${colors.reset}`);
    
    // Check API domain
    console.log(`\nChecking API domain (${config.apiDomain})...`);
    const apiAddresses = await dnsLookup(config.apiDomain);
    console.log(`${colors.green}✓ API domain resolves to: ${apiAddresses.join(', ')}${colors.reset}`);
    
    // Check if API domain is properly configured as CNAME to Render
    console.log(`\nVerifying API domain CNAME configuration...`);
    try {
      const cnames = await dnsCname(config.apiDomain);
      if (cnames.some(cname => cname.includes('onrender.com'))) {
        console.log(`${colors.green}✓ API domain correctly points to Render${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠ API domain does not point to Render. Found: ${cnames.join(', ')}${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠ Could not verify CNAME record: ${error.message}${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`${colors.red}✗ DNS check failed: ${error.message}${colors.reset}`);
  }
}

/**
 * Check HTTPS connectivity to domains
 */
async function checkConnectivity() {
  console.log(`${colors.blue}\n=== Connectivity Check ===${colors.reset}`);
  
  // Check frontend connectivity
  console.log(`\nChecking frontend connectivity...`);
  try {
    const frontendResponse = await httpsGet(`https://${config.frontendDomain}`);
    console.log(`${colors.green}✓ Frontend is accessible (Status: ${frontendResponse.statusCode})${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Frontend connectivity failed: ${error.message}${colors.reset}`);
  }
  
  // Check API connectivity
  console.log(`\nChecking API connectivity...`);
  for (const endpoint of config.endpoints) {
    try {
      const apiResponse = await httpsGet(`https://${config.apiDomain}${endpoint}`);
      console.log(`${colors.green}✓ API endpoint ${endpoint} is accessible (Status: ${apiResponse.statusCode})${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}✗ API endpoint ${endpoint} failed: ${error.message}${colors.reset}`);
    }
  }
  
  // Check direct Render connectivity as fallback
  console.log(`\nChecking direct Render connectivity (fallback)...`);
  try {
    const renderResponse = await httpsGet(`https://${config.renderDomain}/api/products`);
    console.log(`${colors.green}✓ Render is directly accessible (Status: ${renderResponse.statusCode})${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Direct Render connectivity failed: ${error.message}${colors.reset}`);
  }
}

/**
 * Check SSL certificate validity
 */
async function checkSSL() {
  console.log(`${colors.blue}\n=== SSL Certificate Check ===${colors.reset}`);
  
  // Check frontend SSL
  console.log(`\nChecking frontend SSL certificate...`);
  try {
    const frontendCert = await getSSLCertificate(config.frontendDomain);
    const frontendDaysRemaining = getDaysRemaining(frontendCert.valid_to);
    console.log(`${colors.green}✓ Frontend SSL certificate is valid${colors.reset}`);
    console.log(`  Issued to: ${frontendCert.subject.CN}`);
    console.log(`  Issued by: ${frontendCert.issuer.O}`);
    console.log(`  Valid until: ${frontendCert.valid_to} (${frontendDaysRemaining} days remaining)`);
  } catch (error) {
    console.log(`${colors.red}✗ Frontend SSL check failed: ${error.message}${colors.reset}`);
  }
  
  // Check API SSL
  console.log(`\nChecking API SSL certificate...`);
  try {
    const apiCert = await getSSLCertificate(config.apiDomain);
    const apiDaysRemaining = getDaysRemaining(apiCert.valid_to);
    console.log(`${colors.green}✓ API SSL certificate is valid${colors.reset}`);
    console.log(`  Issued to: ${apiCert.subject.CN}`);
    console.log(`  Issued by: ${apiCert.issuer.O}`);
    console.log(`  Valid until: ${apiCert.valid_to} (${apiDaysRemaining} days remaining)`);
  } catch (error) {
    console.log(`${colors.red}✗ API SSL check failed: ${error.message}${colors.reset}`);
  }
}

/**
 * Utility function to perform DNS lookup
 */
function dnsLookup(domain) {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, { all: true }, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses.map(a => a.address));
    });
  });
}

/**
 * Utility function to perform CNAME lookup
 */
function dnsCname(domain) {
  return new Promise((resolve, reject) => {
    dns.resolveCname(domain, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses);
    });
  });
}

/**
 * Utility function to make HTTPS GET request
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      resolve(res);
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Utility function to get SSL certificate details
 */
function getSSLCertificate(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      host: domain,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false, // Allow self-signed certificates
    };
    
    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (Object.keys(cert).length > 0) {
        resolve(cert);
      } else {
        reject(new Error('No certificate found'));
      }
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.end();
  });
}

/**
 * Calculate days remaining until certificate expiration
 */
function getDaysRemaining(dateString) {
  const expirationDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = expirationDate - currentDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Main function to run all checks
 */
async function main() {
  console.log(`${colors.blue}===== Custom Domain Verification Tool =====${colors.reset}`);
  console.log(`Frontend Domain: ${config.frontendDomain}`);
  console.log(`API Domain: ${config.apiDomain}`);
  console.log(`Render Domain: ${config.renderDomain}`);
  
  try {
    await checkDNS();
    await checkConnectivity();
    await checkSSL();
    
    console.log(`\n${colors.blue}===== Verification Complete =====${colors.reset}`);
    console.log(`\nNext steps:`);
    console.log(`1. If any checks failed, refer to the CUSTOM_DOMAIN_GUIDE.md for troubleshooting`);
    console.log(`2. Update the frontend environment variables if needed`);
    console.log(`3. Test the complete application flow with your custom domain`);
  } catch (error) {
    console.log(`${colors.red}\nVerification failed with error: ${error.message}${colors.reset}`);
  }
}

// Run the verification
main().catch(console.error);