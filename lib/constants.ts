import { Market, Placement } from './types';

export const MARKETS: Market[] = [
    // AME
    { code: 'US', name: 'Estados Unidos', selector: 'US (Estados Unidos)', region: 'AME', defaultLang: 'en' },
    { code: 'CA', name: 'Canadá', selector: 'CA (Canadá)', region: 'AME', defaultLang: 'en' },
    { code: 'MX', name: 'México', selector: 'MX (México)', region: 'AME', defaultLang: 'es' },
    { code: 'CR', name: 'Costa Rica', selector: 'CR (Costa Rica)', region: 'AME', defaultLang: 'es' },
    { code: 'LTM', name: 'Latam', selector: 'LTM (Latam)', region: 'AME', defaultLang: 'es' },
    { code: 'JM', name: 'Jamaica', selector: 'JM (Jamaica)', region: 'AME', defaultLang: 'en' },
    { code: 'PA', name: 'Panamá', selector: 'PA (Panamá)', region: 'AME', defaultLang: 'es' },
    { code: 'DO', name: 'Rep. Dominicana', selector: 'DO (Rep. Dominicana)', region: 'AME', defaultLang: 'es' },
    { code: 'BR', name: 'Brasil', selector: 'BR (Brasil)', region: 'AME', defaultLang: 'pt' },
    { code: 'CO', name: 'Colombia', selector: 'CO (Colombia)', region: 'AME', defaultLang: 'es' },
    { code: 'AR', name: 'Argentina', selector: 'AR (Argentina)', region: 'AME', defaultLang: 'es' },
    { code: 'CL', name: 'Chile', selector: 'CL (Chile)', region: 'AME', defaultLang: 'es' },

    // EMEA
    { code: 'ES', name: 'España', selector: 'ES (España)', region: 'EMEA', defaultLang: 'es' },
    { code: 'GB', name: 'Reino Unido', selector: 'GB (Reino Unido)', region: 'EMEA', defaultLang: 'en' },
    { code: 'DE', name: 'Alemania', selector: 'DE (Alemania)', region: 'EMEA', defaultLang: 'de' },
    { code: 'CH', name: 'Suiza', selector: 'CH (Suiza)', region: 'EMEA', defaultLang: 'de' },
    { code: 'IE', name: 'Irlanda', selector: 'IE (Irlanda)', region: 'EMEA', defaultLang: 'en' },
    { code: 'FR', name: 'Francia', selector: 'FR (Francia)', region: 'EMEA', defaultLang: 'fr' },
    { code: 'IT', name: 'Italia', selector: 'IT (Italia)', region: 'EMEA', defaultLang: 'it' },
    { code: 'PT', name: 'Portugal', selector: 'PT (Portugal)', region: 'EMEA', defaultLang: 'pt' },
    { code: 'ESC', name: 'Escocia', selector: 'ESC (Escocia)', region: 'EMEA', defaultLang: 'en' },
    { code: 'BE-FR', name: 'Bélgica (FR)', selector: 'BE-FR (Bélgica FR)', region: 'EMEA', defaultLang: 'fr' },
    { code: 'BE-NL', name: 'Bélgica (NL)', selector: 'BE-NL (Bélgica NL)', region: 'EMEA', defaultLang: 'nl' },
    { code: 'NL', name: 'Países Bajos', selector: 'NL (Países Bajos)', region: 'EMEA', defaultLang: 'nl' },
    { code: 'PL', name: 'Polonia', selector: 'PL (Polonia)', region: 'EMEA', defaultLang: 'pl' },
    { code: 'RU', name: 'Rusia', selector: 'RU (Rusia)', region: 'EMEA', defaultLang: 'ru' },

    // APAC
    { code: 'AE', name: 'Emiratos Árabes', selector: 'AE (Emiratos Árabes)', region: 'APAC', defaultLang: 'en' },
    { code: 'AU', name: 'Australia', selector: 'AU (Australia)', region: 'APAC', defaultLang: 'en' },
    { code: 'IN', name: 'India', selector: 'IN (India)', region: 'APAC', defaultLang: 'en' },
    { code: 'LK', name: 'Sri Lanka', selector: 'LK (Sri Lanka)', region: 'APAC', defaultLang: 'en' },
    { code: 'MU', name: 'Mauricio', selector: 'MU (Mauricio)', region: 'APAC', defaultLang: 'en' },
    { code: 'RE', name: 'Reunión', selector: 'RE (Reunión)', region: 'APAC', defaultLang: 'fr' },
    { code: 'ZA', name: 'Sudáfrica', selector: 'ZA (Sudáfrica)', region: 'APAC', defaultLang: 'en' },
    { code: 'QA', name: 'Qatar', selector: 'QA (Qatar)', region: 'APAC', defaultLang: 'en' },
    { code: 'SA', name: 'Arabia Saudí', selector: 'SA (Arabia Saudí)', region: 'APAC', defaultLang: 'ar' },
    { code: 'MA', name: 'Marruecos', selector: 'MA (Marruecos)', region: 'APAC', defaultLang: 'fr' },
    { code: 'SN', name: 'Senegal', selector: 'SN (Senegal)', region: 'APAC', defaultLang: 'fr' },
];

