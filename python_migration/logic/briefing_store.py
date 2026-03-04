from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from nicegui import ui

@dataclass
class Market:
    code: str
    name: str
    selector: str
    region: str
    defaultLanguage: str

@dataclass
class Placement:
    id: str
    name: str
    size: str
    width: int
    height: int
    format: str
    channel: str
    seconds: str = "na"

@dataclass
class BriefingDetails:
    campaignName: str = ""
    brand: str = ""
    agency: str = ""
    startDate: str = ""
    endDate: str = ""
    marketingObjective: str = "awareness"
    kpi: str = ""
    strategy: str = ""
    landingPageUrl: str = ""
    defaultLanguage: str = "en"
    regions: List[str] = field(default_factory=lambda: ["AME", "EMEA", "APAC"])

MARKETS: List[Market] = [
    # AME
    Market('AR', 'Argentina', 'AR (Argentina)', 'AME', 'es'),
    Market('CA', 'Canadá', 'CA (Canadá)', 'AME', 'en'),
    Market('CL', 'Chile', 'CL (Chile)', 'AME', 'es'),
    Market('CO', 'Colombia', 'CO (Colombia)', 'AME', 'es'),
    Market('CR', 'Costa Rica', 'CR (Costa Rica)', 'AME', 'es'),
    Market('DO', 'Rep. Dominicana', 'DO (Rep. Dominicana)', 'AME', 'es'),
    Market('JM', 'Jamaica', 'JM (Jamaica)', 'AME', 'en'),
    Market('MX', 'México', 'MX (México)', 'AME', 'es'),
    Market('PA', 'Panamá', 'PA (Panamá)', 'AME', 'es'),
    Market('US', 'Estados Unidos', 'US (Estados Unidos)', 'AME', 'en'),

    # APAC
    Market('AE', 'Emiratos Árabes', 'AE (Emiratos Árabes)', 'APAC', 'en'),
    Market('IN', 'India', 'IN (India)', 'APAC', 'en'),
    Market('LK', 'Sri Lanka', 'LK (Sri Lanka)', 'APAC', 'en'),
    Market('MA', 'Marruecos', 'MA (Marruecos)', 'APAC', 'fr'),
    Market('MU', 'Mauricio', 'MU (Mauricio)', 'APAC', 'en'),
    Market('QA', 'Qatar', 'QA (Qatar)', 'APAC', 'en'),
    Market('RE', 'Reunión', 'RE (Reunión)', 'APAC', 'fr'),
    Market('SA', 'Arabia Saudí', 'SA (Arabia Saudí)', 'APAC', 'ar'),
    Market('SN', 'Senegal', 'SN (Senegal)', 'APAC', 'fr'),
    Market('ZA', 'Sudáfrica', 'ZA (Sudáfrica)', 'APAC', 'en'),
    Market('CN', 'China', 'CN (China)', 'APAC', 'zh'),

    # EMEA
    Market('BE', 'Flamenco', 'BE (Flamenco)', 'EMEA', 'nl'),
    Market('BE', 'Francés', 'BE (Francés)', 'EMEA', 'fr'),
    Market('CH', 'Suiza', 'CH (Suiza)', 'EMEA', 'de'),
    Market('DE', 'Alemania', 'DE (Alemania)', 'EMEA', 'de'),
    Market('ES', 'España', 'ES (España)', 'EMEA', 'es'),
    Market('FI', 'Finlandia', 'FI (Finlandia)', 'EMEA', 'fi'),
    Market('FR', 'Francia', 'FR (Francia)', 'EMEA', 'fr'),
    Market('GB', 'Reino Unido', 'GB (Reino Unido)', 'EMEA', 'en'),
    Market('IE', 'Irlanda', 'IE (Irlanda)', 'EMEA', 'en'),
    Market('IT', 'Italia', 'IT (Italia)', 'EMEA', 'it'),
    Market('NL', 'Países Bajos', 'NL (Países Bajos)', 'EMEA', 'nl'),
    Market('NO', 'Noruega', 'NO (Noruega)', 'EMEA', 'no'),
    Market('PL', 'Polonia', 'PL (Polonia)', 'EMEA', 'pl'),
    Market('PT', 'Portugal', 'PT (Portugal)', 'EMEA', 'pt'),
    Market('RU', 'Rusia', 'RU (Rusia)', 'EMEA', 'ru'),
    Market('SK', 'Eslovaquia', 'SK (Eslovaquia)', 'EMEA', 'sk'),
]

