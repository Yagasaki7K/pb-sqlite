import { NextResponse } from 'next/server';

const serviceWorker = `
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
`;

export function GET() {
  return new NextResponse(serviceWorker.trim(), {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  });
}
