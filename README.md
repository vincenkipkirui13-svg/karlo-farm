# Kalro Farm website

Responsive farm marketplace website with livestock categories, poultry and fish, feeds, seeds and fertilizer, WhatsApp inquiries, secure admin login, and persistent Vercel Blob storage for catalogue data and photos.

## Admin
Open `/admin.html`. Access is protected by the Vercel environment variables `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Do not commit credentials to this repository.

## Storage
The `BLOB_READ_WRITE_TOKEN` environment variable is provided by the connected Vercel Blob store. Catalogue edits are stored in `kalro-farm/site-data.json`; uploaded photos are stored in Blob and shared across visitors/devices.

## Local development
Install dependencies with `npm install` and run with the Vercel CLI so the `/api` routes and Blob integration are available.