PLACEMENTS: List[Placement] = [
    Placement('wide_skyscraper_amazon_dsp', 'Wide Skyscraper', '160x600', 160, 600, 'img', 'Amazon DSP'),
    Placement('half_page_ad_amazon_dsp', 'Half Page Ad', '300x600', 300, 600, 'img', 'Amazon DSP'),
    Placement('medium_rectangle_amazon_dsp', 'Medium Rectangle', '300x250', 300, 250, 'img', 'Amazon DSP'),
    Placement('mobile_leaderboard_amazon_dsp', 'Mobile Leaderboard', '320x50', 320, 50, 'img', 'Amazon DSP'),
    Placement('leaderboard_amazon_dsp', 'Leaderboard', '728x90', 728, 90, 'img', 'Amazon DSP'),
    Placement('billboard_amazon_dsp', 'Billboard', '970x250', 970, 250, 'img', 'Amazon DSP'),

    Placement('fondo_app', 'Fondo', '1080x1200', 1080, 1200, 'img', 'App'),
    Placement('stories_app', 'Stories', '1080x1700', 1080, 1700, 'img', 'App'),

    Placement('banner_generico_criteo_pros', 'Banner Genérico', '1200x628', 1200, 628, 'img', 'Criteo PROS'),
    Placement('banner_cuadrado_criteo_pros', 'Banner Cuadrado', '1200x1200', 1200, 1200, 'img', 'Criteo PROS'),
    Placement('banner_vertical_criteo_pros', 'Banner Vertical', '800x1200', 800, 1200, 'img', 'Criteo PROS'),

    Placement('skyscraper_criteo_rtg', 'Skyscraper', '120x600', 120, 600, 'img', 'Criteo RTG'),
    Placement('wide_skyscraper_criteo_rtg', 'Wide Skyscraper', '160x600', 160, 600, 'img', 'Criteo RTG'),
    Placement('half_page_ad_criteo_rtg', 'Half Page Ad', '300x600', 300, 600, 'img', 'Criteo RTG'),
    Placement('medium_rectangle_criteo_rtg', 'Medium Rectangle', '300x250', 300, 250, 'img', 'Criteo RTG'),
    Placement('large_rectangle_criteo_rtg', 'Large Rectangle', '336x280', 336, 280, 'img', 'Criteo RTG'),
    Placement('mobile_leaderboard_criteo_rtg', 'Mobile Leaderboard', '320x50', 320, 50, 'img', 'Criteo RTG'),
    Placement('full_banner_criteo_rtg', 'Full Banner', '468x60', 468, 60, 'img', 'Criteo RTG'),
    Placement('leaderboard_criteo_rtg', 'Leaderboard', '728x90', 728, 90, 'img', 'Criteo RTG'),
    Placement('large_leaderboard_criteo_rtg', 'Large Leaderboard', '970x90', 970, 90, 'img', 'Criteo RTG'),
    Placement('billboard_criteo_rtg', 'Billboard', '970x250', 970, 250, 'img', 'Criteo RTG'),

    Placement('landscape_demand_gen', 'Landscape', '1200x628', 1200, 628, 'img', 'Demand Gen / TripMax'),
    Placement('square_demand_gen', 'Square', '1200x1200', 1200, 1200, 'img', 'Demand Gen / TripMax'),
    Placement('portrait_demand_gen', 'Portrait', '960x1200', 960, 1200, 'img', 'Demand Gen / TripMax'),

    Placement('image_feed_meta', 'Image Feed', '1080x1080', 1080, 1080, 'img', 'Meta'),
    Placement('stories_image_meta', 'Stories Image', '1080x1920', 1080, 1920, 'img', 'Meta'),
    Placement('video_feed_meta', 'Vídeo feed', '1080x1080', 1080, 1080, 'vid', 'Meta', seconds="10"),
    Placement('video_stories_meta', 'Vídeo stories', '1080x1920', 1080, 1920, 'vid', 'Meta', seconds="10"),

    Placement('desktop_newsletter', 'Desktop', '1200x900', 1200, 900, 'img', 'Newsletter'),
    Placement('mobile_newsletter', 'Mobile', '1200x1200', 1200, 1200, 'img', 'Newsletter'),
    Placement('footer_newsletter', 'Footer', '1200x900', 1200, 900, 'img', 'Newsletter'),

    Placement('slide_paquetes_riu_paquetes', 'Slide Paquetes RIU', '1366x600', 1366, 600, 'img', 'Paquetes'),
    Placement('slide_mobile_paquetes_riu_paquetes', 'Slide Mobile Paquetes RIU', '480x400', 480, 400, 'img', 'Paquetes'),
    Placement('slide_paquetes_us_ca_paquetes', 'Slide Paquetes US/CA', '1366x400', 1366, 400, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_1_paquetes', 'Paquetes MX: Banner 1', '1920x450', 1920, 450, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_1_mobile_paquetes', 'Paquetes MX: Banner 1 Mobile', '770x180', 770, 180, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_2_paquetes', 'Paquetes MX: Banner 2', '1366x597', 1366, 597, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_2_mobile_paquetes', 'Paquetes MX: Banner 2 Mobile', '590x258', 590, 258, 'img', 'Paquetes'),
    Placement('paquete_mx_banner_3_msi_paquetes', 'Paquete MX: Banner 3 MSI', '734x657', 734, 657, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_3_mobile_paquetes', 'Paquetes MX: Banner 3 Mobile', '284x258', 284, 258, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_4_cc_paquetes', 'Paquetes MX: Banner 4 CC', '734x657', 734, 657, 'img', 'Paquetes'),
    Placement('paquetes_mx_banner_4_mobile_paquetes', 'Paquetes MX: Banner 4 Mobile', '284x258', 284, 258, 'img', 'Paquetes'),
    Placement('paquete_mx_banner_5_paquetes', 'Paquete MX: Banner 5', '1920x450', 1920, 450, 'img', 'Paquetes'),
    Placement('paquete_mx_banner_5_mobile_paquetes', 'Paquete MX: Banner 5 Mobile', '770x180', 770, 180, 'img', 'Paquetes'),
    Placement('paquetes_latam_banner_1_paquetes', 'Paquetes LATAM Banner 1', '1920x545', 1920, 545, 'img', 'Paquetes'),
    Placement('paquetes_latam_banner_2_paquetes', 'Paquetes LATAM Banner 2', '1170x200', 1170, 200, 'img', 'Paquetes'),
    Placement('paquetes_latam_banner_2_var_paquetes', 'Paquetes LATAM Banner 2 (Var)', '570x200', 570, 200, 'img', 'Paquetes'),
    Placement('paquetes_us_ca_full_width_paquetes', 'Paquetes US/CA Full Width', '1593x330', 1593, 330, 'img', 'Paquetes'),
    Placement('paquetes_us_ca_full_width_mobile_paquetes', 'Paquetes US/CA Full Width/Mobile', '375x375', 375, 375, 'img', 'Paquetes'),
    Placement('paquetes_us_ca_large_native_paquetes', 'Paquetes US/CA Large Native', '2000x900', 2000, 900, 'img', 'Paquetes'),
    Placement('paquetes_us_ca_small_native_paquetes', 'Paquetes US/CA Small Native', '116x168', 116, 168, 'img', 'Paquetes'),

    Placement('videotemplate_vertical_smartly', 'Videotemplate vertical', '1080x1920', 1080, 1920, 'vid', 'Smartly', seconds="10"),
    Placement('videotemplate_cuadrado_smartly', 'Videotemplate cuadrado', '1080x1080', 1080, 1080, 'vid', 'Smartly', seconds="10"),
    Placement('imagetemplate_vertical_smartly', 'Imagetemplate vertical', '1080x1920', 1080, 1920, 'img', 'Smartly'),
    Placement('imagetemplate_cuadrado_smartly', 'Imagetemplate cuadrado', '1080x1080', 1080, 1080, 'img', 'Smartly'),

    Placement('banner_nativo_taboola', 'Banner Nativo', '1000x600', 1000, 600, 'img', 'Taboola'),

    Placement('video_vertical_tiktok', 'Vídeo vertical', '1080x1920', 1080, 1920, 'vid', 'TikTok', seconds="10"),
    Placement('display_card_tiktok', 'Display Card', '750x421', 750, 421, 'img', 'TikTok'),

    Placement('slide_ofertas_desktop_web', 'Slide ofertas desktop', '1366x600', 1366, 600, 'img', 'Web'),
    Placement('slide_ofertas_mobile_web', 'Slide ofertas mobile', '480x400', 480, 400, 'img', 'Web'),
    Placement('landing_desktop_web', 'Landing desktop', '2732x1200', 2732, 1200, 'img', 'Web'),
    Placement('landing_mobile_web', 'Landing mobile', '1200x1920', 1200, 1920, 'img', 'Web'),
    Placement('banner_home_web', 'Banner Home', '2732x1200', 2732, 1200, 'img', 'Web'),
    Placement('banner_home_mobile_web', 'Banner Home Mobile', '1200x1920', 1200, 1920, 'img', 'Web'),
    Placement('ficha_hotel_dispo_destino_mobile_web', 'Ficha Hotel, Dispo y Destino Mobile', '400x150', 400, 150, 'img', 'Web'),
    Placement('ficha_hotel_dispo_destino_web', 'Ficha Hotel, Dispo y Destino', '1200x100', 1200, 100, 'img', 'Web'),
    Placement('login_web', 'Login', '620x240', 620, 240, 'img', 'Web'),
    Placement('bh_por_segmento_web', 'BH por segmento', '2732x1200', 2732, 1200, 'img', 'Web'),
    Placement('bh_por_segmento_mobile_web', 'BH por segmento Mobile', '1200x1920', 1200, 1920, 'img', 'Web'),
    Placement('pop_up_web', 'Pop up', '1200x800', 1200, 800, 'img', 'Web'),

    Placement('video_horizontal_yt_demand', 'Vídeo horizontal', '1920x1080', 1920, 1080, 'vid', 'YT / Demand Gen', seconds="10"),
    Placement('video_vertical_yt_demand', 'Vídeo vertical', '1080x1920', 1080, 1920, 'vid', 'YT / Demand Gen', seconds="10"),
    Placement('video_cuadrado_yt_demand', 'Vídeo cuadrado', '1080x1080', 1080, 1080, 'vid', 'YT / Demand Gen', seconds="10"),
    Placement('banner_companion_yt_demand', 'Banner Companion', '300x60', 300, 60, 'img', 'YT / Demand Gen'),
]



