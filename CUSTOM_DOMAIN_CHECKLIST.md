# Custom Domain Setup Checklist

Use this checklist to track your progress when setting up a custom domain for your Created by Dobas application.

## Domain Purchase and Preparation

- [ ] Purchase a domain from Hostinger
- [ ] Access Hostinger domain management dashboard
- [ ] Ensure you have admin access to both Render and Vercel dashboards

## Backend (Render) Configuration

- [ ] Add custom domain in Render dashboard
  - [ ] Go to Web Service → Settings → Custom Domains
  - [ ] Add domain (e.g., `api.yourdomain.com`)
  - [ ] Note verification instructions if provided

- [ ] Configure DNS in Hostinger for backend
  - [ ] Add CNAME record pointing `api` subdomain to your Render URL
  - [ ] Set appropriate TTL value (typically 14400)

- [ ] Verify backend domain is working
  - [ ] Wait for DNS propagation (can take 24-48 hours)
  - [ ] Test API endpoint through custom domain
  - [ ] Verify SSL certificate is working (https)

## Frontend (Vercel) Configuration

- [ ] Add custom domain in Vercel dashboard
  - [ ] Go to Project → Settings → Domains
  - [ ] Add domain (e.g., `yourdomain.com` and/or `www.yourdomain.com`)
  - [ ] Follow verification steps if required

- [ ] Configure DNS in Hostinger for frontend
  - [ ] Add A record pointing root domain to Vercel's IP (76.76.21.21)
  - [ ] Add AAAA record for IPv6 support if desired
  - [ ] Add CNAME record for `www` subdomain pointing to `cname.vercel-dns.com`
  - [ ] Set appropriate TTL values

- [ ] Verify frontend domain is working
  - [ ] Wait for DNS propagation
  - [ ] Test website through custom domain
  - [ ] Verify SSL certificate is working (https)

## Frontend-Backend Integration

- [ ] Update frontend environment variables
  - [ ] Change `VITE_API_URL` in Vercel to use custom API domain
  - [ ] Redeploy frontend if necessary

- [ ] Test complete application flow
  - [ ] Verify frontend can communicate with backend
  - [ ] Test all major features (authentication, data fetching, etc.)
  - [ ] Test image uploads and other media functionality

## Final Verification

- [ ] Check mobile responsiveness
- [ ] Verify performance with tools like Lighthouse
- [ ] Test on different browsers
- [ ] Ensure all links use the custom domain (no references to Render/Vercel URLs)

## Documentation

- [ ] Update project documentation with new domain information
- [ ] Document any specific configuration details for future reference
- [ ] Save DNS configuration details securely

## Notes

- DNS propagation can take 24-48 hours to complete globally
- If you encounter issues, check the [CUSTOM_DOMAIN_GUIDE.md](./CUSTOM_DOMAIN_GUIDE.md) for troubleshooting tips
- For a visual representation of the DNS setup, refer to [DNS_CONFIGURATION.md](./DNS_CONFIGURATION.md)