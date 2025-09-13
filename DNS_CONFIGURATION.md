# DNS Configuration Diagram for Custom Domain Setup

## Overview

This document provides a visual representation of how DNS records should be configured to connect your custom domain from Hostinger to your Render backend and Vercel frontend.

## DNS Configuration Diagram

```
+---------------------+            +-------------------------+
|                     |            |                         |
|  Hostinger DNS      |            |  Your Custom Domain     |
|  Management         |            |                         |
|                     |            |                         |
+----------+----------+            +-----------+-------------+
           |                                   |
           |                                   |
           v                                   v
+----------+----------+            +-----------+-------------+
|                     |            |                         |
|  DNS Records        +----------->+  yourdomain.com         +-------+
|                     |            |  (Root Domain)          |       |
|                     |            |                         |       |
+---------------------+            +-------------------------+       |
                                                                     |
                                                                     |
+---------------------+            +-------------------------+       |
|                     |            |                         |       |
|  A Record           +----------->+  @ -> 76.76.21.21      +-------+
|  (Root Domain)      |            |  (Vercel Frontend)     |       |
|                     |            |                         |       |
+---------------------+            +-------------------------+       |
                                                                     |
                                                                     |
+---------------------+            +-------------------------+       |
|                     |            |                         |       |
|  CNAME Record       +----------->+  www -> cname.vercel-   +-------+
|  (WWW Subdomain)    |            |  dns.com               |       |
|                     |            |  (Vercel Frontend)     |       |
+---------------------+            +-------------------------+       |
                                                                     |
                                                                     |
+---------------------+            +-------------------------+       |
|                     |            |                         |       |
|  CNAME Record       +----------->+  api -> created-by-     +-------+
|  (API Subdomain)    |            |  dobas.onrender.com    |       |
|                     |            |  (Render Backend)      |       |
+---------------------+            +-------------------------+       |
                                                                     |
                                                                     |
                                                                     |
                                                                     v
                                   +-------------------------+       |
                                   |                         |       |
                                   |  User's Browser         |<------+
                                   |                         |
                                   +------------+------------+
                                                |
                                                |
                                                v
                      +------------------------------------------------+
                      |                                                |
                      |  Frontend requests to API are proxied through  |
                      |  Vercel to api.yourdomain.com or               |
                      |  created-by-dobas.onrender.com                 |
                      |                                                |
                      +------------------------------------------------+
```

## Explanation

1. **Root Domain (yourdomain.com)**:
   - Points to Vercel's IP address (76.76.21.21) via an A record
   - Hosts your frontend application

2. **WWW Subdomain (www.yourdomain.com)**:
   - Points to Vercel via a CNAME record
   - Alternative way to access your frontend

3. **API Subdomain (api.yourdomain.com)**:
   - Points to your Render backend via a CNAME record
   - Hosts your backend API

4. **User Flow**:
   - Users access your site via yourdomain.com or www.yourdomain.com
   - Frontend makes API requests to api.yourdomain.com
   - Vercel handles frontend requests, Render handles API requests

## Important Notes

- The diagram shows the recommended setup with separate subdomains for frontend and backend
- You can alternatively use the root domain for your API and www subdomain for frontend
- DNS propagation may take 24-48 hours to complete globally
- Ensure SSL certificates are properly configured on both services

For detailed setup instructions, refer to the [CUSTOM_DOMAIN_GUIDE.md](./CUSTOM_DOMAIN_GUIDE.md) file.