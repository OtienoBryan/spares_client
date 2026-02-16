# Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Backend API deployed and accessible

## Environment Variables

### Required Environment Variables
Set these in your Vercel dashboard under Project Settings > Environment Variables:

- `VITE_API_BASE_URL`: Your backend API URL (optional - defaults to `/api` for Vercel proxy)

**Note**: The current configuration uses Vercel's proxy feature to forward `/api/*` requests to your backend server at `http://143.110.191.116:3008/api/*`. This solves the Mixed Content issue by handling HTTP requests server-side.

### Local Development
Create a `.env.local` file in the client directory:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the client directory: `cd client`
3. Run: `vercel`
4. Follow the prompts to link your project
5. Set environment variables when prompted

### Option 2: Deploy via Vercel Dashboard
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Set the following in Vercel dashboard:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variables in Project Settings

## Build Configuration

The project is configured with:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x (recommended)

## Performance Optimizations

The build includes:
- Code splitting and chunk optimization
- Asset optimization and caching
- Tree shaking for smaller bundle sizes
- Source maps disabled in production
- Console logs removed in production

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (use 18+)
2. **API calls fail (502 errors or Mixed Content errors)**: 
   - Verify backend server is running at `143.110.191.116:3008`
   - Check if server allows external connections
   - The Vercel proxy function handles HTTP requests server-side
   - Check Vercel function logs for detailed error information
3. **Assets not loading**: Check that `vercel.json` is in the root of the client folder
4. **JSX/TypeScript errors**: Ensure all React component files use `.tsx` extension
5. **Terser minification errors**: Run `npm install terser --save-dev` if missing
6. **CORS errors**: Backend server needs to allow requests from your Vercel domain

### Build Commands:
- `npm run build` - Production build
- `npm run build:dev` - Development build with source maps
- `npm run preview` - Preview production build locally
