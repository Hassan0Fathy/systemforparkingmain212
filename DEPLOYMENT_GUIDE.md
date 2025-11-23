# Parking System Deployment Guide

This is a complete step-by-step guide to deploy your full-stack parking system on Vercel with a custom domain.

## Project Structure

\`\`\`
parking-system/
├── app/                      # Next.js frontend
│   ├── page.tsx             # Home page with parking spots
│   ├── dashboard/           # Admin dashboard
│   └── layout.tsx           # Root layout
├── backend/                 # Express API
│   ├── routes/
│   │   ├── users.ts        # User CRUD endpoints
│   │   ├── parking.ts      # Parking spot endpoints
│   │   └── visits.ts       # Visit tracking endpoints
│   └── server.ts           # Express server
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   ├── build.ts            # Build script for Vercel
│   └── run-migrations.ts   # Database migrations
├── vercel.json             # Vercel configuration
├── package.json            # Project dependencies
└── .env.production         # Production environment variables
\`\`\`

## Prerequisites

- PostgreSQL database (Vercel Postgres, Supabase, AWS RDS, etc.)
- GitHub account with repository
- Vercel account
- Custom domain (optional)

## Step 1: Database Setup

### Option A: Using Vercel Postgres (Recommended)
1. Go to [Vercel Postgres](https://vercel.com/storage/postgres)
2. Create a new database
3. Copy the connection string (will be provided in Vercel dashboard)
4. Store it safely for Step 3

### Option B: Using Supabase
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Find the PostgreSQL connection string in project settings
4. Use the connection string format: \`postgresql://user:password@host:5432/db\`

### Option C: Using External Database
- AWS RDS PostgreSQL
- DigitalOcean Managed Databases
- Any PostgreSQL provider

## Step 2: Prepare Your Repository

1. Initialize git and push to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit: Full-stack parking system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/parking-system.git
git push -u origin main
\`\`\`

2. Ensure these files exist:
   - \`vercel.json\` - Routing configuration
   - \`package.json\` - Dependencies and scripts
   - \`prisma/schema.prisma\` - Database schema
   - \`.env.production\` - Production variables template
   - \`.gitignore\` - Excludes node_modules, .env files

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste your GitHub repository URL
5. Click "Import"

### 3.2 Configure Environment Variables
1. In the Vercel project settings, go to "Environment Variables"
2. Add the following variables:

\`\`\`
DATABASE_URL = postgresql://user:password@host:port/database
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://yourdomain.com
\`\`\`

3. **Important**: Make sure \`DATABASE_URL\` is set for all environments (Production, Preview, Development)

### 3.3 Deploy
1. Click "Deploy" button
2. Wait for the build to complete (2-5 minutes)
3. You'll get a Vercel URL like \`https://parking-system.vercel.app\`

## Step 4: Connect Custom Domain

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., \`parking.yourcompany.com\`)
4. Choose DNS provider:
   - **Nameserver**: Update your domain registrar's nameservers
   - **CNAME**: Create CNAME record pointing to Vercel
   - **A Record**: Create A record pointing to Vercel's IP

### Example: Adding Domain with Namecheap
1. Go to Vercel domain settings and copy the nameservers
2. In Namecheap, go to "Manage" for your domain
3. Under "Nameservers", select "Custom nameservers"
4. Paste the Vercel nameservers
5. Save (can take 5-30 minutes to propagate)

## Step 5: Test Your Deployment

### 5.1 Test Frontend
- Navigate to your Vercel URL or custom domain
- You should see the parking management home page
- Check that parking spots load correctly

### 5.2 Test API Endpoints
\`\`\`bash
# Health check
curl https://yourdomain.com/api/health

# Get all parking spots
curl https://yourdomain.com/api/parking

# Get all users
curl https://yourdomain.com/api/users
\`\`\`

### 5.3 Test Database Connection
- Create a test user through the dashboard
- Verify it appears in the database

## Step 6: Set Up SSL Certificate

Vercel automatically provisions free SSL certificates. Your site will be accessible via:
- \`https://yourdomain.com\` (custom domain)
- \`https://parking-system.vercel.app\` (Vercel URL)

## Troubleshooting

### Build Fails with "Database Connection Error"
**Solution**: Ensure \`DATABASE_URL\` environment variable is set in Vercel dashboard before deploying.

### 502 Bad Gateway Error
**Solution**: Check that:
1. Database is running and accessible
2. Connection string is correct
3. Database has migration tables created
4. Express server started successfully

### Prisma Client Not Found
**Solution**: The build script automatically runs \`prisma generate\`. If it fails:
\`\`\`bash
npx prisma generate
git add prisma/.prisma
git commit -m "Add generated Prisma client"
git push
\`\`\`

### API Calls Return 404
**Solution**: Verify in \`vercel.json\` that:
- Routes starting with \`/api/\` point to \`/src/server.ts\`
- All other routes point to Next.js (\`/\`)

### Custom Domain Not Working
**Solution**:
1. Check DNS propagation: \`nslookup yourdomain.com\`
2. Wait 24-48 hours for full propagation
3. Clear browser cache and try incognito window
4. Contact Vercel support if issue persists

## Production Checklist

- [ ] Database is PostgreSQL (production-grade)
- [ ] \`DATABASE_URL\` environment variable is set
- [ ] \`.env.production\` file is NOT committed (add to .gitignore)
- [ ] SSL certificate is active (https://)
- [ ] Custom domain is connected
- [ ] Verified API endpoints respond correctly
- [ ] Database backups are configured
- [ ] Error logging is set up (optional but recommended)
- [ ] Rate limiting is configured (optional)

## Monitoring & Maintenance

### View Logs
\`\`\`bash
# In Vercel dashboard, go to Deployments > Select Deployment > Logs
\`\`\`

### Update Code
\`\`\`bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys on push
\`\`\`

### Database Backups
- Set up automatic backups through your database provider
- Store connection credentials securely
- Test restore procedures monthly

## Performance Optimization

### For Production:
1. Enable Vercel Analytics in project settings
2. Set up error tracking (Sentry integration available)
3. Configure Redis caching if needed
4. Set up database query caching

### CDN & Caching
- Vercel automatically caches static assets
- Configure cache headers in \`next.config.mjs\`
- Images cached globally via Vercel Edge Network

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com)
- Vercel Support: support@vercel.com

---

**Your parking system is now live and production-ready!**
\`\`\`
