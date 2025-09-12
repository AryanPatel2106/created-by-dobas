# Deployment Guide for Created by Dobas

This guide provides step-by-step instructions for deploying the Created by Dobas application using:
- MongoDB Atlas (Database)
- Render (Backend)
- Vercel (Frontend)

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account
- Render account
- Vercel account
- (Optional) Hostinger account for custom domain

## 1. MongoDB Atlas Setup (Completed)

- MongoDB Atlas account has been created
- A free tier cluster has been created
- Database user with secure password has been set up
- Network access has been configured
- Connection string has been obtained and added to the backend .env file

## 2. Backend Deployment on Render

### Configuration Files (Already Created)

- `render.yaml`: Configures the Render deployment
- `Procfile`: Specifies the command to start the application
- Updated `package.json` files with proper scripts and dependencies
- Updated `server.js` for proper production deployment

### Deployment Steps

1. **Create a Render account** at https://render.com/

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the repository containing your project

3. **Configure the Web Service**:
   - **Name**: created-by-dobas (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: Leave empty (or specify `/` if needed)

4. **Set Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection string (from your .env file)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name (from your .env file)
   - `CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset (from your .env file)
   - `PORT`: `10000` (or any port Render allows)

5. **Deploy the service** and wait for the build to complete

## 3. Frontend Deployment on Vercel

### Configuration Files (Already Created)

- `vercel.json`: Configures the Vercel deployment with proper rewrites
- `.env.production`: Sets production environment variables
- Updated `api.js` utility to handle production URLs correctly

### Deployment Steps

1. **Create a Vercel account** at https://vercel.com/

2. **Import your GitHub repository** to Vercel

3. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables** in Vercel:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://created-by-dobas.onrender.com`)
   - `VITE_ADMIN_EMAIL`: `aryanpatel8082@gmail.com`

5. **Deploy** and wait for the build to complete

## 4. (Optional) Custom Domain Setup with Hostinger

1. **Purchase a domain** from Hostinger if you don't already have one

2. **Add your domain** in both Render and Vercel dashboards

3. **Configure DNS settings** in Hostinger:
   - For Render: Add a CNAME record pointing to your Render URL
   - For Vercel: Follow Vercel's DNS configuration instructions

4. **Verify domain ownership** if required

## Troubleshooting

### Common Issues with Render Deployment

- **Missing Dependencies**: If you encounter "Cannot find package" errors, check that all dependencies are properly listed in package.json
- **Environment Variables**: Ensure all required environment variables are set in the Render dashboard
- **Build Failures**: Check the build logs for specific errors

### Common Issues with Vercel Deployment

- **API Connection**: If the frontend can't connect to the backend, check the VITE_API_URL environment variable
- **Build Failures**: Check that the build command and output directory are correctly configured

## Maintenance

- **Updating the Application**: Push changes to your GitHub repository, and Render and Vercel will automatically rebuild and deploy
- **Monitoring**: Use the Render and Vercel dashboards to monitor your application's performance and logs