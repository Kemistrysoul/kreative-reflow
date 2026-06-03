import { NextRequest } from 'next/server';
import { updatePortalSession } from '@/lib/portal-auth-proxy';

export async function proxy(request: NextRequest) {
  return updatePortalSession(request);
}

export const config = {
  matcher: ['/portal/:path*', '/studio/:path*', '/api/portal/:path*', '/auth/callback'],
};
