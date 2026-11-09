# Next.js App Router pharmacy example

This example is the canonical offline-first flow: insert a sale locally with `sincronizado = 0`, POST it when online, mark it synced on success, and retry on the next `online` event. The UI should call `db.exportSQLite()` for a downloadable backup.

The service-worker boundary belongs in `public/sw.js`; use `@serwist/next` in a deployed app to precache the app shell. Keep all `pbdb` calls in `'use client'` components because OPFS is browser-only.
