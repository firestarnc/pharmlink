# PharmaLink Lagos

Admin-led pharmacist talent matching platform for Lagos.

PharmaLink connects pharmacists to vetted opportunities and locum shifts while giving admins a centralized workflow for verification, matching, payments tracking, and notifications.

## Core Features

- Pharmacist account signup and login (credentials), plus Google OAuth support.
- Role-based dashboards for `ADMIN` and `PHARMACIST` users.
- Pharmacist onboarding profile with:
	- professional category and job preferences
	- salary and location preferences
	- CV and license document uploads
	- verification workflow (`DRAFT`, `SUBMITTED`, `VERIFIED`, `REJECTED`)
- Admin operations:
	- verify or reject pharmacist profiles
	- create and manage opportunities
	- create and manage locum shifts
	- create and track matches
	- monitor payment records and due items
- In-app notifications for profile and workflow events.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- NextAuth (credentials + Google)
- Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- Zod validation

## Prerequisites

- Node.js 20+
- PostgreSQL database
- npm (or your preferred package manager)

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Create your environment file.

```bash
cp .env.example .env
```

If `.env.example` does not exist yet, create `.env` manually using the variables listed below.

3. Run database migrations.

```bash
npm run db:migrate
```

4. Generate Prisma client.

```bash
npm run db:generate
```

5. Seed admin user.

```bash
npm run db:seed
```

6. Start development server.

```bash
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

NEXTAUTH_SECRET="replace-with-strong-random-secret"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

SEED_ADMIN_EMAIL="admin@pharmalink.ng"
SEED_ADMIN_PASSWORD="AdminPass123!"
```

Notes:
- `DATABASE_URL` is required by Prisma and app runtime.
- `NEXTAUTH_SECRET` is required for NextAuth JWT sessions.
- Google values are optional unless using OAuth login.
- Seed values are optional and have defaults.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run db:migrate` - apply/create development migrations
- `npm run db:generate` - generate Prisma client
- `npm run db:seed` - seed admin account

## Default Seed Admin

After `npm run db:seed`, an admin account is created (or updated):

- Email: `admin@pharmalink.ng` (or `SEED_ADMIN_EMAIL`)
- Password: `AdminPass123!` (or `SEED_ADMIN_PASSWORD`)

Change these values in your `.env` for non-local environments.

## Project Structure

High-level layout:

- `src/app` - App Router pages and API routes
- `src/components` - UI and feature components (admin, auth, pharmacist, home)
- `src/lib` - auth, db, session, notifications utilities
- `prisma` - schema, migrations, and seed script
- `src/generated/prisma` - generated Prisma client output
- `public/uploads` - runtime upload target for CV/license files

## Main Routes

- `/` - landing page
- `/signup` - pharmacist signup
- `/login` - login page
- `/pharmacist/onboarding` - profile completion and document uploads
- `/pharmacist/dashboard` - verification status, matches, open shifts
- `/locum/shifts` - locum shifts listing
- `/admin/dashboard` - admin operations overview
- `/admin/pharmacists` - profile verification
- `/admin/opportunities` - opportunity management
- `/admin/matches` - match management
- `/admin/locum-shifts` - shift management
- `/admin/payments` - payment ledger

## API Surface (Selected)

- `POST /api/signup` - create pharmacist account
- `POST /api/pharmacist/profile` - submit/update pharmacist profile
- `POST /api/pharmacist/upload` - upload CV/license files
- `POST /api/locum/apply` - apply to locum shift
- `GET/POST /api/admin/opportunities` - list/create opportunities
- `GET/POST /api/admin/locum-shifts` - list/create shifts
- `GET/POST /api/admin/matches` - list/create matches and updates
- `GET/POST /api/admin/payments` - payment records
- `POST /api/admin/verify` - verify or reject pharmacist profile
- `GET /api/notifications` - user notifications

## File Upload Behavior

- Accepted formats: PDF, DOC, DOCX, JPG, PNG
- Max file size: 5 MB
- Files are saved locally under `public/uploads/<userId>/...`

If deploying to an ephemeral filesystem, switch to object storage (for example S3-compatible storage) before production.

## Production Notes

- Use a persistent PostgreSQL instance.
- Set a strong `NEXTAUTH_SECRET`.
- Configure `NEXTAUTH_URL` if required by your hosting setup.
- Persist uploaded files using external storage.
- Review access control and audit logs for admin actions.

## License

Proprietary/internal project unless a separate license file is added.
