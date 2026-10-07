import re

with open('lib/demo-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the INITIAL_BRIEFS array.
# It starts at `export const INITIAL_BRIEFS: Brief[] = [`
# and goes until the end of the array.

new_briefs = """export const INITIAL_BRIEFS: Brief[] = [
    {
        id: 'demo_meliarewards',
        name: 'MeliáRewards: Regala Puntos',
        updatedAt: NOW,
        status: 'approved',
        state: {
            inputs: {
                campaignName: 'MeliáRewards Regala Puntos',
                brand: 'MeliáRewards',
                strategy: 'Loyalty',
                year: '2026',
                month: '11',
                agency: 'Internal',
                regions: ['GLOBAL'],
                defaultLanguage: 'es',
                startDate: '2026-11-01',
                endDate: '2026-11-30',
                marketingObjective: 'conversion',
                kpi: 'Points Bought',
                targetAudience: 'MeliáRewards Members',
                landingPageUrl: 'https://www.melia.com/es/meliarewards/buy-points',
                assignedTo: 'Loyalty Team'
            },
            creative: {
                claim: 'Regala Puntos, Regala Viajes',
                discount: '+20% Extra',
                cta: 'Comprar Puntos',
                usp1: 'Puntos MeliáRewards',
                usp2: 'Flexibilidad',
                usp3: ''
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_granmelia',
        name: 'Gran Meliá: Luxury Escapes',
        updatedAt: NOW - 10000,
        status: 'review',
        state: {
            inputs: {
                campaignName: 'Luxury Escapes',
                brand: 'Gran Meliá',
                strategy: 'Brand Awareness',
                year: '2026',
                month: '05',
                agency: 'BeRepublic',
                regions: ['EMEA'],
                defaultLanguage: 'en'
            },
            creative: {
                claim: 'A Life Well Lived',
                discount: '',
                cta: 'Discover',
                usp1: 'RedLevel',
                usp2: 'Fine Dining',
                usp3: ''
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_me',
        name: 'ME by Meliá: Ibiza Opening',
        updatedAt: NOW - 20000,
        status: 'draft',
        state: {
            inputs: {
                campaignName: 'Ibiza Opening Season',
                brand: 'ME by Meliá',
                strategy: 'Tactical',
                year: '2026',
                month: '04',
                agency: 'Internal',
                regions: ['EMEA'],
                defaultLanguage: 'en'
            },
            creative: {
                claim: 'The Scene is Set',
                discount: 'Early Bird',
                cta: 'Book Now',
                usp1: 'Rooftop Bar',
                usp2: 'Live DJs',
                usp3: ''
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_paradisus',
        name: 'Paradisus: Destination Inclusive',
        updatedAt: NOW - 30000,
        status: 'approved',
        state: {
            inputs: {
                campaignName: 'Destination Inclusive',
                brand: 'Paradisus',
                strategy: 'Brand',
                year: '2026',
                month: '02',
                agency: 'Making Science',
                regions: ['AME'],
                defaultLanguage: 'es'
            },
            creative: {
                claim: 'Abraza tu Destino',
                discount: '',
                cta: 'Descubrir',
                usp1: 'Destination Inclusive®',
                usp2: 'The Reserve',
                usp3: ''
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_melia',
        name: 'Meliá Hotels: Summer Deals',
        updatedAt: NOW - 40000,
        status: 'review',
        state: {
            inputs: {
                campaignName: 'Summer Deals 2026',
                brand: 'Meliá Hotels & Resorts',
                strategy: 'Tactical',
                year: '2026',
                month: '06',
                agency: 'Internal',
                regions: ['GLOBAL'],
                defaultLanguage: 'en'
            },
            creative: {
                claim: 'Soul of Things',
                discount: 'Up to 30% Off',
                cta: 'Book Summer',
                usp1: 'The Level',
                usp2: 'Kids & Co',
                usp3: 'Free Cancellation'
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_innside',
        name: 'INNSiDE: Bleisure Travel',
        updatedAt: NOW - 50000,
        status: 'draft',
        state: {
            inputs: {
                campaignName: 'Bleisure Generation',
                brand: 'INNSiDE by Meliá',
                strategy: 'Always On',
                year: '2026',
                month: '03',
                agency: 'ContentJet',
                regions: ['EMEA'],
                defaultLanguage: 'en'
            },
            creative: {
                claim: 'Work. Play. Repeat.',
                discount: '',
                cta: 'Explore',
                usp1: 'Open Living Lounges',
                usp2: 'Pet Friendly',
                usp3: 'Free Wi-Fi'
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_sol',
        name: 'Sol by Meliá: Family Fun',
        updatedAt: NOW - 60000,
        status: 'approved',
        state: {
            inputs: {
                campaignName: 'Family Fun Sun',
                brand: 'Sol by Meliá',
                strategy: 'Tactical',
                year: '2026',
                month: '07',
                agency: 'Internal',
                regions: ['EMEA'],
                defaultLanguage: 'es'
            },
            creative: {
                claim: 'Vacaciones en Familia',
                discount: 'Niños Gratis',
                cta: 'Reservar',
                usp1: 'Katmandu Park',
                usp2: 'Todo Incluido',
                usp3: 'Piscinas Temáticas'
            },
            translations: {},
            matrix: {}
        }
    },
    {
        id: 'demo_zel',
        name: 'ZEL: Mediterranean Lifestyle',
        updatedAt: NOW - 70000,
        status: 'review',
        state: {
            inputs: {
                campaignName: 'Mediterranean Lifestyle',
                brand: 'ZEL',
                strategy: 'Brand',
                year: '2026',
                month: '08',
                agency: 'Cooltura',
                regions: ['EMEA'],
                defaultLanguage: 'es'
            },
            creative: {
                claim: 'Casa ZEL',
                discount: '',
                cta: 'Descubrir ZEL',
                usp1: 'Diseño Mediterráneo',
                usp2: 'Gastronomía Local',
                usp3: 'Bienestar'
            },
            translations: {},
            matrix: {}
        }
    }
];"""

new_content = re.sub(r'export const INITIAL_BRIEFS: Brief\[\] = \[.*?\n\];', new_briefs, content, flags=re.DOTALL)

with open('lib/demo-data.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

