import { MatrixState } from './common';
import { NamingConvention } from './settings';
import { EditorState } from './editor';

export interface CampaignInputs {
    campaignName: string;
    brand: string;
    strategy: string;
    year: string;
    month: string;
    agency: string;
    regions: string[];
    activationDate?: string;
    deliveryDate?: string;

    defaultLanguage?: string; // 'en', 'es', etc.
    // Moved from CreativeInputs
    startDate?: string;
    endDate?: string;

    // Detailed Fields
    marketingObjective?: string; // Awareness, Traffic, Conversion
    kpi?: string;
    targetAudience?: string;
    landingPageUrl?: string;
    assignedTo?: string; // User ID
}

export interface LandingTexts {
    title: string;
    subtitle: string;
    body: string;
    cta: string;
}

export interface NewsletterTexts {
    subject: string;
    preview: string;
    header: string;
    body: string;
    cta: string;
}


// Creative Content for the briefing
export interface CreativeInputs {
    claim: string;
    discount: string;
    cta: string;

    // Detailed Content Sections
    landing?: LandingTexts;
    newsletter?: NewsletterTexts;


    // Dates moved to CampaignInputs
    usp1: string;
    usp2: string;
    usp3: string;
    keyVisualUrl?: string;
    keyVisualName?: string;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    category: 'Market' | 'Region' | 'Objective' | 'Channel';
    tags: string[]; // e.g., ["US", "Social", "Awareness"]
    state: {
        matrix: MatrixState;
        inputs?: Partial<CampaignInputs>; // Optional default strategy/kpis
        creative?: Partial<CreativeInputs>;
    }
}

export interface TraffickingData {
    landingPage?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    // Optional click tracker / impression tracker
    clickTracker?: string;
    impressionTracker?: string;
}

export interface BriefVersion {
    id: string;
    briefId: string;
    timestamp: number;
    name: string; // e.g. "v1", "v2"
    state: unknown;   // The full state snapshot
    changes?: { field: string; oldValue: unknown; newValue: unknown }[];
}


export interface PsdTemplate {
    id: string;
    name: string;
    size: string;
    preview?: string;
    editorState?: EditorState | Partial<EditorState>;
}

export interface Brief {
    id: string;
    name: string; // Campaign Name
    updatedAt: number;
    status?: 'draft' | 'review' | 'approved' | 'completed';
    state: {
        inputs: CampaignInputs;
        creative: CreativeInputs;
        translations: Record<string, Partial<CreativeInputs>>;
        matrix: MatrixState;
        lockedFields?: string[];
        namingConvention?: NamingConvention;
        psdTemplateId?: string;
        psdTemplates?: PsdTemplate[];
        trafficking?: Record<string, TraffickingData>;
    }
}
