import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Logger } from './lib/logger';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const requestId = uuidv4();
  const startTime = Date.now();

  // Log the request
  Logger.info('middleware', 'Incoming request', {
    path: request.nextUrl.pathname,
    method: request.method,
    requestId
  });

  // Clone the response and add the requestId header
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // Log the response time after the request completes
  const duration = Date.now() - startTime;
  Logger.info('middleware', 'Request completed', {
    path: request.nextUrl.pathname,
    method: request.method,
    requestId,
    duration
  });

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/shortener',
    '/stats',
    '/:shortcode*'
  ]
};
