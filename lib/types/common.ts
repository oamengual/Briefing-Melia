// Basic Enums & shared types
export type Region = 'AME' | 'APAC' | 'EMEA';

export interface Market {
  code: string;
  name: string;      // "US"
  selector: string;  // "US (Estados Unidos)"
  region: Region;
  defaultLang: string;
}

export type Format = 'img' | 'vid' | 'html5';
export type Channel = 'Google' | 'Amazon' | 'Tik Tok' | 'Meta' | 'Taboola' | 'Criteo RTG' | 'App' | 'Newsletter' | 'Web' | 'Paquetes' | 'YT / Demand Gen' | 'Expedia';

export interface Placement {
  id: string;
  name: string;
  size: string; // "300x250" - kept for display/legacy
  width: number;
  height: number;
  format: Format;
  channel: Channel | string; // Allow dynamic strings
  seconds: string | 'na';
  maxFileSize?: number; // KB
  outputFormats?: string[];
}

// The core matrix state: which placements are selected for which markets
export type MatrixState = Record<string, string[]>; // { "US": ["meta-feed", "tiktok"], "ES": ["meta-stories"] }
