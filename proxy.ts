import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/start';

  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: '/',
};
