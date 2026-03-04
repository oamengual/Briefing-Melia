from nicegui import ui
from theme import THEME
from logic.briefing_store import store, MARKETS, PLACEMENTS
import json

@ui.refreshable
def feed_preview():
    state = {'tab': 'creative'}
    assets = store.generate_expected_assets()
    
    # 1. Deduplicate for Creative Rows (one per market-language)
    creative_rows = []
    seen_keys = set()
    for a in assets:
        key = f"{a['market']}-{a['market_selector']}" # Use selector to keep them unique per market
        if key in seen_keys: continue
        seen_keys.add(key)
        
        content = store.resolve_asset_content(a['market_selector'])
        # Filename for creative row (GENERIC-strategy-brand-campaign-code-lang)
        parts = [
            'GENERIC', 
            store.details.strategy or 'na', 
            store.details.brand or 'na', 
            store.details.campaignName or 'CAMPAIGN', 
            a['market'], 
            a['market_selector'].split('(')[-1].replace(')', '').strip().lower() # Simplified lang extraction or use m.defaultLanguage
        ]
        filename = "-".join(str(p).lower().replace(' ', '_') for p in parts if p).replace('--', '-')
        creative_rows.append({
            'filename': filename,
            'market': a['market'],
            'content': content,
            'market_selector': a['market_selector']
        })

    # 2. Detect Active Creative Fields
    active_usp = {
        'usp1': any(r['content'].get('usp1') for r in creative_rows),
        'usp2': any(r['content'].get('usp2') for r in creative_rows),
        'usp3': any(r['content'].get('usp3') for r in creative_rows),
    }

    def download_csv():
        try:
            content = store.generate_csv(state['tab'])
            filename = f"feed_{state['tab']}_{store.details.campaignName or 'draft'}.csv"
            ui.download(content.encode('utf-8'), filename)
            ui.notify(f"{state['tab'].title()} feed exported successfully", color='positive')
        except Exception as e:
            ui.notify(f'Export failed: {str(e)}', color='negative')

    if not assets:
        with ui.column().classes('w-full items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center'):
            ui.icon('database', size='lg').classes('text-slate-300 mb-4')
            ui.label('Select markets and placements to populate the feeds.').classes('text-sm text-slate-500 font-medium')
            return

    current_rows = assets if state['tab'] == 'media' else creative_rows

    with ui.column().classes('w-full gap-8 animate-fade-in'):
        # Header Area
        with ui.row().classes('w-full justify-between items-center'):
            with ui.column().classes('gap-1'):
                ui.label('Output Feeds').classes('text-2xl font-bold text-slate-900')
                with ui.row().classes('items-center gap-1 text-sm text-slate-500'):
                    ui.label('Generated').classes('font-medium')
                    ui.label(f'{len(current_rows)} rows').classes(f'text-[{THEME["primary"]}] font-bold')
                    ui.label(f'for {"File Naming" if state["tab"] == "media" else "Photoshop Data"}.')

            # Tab Switcher
            with ui.row().classes('bg-slate-100 p-1 rounded-xl border border-slate-200'):
                def set_tab(t):
                    state['tab'] = t
                    feed_preview.refresh()
                
                for t_id, label, icon in [('creative', 'Photoshop Content', 'image'), ('media', 'File Naming', 'description')]:
                    is_active = state['tab'] == t_id
                    bg = 'bg-white shadow-sm text-slate-900' if is_active else 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    ui.button(on_click=lambda t=t_id: set_tab(t)) \
                        .props(f'flat dense icon={icon} label="{label}" size=sm') \
                        .classes(f'h-8 px-4 rounded-lg text-[10px] font-black tracking-wide transition-all {bg}')

        # Table Container
        with ui.card().classes('w-full p-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'):
            with ui.scroll_area().classes('w-full h-[500px]'):
                # Custom CSS for table borders and sticky header
                ui.add_head_html('''
                    <style>
                        .feed-table th { background: #f8fafc; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 20; }
                        .feed-table td { border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
                    </style>
                ''')

                with ui.element('table').classes('w-full text-left border-collapse feed-table'):
                    with ui.element('thead'):
                        with ui.element('tr'):
                            ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'ID / FILENAME'
                            if state['tab'] == 'media':
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'EXT'
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'MARKET'
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'SIZE'
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'CHANNEL'
                            else:
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'MARKET-LANG'
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'CLAIM'
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'DISCOUNT'
                                ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'CTA'
                                if active_usp['usp1']: ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'USP1'
                                if active_usp['usp2']: ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'USP2'
                                if active_usp['usp3']: ui.element('th').classes('px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest').text = 'USP3'

                    with ui.element('tbody'):
                        if state['tab'] == 'media':
                            for row in assets:
                                with ui.element('tr').classes('hover:bg-slate-50 transition-colors'):
                                    ui.element('td').classes('px-6 py-3 font-mono text-[10px] font-bold text-slate-900').text = row['filename']
                                    with ui.element('td').classes('px-6 py-3'):
                                        ui.label(row['ext']).classes('px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-400 rounded-md border border-slate-200')
                                    ui.element('td').classes('px-6 py-3 text-[11px] font-black text-slate-900 uppercase').text = row['market']
                                    with ui.element('td').classes('px-6 py-3'):
                                        ui.label(row['size']).classes('px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded-md border border-slate-200')
                                    ui.element('td').classes('px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight').text = row['channel']
                        else:
                            for row in creative_rows:
                                with ui.element('tr').classes('hover:bg-slate-50 transition-colors'):
                                    ui.element('td').classes('px-6 py-3 font-mono text-[10px] font-bold text-slate-900').text = row['filename']
                                    with ui.element('td').classes('px-6 py-3'):
                                        ui.label(row['market'].upper()).classes(f'px-2 py-0.5 bg-[{THEME["primary"]}]/10 text-[9px] font-black text-[{THEME["primary"]}] rounded-md uppercase tracking-wider')
                                    ui.element('td').classes('px-6 py-3 text-xs font-semibold text-slate-900 truncate max-w-[200px]').text = row['content']['claim']
                                    ui.element('td').classes('px-6 py-3 text-xs text-slate-500').text = row['content']['discount']
                                    ui.element('td').classes('px-6 py-3 text-xs text-slate-500').text = row['content']['cta']
                                    if active_usp['usp1']: ui.element('td').classes('px-6 py-3 text-xs text-slate-500').text = row['content']['usp1']
                                    if active_usp['usp2']: ui.element('td').classes('px-6 py-3 text-xs text-slate-500').text = row['content']['usp2']
                                    if active_usp['usp3']: ui.element('td').classes('px-6 py-3 text-xs text-slate-500').text = row['content']['usp3']

            # Footer / Action
            with ui.row().classes('w-full p-6 border-t border-slate-100 bg-slate-50/30 justify-end'):
                ui.button(f'Download {"Naming" if state["tab"] == "media" else "Photoshop"} CSV', icon='download', on_click=download_csv) \
                  .props('unelevated rounded size=md') \
                  .classes(f'bg-[{THEME["primary"]}] text-white font-bold text-xs px-6 shadow-sm')
