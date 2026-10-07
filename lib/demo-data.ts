import { Brief } from './types';
import { MARKETS, PLACEMENTS } from './constants';

const NOW = Date.now();

// Helper to get placement IDs by channel
const getPlacementsByChannel = (channel: string) =>
    PLACEMENTS.filter(p => p.channel === channel).map(p => p.id);

// Helper to get market selector by code
const getSelector = (code: string) =>
    MARKETS.find(m => m.code === code)?.selector || '';

export const DEMO_BRIEFS: Brief[] = [
    // 1. Black Friday: Full Campaign
    {
        id: 'demo_bf_global',
        name: 'Black Friday 2026 Global',
        updatedAt: NOW,
        status: 'approved',
        state: {
            inputs: {
                campaignName: 'Black Friday 2026 Global',
                brand: 'Meliá',
                strategy: 'Flash',
                year: '2026',
                month: '11',
                agency: 'Internal',
                regions: ['AME', 'EMEA', 'APAC'],
                defaultLanguage: 'en',
                startDate: '2026-11-20',
                endDate: '2026-12-01',
                marketingObjective: 'conversion',
                kpi: 'ROI > 10',
                targetAudience: 'Global Travelers',
                landingPageUrl: 'https://www.riu.com/black-friday',
                assignedTo: 'Global Team'
            },
            creative: {
                claim: 'Black Friday Sale',
                discount: 'Up to 50% OFF',
                cta: 'Book Now',
                usp1: 'Best Price Guaranteed',
                usp2: 'Free Cancellation',
                usp3: 'All Inclusive'
            },
            translations: {
                'es': { claim: 'Oferta Black Friday', cta: 'Reserva Ya', discount: 'Hasta 50% Dto' },
                'de': { claim: 'Black Friday Angebote', cta: 'Jetzt Buchen', discount: 'Bis zu 50% Rabatt' },
                'fr': { claim: 'Offres Black Friday', cta: 'Réserver', discount: 'Jusqu\'à 50% de réduction' }
            },
            matrix: {
                [getSelector('US')]: [...getPlacementsByChannel('Amazon DSP'), ...getPlacementsByChannel('Meta')],
                [getSelector('GB')]: [...getPlacementsByChannel('Criteo RTG'), ...getPlacementsByChannel('TikTok')],
                [getSelector('DE')]: [...getPlacementsByChannel('Display'), ...getPlacementsByChannel('Meta')],
                [getSelector('ES')]: [...getPlacementsByChannel('Meta'), ...getPlacementsByChannel('Paquetes')],
                [getSelector('MX')]: [...getPlacementsByChannel('Paquetes'), ...getPlacementsByChannel('Meta')],
                [getSelector('AE')]: getPlacementsByChannel('Meta')
            }
        }
    },

    // 2. Hottest Winter Sales: US & CA (Newsletter + Social)
    {
        id: 'demo_winter_us_ca',
        name: 'Hottest Winter Sales US/CA',
        updatedAt: NOW - 100000,
        status: 'review',
        state: {
            inputs: {
                campaignName: 'Hottest Winter Sales US/CA',
                brand: 'Meliá',
                strategy: 'Tactical',
                year: '2026',
                month: '01',
                agency: 'Internal',
                regions: ['AME'],
                defaultLanguage: 'en',
                startDate: '2026-01-10',
                endDate: '2026-02-28',
                marketingObjective: 'awareness',
                kpi: 'Click Rate > 2%',
                targetAudience: 'Family & Couples',
                landingPageUrl: 'https://www.riu.com/winter-sale',
                assignedTo: 'AME Team'
            },
            creative: {
                claim: 'Winter Paradise',
                discount: 'Kids Free',
                cta: 'Discover',
                usp1: 'Warm Destinations',
                usp2: 'Family Friendly',
                usp3: ''
            },
            translations: {},
            matrix: {
                [getSelector('US')]: [...getPlacementsByChannel('Newsletter'), ...getPlacementsByChannel('Meta'), ...getPlacementsByChannel('TikTok')],
                [getSelector('CA')]: [...getPlacementsByChannel('Newsletter'), ...getPlacementsByChannel('Meta'), ...getPlacementsByChannel('TikTok')]
            }
        }
    },

    // 3. Venta Especial CR (Costa Rica Only)
    {
        id: 'demo_special_cr',
        name: 'Venta Especial Costa Rica',
        updatedAt: NOW - 5000000,
        status: 'draft',
        state: {
            inputs: {
                campaignName: 'Venta Especial Costa Rica',
                brand: 'Meliá',
                strategy: 'Flash',
                year: '2026',
                month: '08',
                agency: 'Internal',
                regions: ['AME'],
                defaultLanguage: 'es',
                startDate: '2026-08-01',
                endDate: '2026-08-03',
                marketingObjective: 'conversion',
                kpi: 'Bookings > 500',
                targetAudience: 'Locals',
                landingPageUrl: 'https://www.riu.com/cr-offer',
                assignedTo: 'CR Local Team'
            },
            creative: {
                claim: 'Escápate a Guanacaste',
                discount: 'Precios Especiales',
                cta: 'Ver Ofertas',
                usp1: 'Todo Incluido 24h',
                usp2: 'Niños Gratis',
                usp3: 'Pago en Cuotas'
            },
            translations: {},
            matrix: {
                [getSelector('CR')]: [...getPlacementsByChannel('Meta'), ...getPlacementsByChannel('Web'), ...getPlacementsByChannel('Paquetes')]
            }
        }
    },

    // 4. Summer Early Booking (EU Focus)
    {
        id: 'demo_summer_eu',
        name: 'Summer 2026 Early Booking',
        updatedAt: NOW - 200000,
        status: 'review',
        state: {
            inputs: {
                campaignName: 'Summer 2026 Early Booking',
                brand: 'Meliá',
                strategy: 'Early Booking',
                year: '2026',
                month: '06',
                agency: 'Internal',
                regions: ['EMEA'],
                defaultLanguage: 'en',
                startDate: '2026-01-15',
                endDate: '2026-03-31',
                marketingObjective: 'consideration',
                kpi: 'Leads',
                targetAudience: 'Families, Couples',
                landingPageUrl: 'https://www.riu.com/summer-2026',
                assignedTo: 'EMEA Marketing'
            },
            creative: {
                claim: 'Plan Your Perfect Summer',
                discount: 'Up to 25% Off',
                cta: 'Book Early',
                usp1: 'Low Deposit',
                usp2: 'Flexible Dates',
                usp3: 'Best Rooms Available'
            },
            translations: {
                'de': { claim: 'Planen Sie Ihren Sommer', cta: 'Früh Buchen', discount: 'Bis zu 25% Rabatt' },
                'es': { claim: 'Planea tu Verano Perfecto', cta: 'Reserva Antes', discount: 'Hasta 25% Dto' },
                'fr': { claim: 'Planifiez votre été', cta: 'Réserver Tôt', discount: 'Jusqu\'à 25% Réduction' }
            },
            matrix: {
                [getSelector('DE')]: [...getPlacementsByChannel('Display'), ...getPlacementsByChannel('Newsletter'), ...getPlacementsByChannel('Meta')],
                [getSelector('GB')]: [...getPlacementsByChannel('Display'), ...getPlacementsByChannel('Meta')],
                [getSelector('NL')]: getPlacementsByChannel('Display'),
                [getSelector('BE')]: getPlacementsByChannel('Display')
            }
        }
    },

    // 5. Last Minute Deals (APAC)
    {
        id: 'demo_last_minute_apac',
        name: 'Last Minute Getaways APAC',
        updatedAt: NOW - 50000,
        status: 'draft',
        state: {
            inputs: {
                campaignName: 'Last Minute Getaways APAC',
                brand: 'Meliá',
                strategy: 'Last Minute',
                year: '2026',
                month: '04',
                agency: 'Internal',
                regions: ['APAC'],
                defaultLanguage: 'en',
                startDate: '2026-04-01',
                endDate: '2026-04-03',
                marketingObjective: 'conversion',
                kpi: 'Occupancy',
                targetAudience: 'Impulse Travelers',
                landingPageUrl: 'https://www.riu.com/last-minute',
                assignedTo: 'APAC Team'
            },
            creative: {
                claim: 'Spontaneous Escape',
                discount: 'Extra 10% Off',
                cta: 'Pack & Go',
                usp1: 'Immediate Availability',
                usp2: 'Luxury Resorts',
                usp3: 'Exclusive Rate'
            },
            translations: {
                'ar': { claim: 'انطلق في عطلة عفوية', cta: 'احزم وسافر', discount: 'خصم إضافي 10٪' },
                'zh': { claim: '即兴逃离', cta: '打包出发', discount: '额外10%优惠' }
            },
            matrix: {
                [getSelector('AE')]: [...getPlacementsByChannel('Meta'), ...getPlacementsByChannel('TikTok')],
                [getSelector('CN')]: [...getPlacementsByChannel('Meta'), ...getPlacementsByChannel('TikTok')],
                [getSelector('IN')]: getPlacementsByChannel('Meta')
            }
        }
    }
];
