# Deployment Guide

This guide provides step-by-step instructions for deploying NeuroScan AI to various platforms.

## Table of Contents
- [GitHub Pages](#github-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Docker](#docker)
- [Self-Hosted](#self-hosted)

## GitHub Pages

GitHub Pages is ideal for static sites and is free for public repositories.

### Prerequisites
- Repository pushed to GitHub
- GitHub Actions enabled

### Steps

1. **Update vite.config.ts** (if deploying to a subdirectory):
   ```typescript
   export default defineConfig({
     base: '/neuroscan-ai/',  // Only if deploying to subdirectory
     plugins: [react()],
     // ... rest of config
   });
   ```

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The build workflow will automatically deploy to GitHub Pages

3. **Access your site**:
   - It will be available at `https://yourusername.github.io/neuroscan-ai`
   - Or on your custom domain if configured

### Custom Domain
1. In **Settings → Pages**, add your domain under "Custom domain"
2. Add CNAME record pointing to `yourusername.github.io`:
   ```
   CNAME yourdomain.com yourusername.github.io
   ```

---

## Vercel

Vercel is optimized for Next.js/React apps with amazing performance.

### Prerequisites
- Vercel account (free tier available)
- GitHub repository or Git provider connected

### Steps

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository to deploy

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**:
   - Add your `.env` variables in **Settings → Environment Variables**
   - Click "Deploy"

4. **Automatic Deployments**:
   - Every push to `main` will auto-deploy
   - Pull requests get preview URLs

### Access
- Your site: `https://your-project.vercel.app`
- Custom domain: Add in **Settings → Domains**

---

## Netlify

Netlify offers excellent developer experience and free tier.

### Prerequisites
- Netlify account (free tier available)
- GitHub repository connected

### Steps

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select the repository

2. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - Click "Deploy site"

3. **Environment Variables**:
   - Go to **Site settings → Build & deploy → Environment**
   - Add your variables (e.g., `VITE_API_BASE_URL`)

4. **Custom Domain**:
   - Go to **Site settings → Domain management**
   - Add your custom domain

### Automatic Deployments
- Main branch → Production
- Pull requests → Preview deployments
- Other branches → Deployments on demand

---

## Docker

Deploy using Docker containers for maximum flexibility.

### Prerequisites
- Docker installed locally and on your server
- Docker Hub account (for private images)

### Steps

1. **Create Dockerfile**:
   Create `Dockerfile` in project root:
   ```dockerfile
   # Build stage
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**:
   Create `nginx.conf` in project root:
   ```nginx
   server {
     listen 80;
     server_name _;
     root /usr/share/nginx/html;
     index index.html;

     location / {
       try_files $uri /index.html;
     }

     location ~* \.(js|css|png|jpg|jpeg|svg|gif|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

3. **Build Docker Image**:
   ```bash
   docker build -t neuroscan-ai:latest .
   ```

4. **Run Container**:
   ```bash
   docker run -p 80:80 neuroscan-ai:latest
   ```

5. **Push to Registry**:
   ```bash
   docker tag neuroscan-ai:latest yourusername/neuroscan-ai:latest
   docker push yourusername/neuroscan-ai:latest
   ```

---

## Self-Hosted

Deploy to your own server or VPS.

### Prerequisites
- Linux server (Ubuntu/Debian recommended)
- Node.js 18+ installed
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)

### Steps

1. **Setup Server**:
   ```bash
   # SSH into your server
   ssh user@your-server.com

   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js (if not already installed)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Nginx
   sudo apt install -y nginx
   ```

2. **Deploy Application**:
   ```bash
   # Clone repository
   cd /var/www
   git clone https://github.com/yourusername/neuroscan-ai.git
   cd neuroscan-ai

   # Install dependencies
   npm ci

   # Build production
   npm run build

   # Build artifacts are in ./dist
   ```

3. **Configure Nginx**:
   Create `/etc/nginx/sites-available/neuroscan-ai`:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     root /var/www/neuroscan-ai/dist;
     index index.html;

     location / {
       try_files $uri /index.html;
     }

     location ~* \.(js|css|png|jpg|jpeg|svg|gif|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

4. **Enable Site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/neuroscan-ai \
             /etc/nginx/sites-enabled/

   # Remove default
   sudo rm /etc/nginx/sites-enabled/default

   # Test configuration
   sudo nginx -t

   # Restart Nginx
   sudo systemctl restart nginx
   ```

5. **Setup SSL (Let's Encrypt)**:
   ```bash
   # Install Certbot
   sudo apt install -y certbot python3-certbot-nginx

   # Get certificate
   sudo certbot --nginx -d yourdomain.com

   # Auto-renewal
   sudo systemctl enable certbot.timer
   ```

6. **Setup Auto-Updates** (optional):
   Create `/usr/local/bin/deploy-neuroscan.sh`:
   ```bash
   #!/bin/bash
   cd /var/www/neuroscan-ai
   git pull origin main
   npm ci
   npm run build
   sudo systemctl restart nginx
   ```

   Add to crontab:
   ```bash
   sudo crontab -e
   # Add: 0 2 * * * /usr/local/bin/deploy-neuroscan.sh
   ```

---

## Environment Variables

For all deployment methods, ensure required environment variables are set:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

Update this to point to your backend API endpoint.

---

## Performance Optimization

### Enable Gzip Compression
Most platforms handle this automatically. For self-hosted with Nginx:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Cache Busting
The build process automatically adds hashes to filenames, enabling long-term caching of assets.

### CDN Integration
For maximum performance, add a CDN like Cloudflare or AWS CloudFront in front of your site.

---

## Monitoring & Logging

### Error Tracking
Add Sentry or similar service:
```env
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### Uptime Monitoring
Use services like UptimeRobot or Pingdom to monitor your site's availability.

---

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Clear cache: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Blank Page After Deploy
- Check browser console for errors
- Verify `VITE_API_BASE_URL` environment variable
- Ensure backend API is accessible

### Performance Issues
- Check bundle size: `npm analyze`
- Enable caching headers on static assets
- Use a CDN for better global performance

---

## Support

For deployment issues:
1. Check the logs in your deployment platform
2. Review environment variables are set correctly
3. Ensure you're on the latest version
4. Open an issue on GitHub with error details
