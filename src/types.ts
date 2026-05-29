export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  lastVisitTime: number;
  visitCount: number;
  typedCount: number;
  hostname: string;
  domain: string;
  domainWithoutSuffix: string;
  isBlurred?: boolean;
}

export interface SiteGroup {
  domain: string;
  domainWithoutSuffix: string;
  visits: HistoryItem[];
  customName?: string;
  customLogo?: string;
}

export interface DayGroup {
  dateStr: string; // e.g., "2026-05-29"
  timestamp: number;
  sites: SiteGroup[];
}

export interface CustomSiteData {
  domain: string;
  customName?: string;
  customLogo?: string;
}

export interface PrivacyData {
  url: string;
  isBlurred: boolean;
}
