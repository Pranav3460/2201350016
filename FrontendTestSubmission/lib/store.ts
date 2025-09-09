import { UrlEntry, ClickEvent } from '@/types';

class Store {
  private urls: Map<string, UrlEntry> = new Map();
  private clicks: Map<string, ClickEvent[]> = new Map();

  addUrl(entry: UrlEntry): void {
    this.urls.set(entry.shortcode, entry);
    this.clicks.set(entry.shortcode, []);
  }

  getUrl(shortcode: string): UrlEntry | undefined {
    return this.urls.get(shortcode);
  }

  addClick(shortcode: string, click: ClickEvent): void {
    const clicks = this.clicks.get(shortcode) || [];
    clicks.push(click);
    this.clicks.set(shortcode, clicks);
  }

  getAllUrls(): UrlEntry[] {
    return Array.from(this.urls.values());
  }

  getUrlClicks(shortcode: string): ClickEvent[] {
    return this.clicks.get(shortcode) || [];
  }

  hasShortcode(shortcode: string): boolean {
    return this.urls.has(shortcode);
  }
}

// Export a singleton instance
export const store = new Store();
