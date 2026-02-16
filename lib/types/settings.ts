import { Brand } from './brand';

export type NamingToken =
    | 'size'
    | 'format'
    | 'strategy'
    | 'year'
    | 'month'
    | 'brand'
    | 'channel'
    | 'campaign_name'
    | 'market_code'
    | 'language'
    | 'agency'
    | 'content_type'
    | 'duration'
    | 'version'
    | 'separator'; // '-' or '_'

export interface NamingConvention {
    id: string;
    name: string;
    structure: NamingToken[];
    separator: string; // '-', '_', ''
}

// Design Specs
export type AnchorPoint = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface DesignSpec {
    placementId: string; // Key to PLACEMENTS
    border?: {
        enabled: boolean;
        width: number; // px
        color: string; // hex
        position: 'inside' | 'outside' | 'center'; // Usually 'inside' for banners
    };
    logo?: {
        enabled: boolean;
        width: number; // px
        anchor: AnchorPoint;
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
    };
}

export interface Settings {
    appLanguage: string;
    workspaceName: string;
    geminiApiKey?: string;
    // New fields
    defaultAgency?: string;
    defaultBrands?: string[]; // Deprecated, use brands
    brands?: Brand[];
    defaultCampaignLanguage?: string;
    // Naming Convention
    activeNamingConvention?: NamingConvention;
    namingTemplates?: NamingConvention[];
    // Design Specs
    designSpecs?: DesignSpec[];

    // Dynamic Placements
    placements?: any[]; // Placement[] - circular dep workaround if needed, but imported types usually work. let's use Placement[] if possible or local.
    channelConfigs?: ChannelConfig[];
}

export interface ChannelConfig {
    channel: string;
    defaultFormat: 'img' | 'vid' | 'html5';
    defaultMaxFileSize?: number; // KB
    defaultOutputFormats?: string[];
}
