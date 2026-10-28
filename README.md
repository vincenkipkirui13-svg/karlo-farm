# kalro farm website

Responsive livestock and farm-products catalogue matching the public reference website, including a photo-background hero, WhatsApp inquiries, the exact reference livestock/products and admin-managed photos.

## Admin
Open `/admin.html`. Login uses the Vercel environment variables `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Keep credentials private.

## Storage
The `BLOB_READ_WRITE_TOKEN` environment variable connects Vercel Blob. Catalogue changes are saved in `kalro-farm/site-data.json`; uploaded photos are stored in Blob and shared across devices.

## Photos
The hero background is managed from Admin > Photo gallery. Upload the hero image there; the headline, description and call/WhatsApp buttons stay overlaid on it. Product/livestock photos can also be managed from the admin page.