class BriefingStore:
    def __init__(self):
        self.details = BriefingDetails()
        self.matrix: Dict[str, List[str]] = {} # selector -> List[placement_id]
        self.selected_markets: List[str] = [] # Legacy compatibility
        self.active_translation_market: str = "" # Legacy compatibility
        self.global_settings: Dict[str, List[str]] = {'AME': [], 'EMEA': [], 'APAC': []}
        
        self.creative = {'claim': '', 'cta': '', 'discount': '', 'usp1': '', 'usp2': '', 'usp3': ''}
        self.landing = {'title': '', 'subtitle': '', 'body': '', 'cta': ''}
        self.newsletter = {'subject': '', 'preview': '', 'header': '', 'body': '', 'cta': ''}
        self.locked_fields: List[str] = []
        self.active_content_tab: str = 'master'
        
        self.translations: Dict[str, Dict[str, str]] = {}
        self.trafficking: Dict[str, Dict[str, str]] = {}
        self.psd_templates: List[Dict[str, Any]] = []
        self.history: List[Dict[str, Any]] = []
        self.id: Optional[str] = None
        self.updated_at: float = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "updated_at": self.updated_at,
            "details": {k: v for k, v in self.details.__dict__.items()},
            "matrix": self.matrix,
            "selected_markets": self.selected_markets,
            "creative": self.creative,
            "landing": self.landing,
            "newsletter": self.newsletter,
            "locked_fields": self.locked_fields,
            "translations": self.translations,
            "trafficking": self.trafficking,
            "psd_templates": self.psd_templates,
            "history": self.history,
            "active_content_tab": self.active_content_tab
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BriefingStore':
        store = cls()
        store.id = data.get("id")
        store.updated_at = data.get("updated_at", 0)
        
        if "details" in data:
            for k, v in data["details"].items():
                if hasattr(store.details, k):
                    setattr(store.details, k, v)
        
        store.matrix = data.get("matrix", {})
        store.selected_markets = data.get("selected_markets", [])
        store.creative = data.get("creative", store.creative)
        store.landing = data.get("landing", store.landing)
        store.newsletter = data.get("newsletter", store.newsletter)
        store.locked_fields = data.get("locked_fields", [])
        store.translations = data.get("translations", {})
        store.trafficking = data.get("trafficking", {})
        store.psd_templates = data.get("psd_templates", [])
        store.history = data.get("history", [])
        store.active_content_tab = data.get("active_content_tab", "master")
        return store

    def clear(self):
        new_store = BriefingStore()
        # Keep id and updated_at reset
        new_store.id = None
        new_store.updated_at = 0
        self.__dict__.update(new_store.__dict__)

    def log_change(self, action: str, description: str, fields: Optional[Dict[str, Any]] = None):
        import time
        entry = {
            "timestamp": time.time(),
            "action": action,
            "description": description,
            "fields": fields or {}
        }
        self.history.insert(0, entry) # Most recent first
        if len(self.history) > 100:
            self.history = self.history[:100]

    def add_psd_template(self, name: str, filename: str, layers: List[Dict[str, Any]], size: tuple):
        template = {
            "id": str(uuid.uuid4()) if 'uuid' in globals() else filename, # Fallback if uuid not imported here
            "name": name,
            "filename": filename,
            "layers": layers,
            "size": size,
            "active": True if not self.psd_templates else False
        }
        self.psd_templates.append(template)
        self.log_change("PSD_UPLOADED", f"Uploaded template: {name}")

    def remove_psd_template(self, filename: str):
        self.psd_templates = [t for t in self.psd_templates if t['filename'] != filename]
        self.log_change("PSD_REMOVED", f"Removed template: {filename}")

    def set_details_field(self, field_name: str, value: Any):
        old_value = getattr(self.details, field_name, None)
        if old_value != value:
            setattr(self.details, field_name, value)
            self.log_change("DETAILS_UPDATED", f"Modified {field_name}", {"from": old_value, "to": value})

    def set_creative_field(self, field_name: str, value: Any):
        old_value = self.creative.get(field_name)
        if old_value != value:
            self.creative[field_name] = value
            self.log_change("CREATIVE_UPDATED", f"Modified {field_name}", {"from": old_value, "to": value})

    def set_trafficking_field(self, row_id: str, field_name: str, value: str):
        if row_id not in self.trafficking:
            self.trafficking[row_id] = {}
        old_value = self.trafficking[row_id].get(field_name)
        if old_value != value:
            self.trafficking[row_id][field_name] = value
            # Bulk updates might flood history, so we could silence them or group them
            # For now, let's log them
            self.log_change("TRAFFICKING_UPDATED", f"Updated {field_name} for {row_id}")

    def set_layer_mapping(self, template_id: str, mapping: Dict[str, str]):
        template = next((t for t in self.psd_templates if t['id'] == template_id), None)
        if template:
            template['layer_mapping'] = mapping
            self.log_change("PSD_MAPPING_UPDATED", f"Updated layer mapping for {template['name']}")

    def _sync_selected_markets(self):
        active_selectors = set(s for s, pids in self.matrix.items() if pids)
        self.selected_markets = sorted(list(set(m.code for m in MARKETS if m.selector in active_selectors)))

    def toggle_placement(self, market_selector: str, placement_id: str):
        selected = self.matrix.get(market_selector, [])
        if placement_id in selected:
            selected.remove(placement_id)
            self.log_change("PLACEMENT_REMOVED", f"Removed {placement_id} from {market_selector}")
        else:
            selected.append(placement_id)
            self.log_change("PLACEMENT_ADDED", f"Added {placement_id} to {market_selector}")
        self.matrix[market_selector] = selected
        self._sync_selected_markets()

    def toggle_market_all(self, market_selector: str, placement_ids: List[str], force: bool):
        if force:
            self.matrix[market_selector] = list(set(self.matrix.get(market_selector, []) + placement_ids))
            self.log_change("MARKET_UPDATED", f"Enabled all placements for {market_selector}")
        else:
            current = self.matrix.get(market_selector, [])
            self.matrix[market_selector] = [pid for pid in current if pid not in placement_ids]
            self.log_change("MARKET_UPDATED", f"Cleared all placements for {market_selector}")
        self._sync_selected_markets()

    def handle_bulk_channel_toggle(self, region: str, channel: str, force: bool):
        channel_pids = [p.id for p in PLACEMENTS if p.channel == channel]
        region_markets = [m for m in MARKETS if m.region == region]
        for m in region_markets:
            if force:
                self.matrix[m.selector] = list(set(self.matrix.get(m.selector, []) + channel_pids))
            else:
                current = self.matrix.get(m.selector, [])
                self.matrix[m.selector] = [pid for pid in current if pid not in channel_pids]
        self.log_change("BULK_ACTION", f"{'Enabled' if force else 'Disabled'} {channel} for {region}")
        self._sync_selected_markets()

    def sync_to_region(self, source_selector: str, region: str):
        source_pids = self.matrix.get(source_selector, [])
        region_markets = [m for m in MARKETS if m.region == region]
        for m in region_markets:
            self.matrix[m.selector] = list(source_pids)
        self._sync_selected_markets()

    def get_target_languages(self) -> List[str]:
        active_selectors = [s for s, pids in self.matrix.items() if pids]
        master_lang = self.details.defaultLanguage or 'en'
        codes = set()
        for sel in active_selectors:
            lookup = 'CN (China)' if sel.startswith('ZH') else sel
            m = next((m for m in MARKETS if m.selector == lookup), None)
            if m and m.region in self.details.regions and m.defaultLanguage != master_lang:
                codes.add(m.defaultLanguage)
        return sorted(list(codes))

    def toggle_region(self, region: str):
        if region in self.details.regions:
            self.details.regions.remove(region)
            # Cleanup matrix for markets in that region
            to_remove = [s for s in self.matrix if next((m.region for m in MARKETS if m.selector == s), '') == region]
            for s in to_remove:
                del self.matrix[s]
        else:
            self.details.regions.append(region)
        self._sync_selected_markets()

    def set_translation(self, lang: str, values: Dict[str, Any]):
        self.translations[lang] = values

    def get_selected_count(self, selector: str) -> int:
        return len(self.matrix.get(selector, []))

    def get_active_channels(self, selector: str) -> List[str]:
        selected_ids = self.matrix.get(selector, [])
        active = set()
        for p in PLACEMENTS:
            if p.id in selected_ids:
                active.add(p.channel)
        return sorted(list(active))

    def set_trafficking(self, row_id: str, data: Dict[str, str]):
        if row_id not in self.trafficking:
            self.trafficking[row_id] = {}
        self.trafficking[row_id].update(data)

    def generate_utm_url(self, row_id: str) -> str:
        data = self.trafficking.get(row_id, {})
        base_url = data.get('landing_page', self.details.landingPageUrl)
        if not base_url: return ""
        params = []
        if data.get('utm_source'): params.append(f"utm_source={data['utm_source']}")
        if data.get('utm_medium'): params.append(f"utm_medium={data['utm_medium']}")
        if data.get('utm_campaign'): params.append(f"utm_campaign={data['utm_campaign']}")
        if not params: return base_url
        separator = '&' if '?' in base_url else '?'
        return f"{base_url}{separator}{'&'.join(params)}"

    def toggle_field_lock(self, field_name: str):
        if field_name in self.locked_fields:
            self.locked_fields.remove(field_name)
        else:
            self.locked_fields.append(field_name)

    def generate_expected_assets(self) -> List[Dict[str, str]]:
        assets = []
        for market_selector, pids in self.matrix.items():
            if not pids: continue
            
            # Resolve market
            lookup = 'CN (China)' if market_selector.startswith('ZH') else market_selector
            m = next((m for m in MARKETS if m.selector == lookup), None)
            if not m: continue
            
            for pid in pids:
                p = next((pl for pl in PLACEMENTS if pl.id == pid), None)
                if not p: continue
                
                # Naming Logic (Simplified Parity)
                strategy = (self.details.strategy or 'strategy').lower().replace(' ', '_')
                brand = (self.details.brand or 'brand').lower().replace(' ', '_')
                campaign = (self.details.campaignName or 'campaign').lower().replace(' ', '_')
                market_code = m.code.lower()
                lang = m.defaultLanguage.lower()
                
                # Parts for filename
                parts = [
                    p.size,
                    p.format,
                    strategy,
                    brand,
                    campaign,
                    market_code,
                    lang,
                    'v1'
                ]
                filename = "-".join(str(pt) for pt in parts if pt).lower().replace(' ', '_')
                
                row_id = f"{market_selector}_{pid}"
                
                # Ensure trafficking entry exists
                if row_id not in self.trafficking:
                    self.trafficking[row_id] = {
                        'landing_page': '',
                        'utm_source': self.details.agency or 'agency',
                        'utm_medium': 'display',
                        'utm_campaign': self.details.campaignName or 'campaign',
                        'click_tracker': '',
                        'impression_tracker': ''
                    }
                
                assets.append({
                    'row_id': row_id,
                    'filename': filename,
                    'ext': '.jpg' if p.format == 'img' else '.mp4',
                    'market': m.code,
                    'size': p.size,
                    'format': p.name,
                    'channel': p.channel,
                    'market_selector': market_selector,
                    'placement_id': pid
                })
        return assets

    def resolve_asset_content(self, market_selector: str) -> Dict[str, str]:
        # Helper to resolve content for an asset, falling back to master creative
        lookup = 'CN (China)' if market_selector.startswith('ZH') else market_selector
        m = next((m for m in MARKETS if m.selector == lookup), None)
        if not m: return self.creative
        
        lang = m.defaultLanguage
        local_trans = self.translations.get(lang, {})
        
        # Standard fields from content-form.tsx / creative-content.py
        fields = ['claim', 'cta', 'discount', 'usp1', 'usp2', 'usp3']
        result = {}
        for f in fields:
            # Check translation, then master creative
            val = local_trans.get(f) or self.creative.get(f, '')
            result[f] = val
        return result

    def ensure_translation_structure(self, lang: str):
        if lang not in self.translations:
            self.translations[lang] = {
                'claim': '', 
                'cta': '', 
                'discount': '', 
                'usp1': '', 
                'usp2': '', 
                'usp3': ''
            }

    def generate_csv(self, export_type: str = 'media') -> str:
        assets = self.generate_expected_assets()
        if not assets: return ""
        
        if export_type == 'media':
            headers = ['Filename', 'Market', 'Placement', 'Size', 'Format', 'Channel']
            rows = [",".join(headers)]
            for r in assets:
                rows.append(",".join([r['filename'], r['market'], r['format'], r['size'], r['format'], r['channel']]))
            return "\n".join(rows)
            
        elif export_type == 'creative':
            # Deduplicate for Creative Rows
            creative_rows = []
            seen_keys = set()
            for a in assets:
                key = f"{a['market']}-{a['market_selector']}"
                if key in seen_keys: continue
                seen_keys.add(key)
                content = self.resolve_asset_content(a['market_selector'])
                creative_rows.append({'filename': a['filename'], 'market': a['market'], 'content': content})

            headers = ['dataset_name', 'market_language', 'Claim', 'Discount', 'CTA', 'USP1', 'USP2', 'USP3']
            rows = [",".join(headers)]
            for r in creative_rows:
                c = r['content']
                line = [r['filename'], r['market'], f'"{c["claim"]}"', f'"{c["discount"]}"', f'"{c["cta"]}"', 
                        f'"{c["usp1"]}"', f'"{c["usp2"]}"', f'"{c["usp3"]}"']
                rows.append(",".join(line))
            return "\n".join(rows)
            
        elif export_type == 'trafficking':
            headers = ['Market', 'Placement', 'Size', 'Channel', 'Landing Page', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Click Tracker', 'Impression Tracker', 'Final URL']
            rows = [",".join(headers)]
            for a in assets:
                rid = a['row_id']
                d = self.trafficking.get(rid, {})
                final_url = self.generate_utm_url(rid)
                row = [a['market'], a['format'], a['size'], a['channel'], f'"{d.get("landing_page", "")}"',
                       f'"{d.get("utm_source", "")}"', f'"{d.get("utm_medium", "")}"', f'"{d.get("utm_campaign", "")}"',
                       f'"{d.get("click_tracker", "")}"', f'"{d.get("impression_tracker", "")}"', f'"{final_url}"']
                rows.append(",".join(row))
            return "\n".join(rows)
        
        return ""

store = BriefingStore()
