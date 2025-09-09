import { store } from './store';
import { Logger } from './logger';
import { ShortenRequest, UrlEntry, ClickEvent } from '@/types';

const SHORTCODE_PATTERN = /^[a-zA-Z0-9]{4,12}$/;

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateShortcode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6;
  let shortcode: string;
  
  do {
    shortcode = Array.from(
      { length }, 
      () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  } while (store.hasShortcode(shortcode));
  
  return shortcode;
}

export function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

export async function shortenUrls(requests: ShortenRequest[]): Promise<UrlEntry[]> {
  const results: UrlEntry[] = [];

  for (const request of requests) {
    if (!isValidUrl(request.url)) {
      throw new Error(`Invalid URL: ${request.url}`);
    }

    if (request.shortcode && !SHORTCODE_PATTERN.test(request.shortcode)) {
      throw new Error(`Invalid shortcode format: ${request.shortcode}`);
    }

    const shortcode = request.shortcode || generateShortcode();
    if (store.hasShortcode(shortcode)) {
      throw new Error(`Shortcode already exists: ${shortcode}`);
    }

    const validityMinutes = request.validityMinutes || 30;
    if (!Number.isInteger(validityMinutes) || validityMinutes < 1) {
      throw new Error(`Invalid validity minutes: ${validityMinutes}`);
    }

    const entry: UrlEntry = {
      shortcode,
      originalUrl: request.url,
      createdAt: new Date(),
      expiresAt: minutesFromNow(validityMinutes)
    };

    store.addUrl(entry);
    results.push(entry);

    Logger.info('urlService', 'URL shortened', {
      shortcode,
      originalUrl: request.url,
      validityMinutes
    });
  }

  return results;
}

export function recordClick(shortcode: string, referrer: string | null, country: string): void {
  const click: ClickEvent = {
    timestamp: new Date(),
    referrer: referrer || 'Direct',
    country: country || 'Unknown'
  };

  store.addClick(shortcode, click);
  Logger.info('urlService', 'URL accessed', {
    shortcode,
    referrer: click.referrer,
    country: click.country
  });
}

export function getAllUrls(): UrlEntry[] {
  return store.getAllUrls().map(url => ({
    ...url,
    clicks: store.getUrlClicks(url.shortcode)
  }));
}
