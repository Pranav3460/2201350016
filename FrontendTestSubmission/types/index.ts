export interface ShortenRequest {
  url: string;
  shortcode?: string;
  validityMinutes?: number;
}

export interface UrlEntry {
  shortcode: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt: Date;
  clicks?: ClickEvent[];
}

export interface ClickEvent {
  timestamp: Date;
  referrer: string;
  country: string;
}
