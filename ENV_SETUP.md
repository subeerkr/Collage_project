# Environment Variables Setup Guide

## Required: Create `.env.local` file

Create a `.env.local` file in the root directory of your project with the following variables:

```env
# MongoDB Connection String
# IMPORTANT: Add database name after the / (e.g., /rushnow)
MONGODB_URI="mongodb+srv://subeerk491_db_user:eEzHDOhwdCYAUmjA@cluster1.p9doqoe.mongodb.net/rushnow?retryWrites=true&w=majority"

# Optional: Database name (if not specified in connection string)
MONGODB_DB_NAME="rushnow"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Important Notes:

1. **MongoDB URI Format**: Your connection string should include the database name:
   - ✅ Correct: `mongodb+srv://...@cluster.mongodb.net/rushnow?retryWrites=true&w=majority`
   - ❌ Wrong: `mongodb+srv://...@cluster.mongodb.net/?retryWrites=true&w=majority`

2. **Generate NEXTAUTH_SECRET**:

   ```bash
   openssl rand -base64 32
   ```

3. **After creating `.env.local`**:
   - Restart your Next.js development server
   - The file is automatically ignored by git (already in .gitignore)

## Testing Database Connection

Visit: `http://localhost:3000/api/database`

You should see a JSON response with connection status and database information.

## Firebase (client) — Vercel setup

This project reads Firebase config from `NEXT_PUBLIC_` environment variables so the client can access them when deployed on Vercel.

Set these variables in your Vercel project (or in `.env.local` for local dev):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

- For Vercel: go to the project Settings → Environment Variables and add the keys above for `Production` (and `Preview` if needed).
- For local development: add the same keys to `.env.local` in the project root and restart the dev server.

Additionally, add your Vercel domains (e.g., `your-app.vercel.app` and your custom domain) to Firebase Console → Authentication → Authorized domains so Google sign-in works from Vercel.