export const PLACEMENTS: Placement[] = [
    // Amazon DSP
    { id: 'wide_skyscraper_amazon_dsp', name: 'Wide Skyscraper', size: '160x600', width: 160, height: 600, format: 'img', channel: 'Amazon', seconds: 'na', maxFileSize: 150 },
    { id: 'half_page_ad_amazon_dsp', name: 'Half Page Ad', size: '300x600', width: 300, height: 600, format: 'img', channel: 'Amazon', seconds: 'na', maxFileSize: 150 },
    { id: 'medium_rectangle_amazon_dsp', name: 'Medium Rectangle', size: '300x250', width: 300, height: 250, format: 'img', channel: 'Amazon', seconds: 'na', maxFileSize: 150 },
    { id: 'mobile_leaderboard_amazon_dsp', name: 'Mobile Leaderboard', size: '320x50', width: 320, height: 50, format: 'img', channel: 'Amazon', seconds: 'na', maxFileSize: 150 },
    { id: 'leaderboard_amazon_dsp', name: 'Leaderboard', size: '728x90', width: 728, height: 90, format: 'img', channel: 'Amazon', seconds: 'na', maxFileSize: 150 },
    { id: 'billboard_amazon_dsp', name: 'Billboard', size: '970x250', width: 970, height: 250, format: 'img', channel: 'Amazon', seconds: 'na', maxFileSize: 150 },

    // App
    { id: 'fondo_app', name: 'Fondo', size: '1080x1200', width: 1080, height: 1200, format: 'img', channel: 'App', seconds: 'na', maxFileSize: 500 },
    { id: 'stories_app', name: 'Stories', size: '1080x1700', width: 1080, height: 1700, format: 'img', channel: 'App', seconds: 'na', maxFileSize: 500 },

    // Criteo
    { id: 'banner_genérico_criteo_pros', name: 'Banner Genérico', size: '1200x628', width: 1200, height: 628, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'banner_cuadrado_criteo_pros', name: 'Banner Cuadrado', size: '1200x1200', width: 1200, height: 1200, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'banner_vertical_criteo_pros', name: 'Banner Vertical', size: '800x1200', width: 800, height: 1200, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },

    // Criteo RTG
    { id: 'skyscraper_criteo_rtg', name: 'Skyscraper', size: '120x600', width: 120, height: 600, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'wide_skyscraper_criteo_rtg', name: 'Wide Skyscraper', size: '160x600', width: 160, height: 600, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'half_page_ad_criteo_rtg', name: 'Half Page Ad', size: '300x600', width: 300, height: 600, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'medium_rectangle_criteo_rtg', name: 'Medium Rectangle', size: '300x250', width: 300, height: 250, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'large_rectangle_criteo_rtg', name: 'Large Rectangle', size: '336x280', width: 336, height: 280, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'mobile_leaderboard_criteo_rtg', name: 'Mobile Leaderboard', size: '320x50', width: 320, height: 50, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'full_banner_criteo_rtg', name: 'Full Banner', size: '468x60', width: 468, height: 60, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'leaderboard_criteo_rtg', name: 'Leaderboard', size: '728x90', width: 728, height: 90, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'large_leaderboard_criteo_rtg', name: 'Large Leaderboard', size: '970x90', width: 970, height: 90, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },
    { id: 'billboard_criteo_rtg', name: 'Billboard', size: '970x250', width: 970, height: 250, format: 'img', channel: 'Criteo RTG', seconds: 'na', maxFileSize: 150 },

    // Demand Gen / TripMax
    { id: 'landscape_demand_gen', name: 'Landscape', size: '1200x628', width: 1200, height: 628, format: 'img', channel: 'YT / Demand Gen', seconds: 'na', maxFileSize: 150 },
    { id: 'square_demand_gen', name: 'Square', size: '1200x1200', width: 1200, height: 1200, format: 'img', channel: 'YT / Demand Gen', seconds: 'na', maxFileSize: 150 },
    { id: 'portrait_demand_gen', name: 'Portrait', size: '960x1200', width: 960, height: 1200, format: 'img', channel: 'YT / Demand Gen', seconds: 'na', maxFileSize: 150 },

    // Meta
    { id: 'image_feed_meta', name: 'Image Feed', size: '1080x1080', width: 1080, height: 1080, format: 'img', channel: 'Meta', seconds: 'na', maxFileSize: 150 },
    { id: 'stories_image_meta', name: 'Stories Image', size: '1080x1920', width: 1080, height: 1920, format: 'img', channel: 'Meta', seconds: 'na', maxFileSize: 150 },
    { id: 'vídeo_feed_meta', name: 'Vídeo feed', size: '1080x1080', width: 1080, height: 1080, format: 'vid', channel: 'Meta', seconds: '10', maxFileSize: 4096 },
    { id: 'vídeo_stories_meta', name: 'Vídeo stories', size: '1080x1920', width: 1080, height: 1920, format: 'vid', channel: 'Meta', seconds: '10', maxFileSize: 4096 },

    // Newsletter
    { id: 'desktop_newsletter', name: 'Desktop', size: '1200x900', width: 1200, height: 900, format: 'img', channel: 'Newsletter', seconds: 'na', maxFileSize: 500 },
    { id: 'mobile_newsletter', name: 'Mobile', size: '1200x1200', width: 1200, height: 1200, format: 'img', channel: 'Newsletter', seconds: 'na', maxFileSize: 500 },
    { id: 'footer_newsletter', name: 'Footer', size: '1200x900', width: 1200, height: 900, format: 'img', channel: 'Newsletter', seconds: 'na', maxFileSize: 500 },

    // Paquetes
    { id: 'slide_paquetes_riu_paquetes', name: 'Slide Paquetes RIU', size: '1366x600', width: 1366, height: 600, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'slide_mobile_paquetes_riu_paquetes', name: 'Slide Mobile Paquetes RIU', size: '480x400', width: 480, height: 400, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'slide_paquetes_us_ca_paquetes', name: 'Slide Paquetes US/CA', size: '1366x400', width: 1366, height: 400, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_mx_banner_1_paquetes', name: 'Paquetes MX: Banner 1', size: '1920x450', width: 1920, height: 450, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_mx_banner_1_mobile_paquetes', name: 'Paquetes MX: Banner 1 Mobile', size: '770x180', width: 770, height: 180, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 200 },
    { id: 'paquetes_mx_banner_2_paquetes', name: 'Paquetes MX: Banner 2', size: '1366x597', width: 1366, height: 597, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_mx_banner_2_mobile_paquetes', name: 'Paquetes MX: Banner 2 Mobile', size: '590x258', width: 590, height: 258, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 200 },
    { id: 'paquete_mx_banner_3_msi_paquetes', name: 'Paquete MX: Banner 3 MSI', size: '734x657', width: 734, height: 657, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_mx_banner_3_mobile_paquetes', name: 'Paquetes MX: Banner 3 Mobile', size: '284x258', width: 284, height: 258, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 200 },
    { id: 'paquetes_mx_banner_4_cc_paquetes', name: 'Paquetes MX: Banner 4 CC', size: '734x657', width: 734, height: 657, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_mx_banner_4_mobile_paquetes', name: 'Paquetes MX: Banner 4 Mobile', size: '284x258', width: 284, height: 258, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 200 },
    { id: 'paquete_mx_banner_5_paquetes', name: 'Paquete MX: Banner 5', size: '1920x450', width: 1920, height: 450, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquete_mx_banner_5_mobile_paquetes', name: 'Paquete MX: Banner 5 Mobile', size: '770x180', width: 770, height: 180, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 200 },
    { id: 'paquetes_latam_banner_1_paquetes', name: 'Paquetes LATAM Banner 1', size: '1920x545', width: 1920, height: 545, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_latam_banner_2_paquetes', name: 'Paquetes LATAM Banner 2', size: '1170x200', width: 1170, height: 200, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_latam_banner_2_var_paquetes', name: 'Paquetes LATAM Banner 2 (Var)', size: '570x200', width: 570, height: 200, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_us_ca_full_width_paquetes', name: 'Paquetes US/CA Full Width', size: '1593x330', width: 1593, height: 330, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_us_ca_full_width_mobile_paquetes', name: 'Paquetes US/CA Full Width/Mobile', size: '375x375', width: 375, height: 375, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 500 },
    { id: 'paquetes_us_ca_large_native_paquetes', name: 'Paquetes US/CA Large Native', size: '2000x900', width: 2000, height: 900, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 800 },
    { id: 'paquetes_us_ca_small_native_paquetes', name: 'Paquetes US/CA Small Native', size: '116x168', width: 116, height: 168, format: 'img', channel: 'Paquetes', seconds: 'na', maxFileSize: 150 },

    // Smartly
    { id: 'videotemplate_vertical_smartly', name: 'Videotemplate vertical', size: '1080x1920', width: 1080, height: 1920, format: 'vid', channel: 'Meta', seconds: '10', maxFileSize: 10240 },
    { id: 'videotemplate_cuadrado_smartly', name: 'Videotemplate cuadrado', size: '1080x1080', width: 1080, height: 1080, format: 'vid', channel: 'Meta', seconds: '10', maxFileSize: 10240 },
    { id: 'imagetemplate_vertical_smartly', name: 'Imagetemplate vertical', size: '1080x1920', width: 1080, height: 1920, format: 'img', channel: 'Meta', seconds: 'na', maxFileSize: 500 },
    { id: 'imagetemplate_cuadrado_smartly', name: 'Imagetemplate cuadrado', size: '1080x1080', width: 1080, height: 1080, format: 'img', channel: 'Meta', seconds: 'na', maxFileSize: 500 },

    // Taboola
    { id: 'banner_nativo_taboola', name: 'Banner Nativo', size: '1000x600', width: 1000, height: 600, format: 'img', channel: 'Taboola', seconds: 'na', maxFileSize: 150 },

    // TikTok
    { id: 'vídeo_vertical_tiktok', name: 'Vídeo vertical', size: '1080x1920', width: 1080, height: 1920, format: 'vid', channel: 'Tik Tok', seconds: '10', maxFileSize: 10240 },
    { id: 'display_card_tiktok', name: 'Display Card', size: '750x421', width: 750, height: 421, format: 'img', channel: 'Tik Tok', seconds: 'na', maxFileSize: 150 },

    // Web
    { id: 'slide_ofertas_desktop_web', name: 'Slide ofertas desktop', size: '1366x600', width: 1366, height: 600, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 500 },
    { id: 'slide_ofertas_mobile_web', name: 'Slide ofertas mobile', size: '480x400', width: 480, height: 400, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 500 },
    { id: 'landing_desktop_web', name: 'Landing desktop', size: '2732x1200', width: 2732, height: 1200, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 1024 },
    { id: 'landing_mobile_web', name: 'Landing mobile', size: '1200x1920', width: 1200, height: 1920, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 1024 },
    { id: 'banner_home_web', name: 'Banner Home', size: '2732x1200', width: 2732, height: 1200, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 1024 },
    { id: 'banner_home_mobile_web', name: 'Banner Home Mobile', size: '1200x1920', width: 1200, height: 1920, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 1024 },
    { id: 'ficha_hotel_dispo_destino_mobile_web', name: 'Ficha Hotel, Dispo y Destino Mobile', size: '400x150', width: 400, height: 150, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 150 },
    { id: 'ficha_hotel_dispo_destino_web', name: 'Ficha Hotel, Dispo y Destino', size: '1200x100', width: 1200, height: 100, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 150 },
    { id: 'login_web', name: 'Login', size: '620x240', width: 620, height: 240, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 150 },
    { id: 'bh_por_segmento_web', name: 'BH por segmento', size: '2732x1200', width: 2732, height: 1200, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 1024 },
    { id: 'bh_por_segmento_mobile_web', name: 'BH por segmento Mobile', size: '1200x1920', width: 1200, height: 1920, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 1024 },
    { id: 'pop_up_web', name: 'Pop up', size: '1200x800', width: 1200, height: 800, format: 'img', channel: 'Web', seconds: 'na', maxFileSize: 500 },

    // YT / Demand Gen
    { id: 'vídeo_horizontal_yt_demand_6s', name: 'Vídeo horizontal (6s)', size: '1920x1080', width: 1920, height: 1080, format: 'vid', channel: 'YT / Demand Gen', seconds: '6', maxFileSize: 10240 },
    { id: 'vídeo_horizontal_yt_demand_15s', name: 'Vídeo horizontal (15s)', size: '1920x1080', width: 1920, height: 1080, format: 'vid', channel: 'YT / Demand Gen', seconds: '15', maxFileSize: 20480 },
    { id: 'vídeo_horizontal_yt_demand_30s', name: 'Vídeo horizontal (30s)', size: '1920x1080', width: 1920, height: 1080, format: 'vid', channel: 'YT / Demand Gen', seconds: '30', maxFileSize: 40960 },
    { id: 'vídeo_vertical_yt_demand_6s', name: 'Vídeo vertical (6s)', size: '1080x1920', width: 1080, height: 1920, format: 'vid', channel: 'YT / Demand Gen', seconds: '6', maxFileSize: 10240 },
    { id: 'vídeo_vertical_yt_demand_15s', name: 'Vídeo vertical (15s)', size: '1080x1920', width: 1080, height: 1920, format: 'vid', channel: 'YT / Demand Gen', seconds: '15', maxFileSize: 20480 },
    { id: 'vídeo_vertical_yt_demand_30s', name: 'Vídeo vertical (30s)', size: '1080x1920', width: 1080, height: 1920, format: 'vid', channel: 'YT / Demand Gen', seconds: '30', maxFileSize: 40960 },
    { id: 'vídeo_cuadrado_yt_demand_6s', name: 'Vídeo cuadrado (6s)', size: '1080x1080', width: 1080, height: 1080, format: 'vid', channel: 'YT / Demand Gen', seconds: '6', maxFileSize: 10240 },
    { id: 'vídeo_cuadrado_yt_demand_15s', name: 'Vídeo cuadrado (15s)', size: '1080x1080', width: 1080, height: 1080, format: 'vid', channel: 'YT / Demand Gen', seconds: '15', maxFileSize: 20480 },
    { id: 'vídeo_cuadrado_yt_demand_30s', name: 'Vídeo cuadrado (30s)', size: '1080x1080', width: 1080, height: 1080, format: 'vid', channel: 'YT / Demand Gen', seconds: '30', maxFileSize: 40960 },
    { id: 'banner_companion_yt_demand', name: 'Banner Companion', size: '300x60', width: 300, height: 60, format: 'img', channel: 'YT / Demand Gen', seconds: 'na', maxFileSize: 150 },
];
