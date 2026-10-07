import { Brief } from './types';
import { MARKETS } from './constants';

export function generateClinchCSV(brief: Brief): string {
    const { state } = brief;
    const { inputs, creative, translations, matrix } = state;

    // 1. Define Headers for Clinch DCO
    const headers = [
        'Campaign_Name',
        'Brand',
        'Strategy',
        'Year',
        'Month',
        'Target',
        'Classification',
        'Market',
        'Language',
        'Claim',
        'Discount',
        'CTA',
        'USP1',
        'USP2',
        'USP3',
        'Newsletter_Subject',
        'Newsletter_Preview',
        'Newsletter_Header',
        'Newsletter_Body',
        'Newsletter_CTA',
        'Landing_Title',
        'Landing_Subtitle',
        'Landing_Body',
        'Landing_CTA',
        'Landing_Page_URL'
    ];

    const rows: string[][] = [headers];

    // 2. Identify Unique Markets requested in Matrix
    const requestedMarkets = Object.keys(matrix);

    requestedMarkets.forEach(marketSelector => {
        const market = MARKETS.find(m => m.selector === marketSelector);
        if (!market) return;

        const lang = market.defaultLang || 'en';
        const translation = translations?.[lang] || {};

        // Merge inputs: Global Creative -> Translation Overrides
        const finalCreative = {
            ...creative,
            ...translation
        };

        const row = [
            inputs.campaignName || '',
            inputs.brand || '',
            inputs.strategy || '',
            inputs.year || '',
            inputs.month || '',
            inputs.target || '',
            inputs.classification || '',
            market.code,
            lang,
            finalCreative.claim || '',
            finalCreative.discount || '',
            finalCreative.cta || '',
            finalCreative.usp1 || '',
            finalCreative.usp2 || '',
            finalCreative.usp3 || '',
            finalCreative.newsletter?.subject || '',
            finalCreative.newsletter?.preview || '',
            finalCreative.newsletter?.header || '',
            finalCreative.newsletter?.body || '',
            finalCreative.newsletter?.cta || '',
            finalCreative.landing?.title || '',
            finalCreative.landing?.subtitle || '',
            finalCreative.landing?.body || '',
            finalCreative.landing?.cta || '',
            inputs.landingPageUrl || ''
        ];

        rows.push(row.map(cell => {
            const escaped = String(cell).replace(/"/g, '""');
            return `"${escaped}"`;
        }));
    });

    return rows.map(r => r.join(',')).join('\n');
}
