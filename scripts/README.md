# Scripts for Created by Dobas

This directory contains utility scripts to help with the deployment and management of the Created by Dobas application.

## Available Scripts

### verify-domain.js

This script helps verify that your custom domain is properly configured by checking connectivity to both frontend and backend services.

#### Prerequisites

- Node.js installed
- Custom domain already purchased and DNS records configured according to the [CUSTOM_DOMAIN_GUIDE.md](../CUSTOM_DOMAIN_GUIDE.md)

#### Configuration

Before running the script, update the configuration section in `verify-domain.js` with your actual domain information:

```javascript
const config = {
  frontendDomain: 'yourdomain.com', // Replace with your actual domain
  apiDomain: 'api.yourdomain.com',  // Replace with your API domain
  renderDomain: 'created-by-dobas.onrender.com',
  endpoints: [
    '/api/products',  // Add your API endpoints to test
    '/api/settings'
  ]
};
```

#### Usage

Run the script from the project root directory:

```bash
node scripts/verify-domain.js
```

#### What It Checks

1. **DNS Configuration**:
   - Verifies that your frontend and API domains resolve to the correct IP addresses
   - Checks if the API domain is properly configured as a CNAME to Render

2. **Connectivity**:
   - Tests if the frontend domain is accessible
   - Tests if the API endpoints are accessible through your custom domain
   - Tests direct connectivity to Render as a fallback

3. **SSL Certificates**:
   - Verifies that SSL certificates are valid for both domains
   - Shows certificate details including expiration dates

#### Troubleshooting

If the script reports any issues:

1. Double-check your DNS configuration in Hostinger
2. Ensure that both Render and Vercel have your custom domain properly configured
3. Remember that DNS changes can take up to 48 hours to propagate globally
4. Refer to the [CUSTOM_DOMAIN_GUIDE.md](../CUSTOM_DOMAIN_GUIDE.md) for detailed troubleshooting steps