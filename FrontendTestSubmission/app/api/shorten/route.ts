import { NextResponse } from 'next/server';
import { shortenUrls } from '@/lib/urlService';
import { Logger } from '@/lib/logger';
import { ShortenRequest } from '@/types';

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const urls: ShortenRequest[] = Array.isArray(body) ? body : [body];
    
    if (urls.length > 5) {
      Logger.error('shorten.api', 'Too many URLs requested', { count: urls.length });
      return NextResponse.json(
        { error: 'Maximum 5 URLs can be shortened at once' },
        { status: 400 }
      );
    }

    const results = await shortenUrls(urls);
    const duration = Date.now() - startTime;
    
    Logger.info('shorten.api', 'URLs shortened successfully', {
      count: results.length,
      duration,
    });

    return NextResponse.json(results);
  } catch (error) {
    const duration = Date.now() - startTime;
    Logger.error('shorten.api', 'Error processing shorten request', {
      error: error instanceof Error ? error.message : String(error),
      duration,
    });

    return NextResponse.json(
      { error: 'Failed to shorten URLs' },
      { status: 500 }
    );
  }
}
