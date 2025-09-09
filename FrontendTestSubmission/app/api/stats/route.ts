import { NextResponse } from 'next/server';
import { getAllUrls } from '@/lib/urlService';
import { Logger } from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const stats = await getAllUrls();
    const duration = Date.now() - startTime;
    
    Logger.info('stats.api', 'Stats retrieved successfully', {
      count: stats.length,
      duration,
    });

    return NextResponse.json(stats);
  } catch (error) {
    const duration = Date.now() - startTime;
    Logger.error('stats.api', 'Error retrieving stats', {
      error: error instanceof Error ? error.message : String(error),
      duration,
    });

    return NextResponse.json(
      { error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
}
