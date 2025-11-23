# Parking System - Full Stack Application

A production-ready parking management system built with Next.js, Express, Prisma, and PostgreSQL. Deploy to Vercel with a custom domain in minutes.

## Features

- Real-time parking spot availability tracking
- User management system with password hashing
- Check-in/check-out functionality for parking visits
- Admin dashboard for user and spot management
- Responsive UI with Tailwind CSS and shadcn components
- Full REST API with Express backend
- Type-safe database queries with Prisma ORM
- Automatic database migrations on deployment
- Production-ready Vercel configuration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Express, Node.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS, shadcn/ui components
- **Deployment**: Vercel
- **Authentication**: bcryptjs for password hashing

## Project Structure

\`\`\`
parking-system/
├── app/                          # Next.js frontend
│   ├── page.tsx                 # Home page - parking spots list
│   ├── dashboard/               # Admin dashboard
│   │   └── page.tsx            # User management
│   └── layout.tsx              # Root layout
├── backend/                      # Express API server
│   ├── routes/
│   │   ├── users.ts            # User CRUD endpoints
│   │   ├── parking.ts          # Parking spot endpoints
│   │   └── visits.ts           # Visit tracking endpoints
│   └── server.ts               # Express server entry
├── prisma/
│   └── schema.prisma           # Database schema
├── scripts/
│   ├── build.ts                # Vercel build script
│   ├── run-migrations.ts       # Database migration runner
│   └── test-db.ts              # Database connection test
├── components/ui/              # shadcn UI components (auto-generated)
├── vercel.json                 # Vercel configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
└── tailwind.config.ts          # Tailwind configuration
\`\`\`

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or pnpm

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/parking-system.git
cd parking-system
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.production .env.local
# Edit .env.local with your database credentials
# Format: postgresql://username:password@localhost:5432/parking_db
\`\`\`

4. Generate Prisma Client
\`\`\`bash
npx prisma generate
\`\`\`

5. Run database migrations
\`\`\`bash
npm run migrate
\`\`\`

6. Start development server
\`\`\`bash
npm run dev
\`\`\`

The app runs on:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Parking Spots
- `GET /api/parking` - Get all spots
- `GET /api/parking/available` - Get available spots
- `GET /api/parking/:id` - Get single spot
- `POST /api/parking` - Create spot
- `PATCH /api/parking/:id/book` - Book spot
- `PATCH /api/parking/:id/release` - Release spot

### Visits
- `GET /api/visits` - Get all visits
- `GET /api/visits/spot/:spotId` - Get spot visits
- `POST /api/visits/check-in` - Check in
- `PATCH /api/visits/:id/check-out` - Check out

## Database Schema

### User
\`\`\`sql
id: Int (primary key)
name: String
email: String (unique)
password: String (hashed)
createdAt: DateTime
parkingSpots: ParkingSpot[]
\`\`\`

### ParkingSpot
\`\`\`sql
id: Int (primary key)
spotCode: String (unique)
isBusy: Boolean
userId: Int? (foreign key)
createdAt: DateTime
visits: ParkingVisit[]
\`\`\`

### ParkingVisit
\`\`\`sql
id: Int (primary key)
spotId: Int (foreign key)
checkIn: DateTime
checkOut: DateTime?
spot: ParkingSpot
\`\`\`

## Deployment to Vercel

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### Quick Deploy
1. Push to GitHub
2. Connect repository in Vercel dashboard
3. Add `DATABASE_URL` environment variable
4. Deploy!

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production" on Vercel

### Optional
- `NEXT_PUBLIC_API_URL` - Frontend API URL (defaults to current domain)
- `PORT` - Express server port (defaults to 3000)

## Scripts

\`\`\`bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run migrate          # Run database migrations
npm run test-db          # Test database connection
npm run server           # Run Express server only
npm run generate-prisma  # Generate Prisma Client
\`\`\`

## Development Tips

### Database Debugging
\`\`\`bash
# View database schema
npx prisma studio

# Generate new migration
npx prisma migrate dev --name your_migration_name

# View all migrations
npx prisma migrate status
\`\`\`

### API Testing
\`\`\`bash
# Test health endpoint
curl http://localhost:3000/api/health

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
\`\`\`

## Troubleshooting

### Build fails with "DATABASE_URL not found"
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Check that it's set for all environments (Production, Preview, Development)

### 502 Bad Gateway on Vercel
- Verify database is accessible from Vercel
- Check connection string format
- Review server logs in Vercel dashboard

### Prisma Client errors
- Run `npx prisma generate` locally
- Commit generated files to git
- Ensure `.prisma` folder is not in .gitignore

### Migration fails
- Verify database user has CREATE TABLE permissions
- Check connection string with `npm run test-db`
- Ensure no other process is modifying the database

## Performance Optimization

- Next.js automatically optimizes images and code splitting
- Express API uses connection pooling
- Prisma client caching reduces database queries
- Vercel Edge Network caches static assets globally

## Security Considerations

- Passwords are hashed with bcryptjs (10 rounds)
- Environment variables stored securely in Vercel
- CORS headers configured for API access
- SQL injection prevented by Prisma parameterized queries
- Enable rate limiting on production (can use Vercel middleware)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Push to GitHub
5. Submit a pull request

## License

MIT

## Support

- View logs: Vercel Dashboard > Deployments
- Database support: Contact your provider
- Questions: Open an issue on GitHub

---

**Ready to deploy? Follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
\`\`\`

```typescript file="" isHidden
