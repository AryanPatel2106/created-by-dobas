# Custom Domain Setup Guide for Created by Dobas

This guide provides detailed instructions for setting up a custom domain from Hostinger with your Render backend and Vercel frontend deployments.

## Prerequisites

- A domain purchased from Hostinger
- Successfully deployed backend on Render
- Successfully deployed frontend on Vercel

## 1. Accessing Hostinger DNS Settings

1. **Log in to your Hostinger account** at https://www.hostinger.com/

2. **Navigate to your domain**:
   - Go to "Domains" in the sidebar
   - Select your domain name

3. **Access DNS settings**:
   - Click on "DNS / Nameservers"
   - Select "DNS Records" tab

## 2. Setting Up DNS for Render Backend (API)

### Option 1: Using a Subdomain for Your API (Recommended)

To set up `api.yourdomain.com` pointing to your Render backend:

1. **Add a CNAME record**:
   - **Type**: CNAME
   - **Name**: api
   - **Points to**: Your Render URL (e.g., `created-by-dobas.onrender.com`)
   - **TTL**: 14400 (or recommended value)

2. **Configure the custom domain in Render**:
   - Go to your Render dashboard
   - Select your web service
   - Navigate to "Settings" > "Custom Domains"
   - Click "Add Custom Domain"
   - Enter `api.yourdomain.com`
   - Follow verification steps if required

### Option 2: Using a Root Domain for Your API

If you prefer to use your root domain (`yourdomain.com`) for your API:

1. **Add an A record**:
   - **Type**: A
   - **Name**: @ (or leave empty)
   - **Value**: IP address provided by Render
   - **TTL**: 14400 (or recommended value)

2. **Configure the custom domain in Render** as described above, using your root domain.

## 3. Setting Up DNS for Vercel Frontend

### Option 1: Using a Subdomain for Your Frontend

To set up `www.yourdomain.com` pointing to your Vercel frontend:

1. **Add a CNAME record**:
   - **Type**: CNAME
   - **Name**: www
   - **Points to**: `cname.vercel-dns.com`
   - **TTL**: 14400 (or recommended value)

### Option 2: Using a Root Domain for Your Frontend (Recommended)

To use your root domain (`yourdomain.com`) for your frontend:

1. **Add an A record**:
   - **Type**: A
   - **Name**: @ (or leave empty)
   - **Value**: `76.76.21.21` (Vercel's IP address)
   - **TTL**: 14400 (or recommended value)

2. **Add an AAAA record** (for IPv6 support):
   - **Type**: AAAA
   - **Name**: @ (or leave empty)
   - **Value**: `2606:4700:20::681a:be7` (Vercel's IPv6 address)
   - **TTL**: 14400 (or recommended value)

3. **Configure the custom domain in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Navigate to "Settings" > "Domains"
   - Click "Add Domain"
   - Enter your domain name
   - Follow verification steps if required

## 4. Verifying Domain Setup

1. **Check DNS propagation**:
   - DNS changes can take up to 48 hours to propagate globally
   - You can check propagation status using tools like [dnschecker.org](https://dnschecker.org/)

2. **Test your domain**:
   - Visit your domain in a browser
   - Test API endpoints through your custom domain

## 5. Updating Frontend Configuration

After setting up your custom domain, you'll need to update your frontend to use the new API domain:

1. **Update environment variables in Vercel**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Update `VITE_API_URL` to your API domain (e.g., `https://api.yourdomain.com` or `https://yourdomain.com`)

2. **Redeploy your frontend**:
   - Trigger a new deployment in Vercel to apply the changes

## Troubleshooting

### Common DNS Issues

- **DNS Not Propagating**: Wait at least 24-48 hours for changes to take effect globally
- **Certificate Errors**: Ensure SSL is properly configured on both Render and Vercel
- **404 Errors**: Check that your domain is correctly pointing to the right service

### Vercel-Specific Issues

- **Domain Verification**: Follow Vercel's domain verification process if required
- **Deployment Errors**: Check Vercel's deployment logs for specific errors

### Render-Specific Issues

- **Custom Domain Not Working**: Verify your CNAME record is correctly set up
- **SSL Certificate Issues**: Render automatically provisions SSL certificates, but they may take time to issue

## Additional Resources

- [Hostinger DNS Management Documentation](https://support.hostinger.com/en/articles/1583227-how-to-manage-dns-records)
- [Vercel Custom Domain Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Render Custom Domain Documentation](https://render.com/docs/custom-domains)