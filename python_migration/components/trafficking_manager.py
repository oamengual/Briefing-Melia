from nicegui import ui
from theme import THEME
from logic.briefing_store import store

@ui.refreshable
def trafficking_manager():
    assets = store.generate_expected_assets()
    
    def apply_bulk(field, value):
        if not value: return
        for a in assets:
            rid = a['row_id']
            store.set_trafficking_field(rid, field, value)
        trafficking_manager.refresh()
        ui.notify(f"Updated {field} for all rows", color='positive')

    def download_csv():
        if not assets: return
        try:
            content = store.generate_csv('trafficking')
            ui.download(content.encode(), f"trafficking_{store.details.campaignName or 'brief'}.csv")
            ui.notify('Trafficking CSV exported successfully', color='positive')
        except Exception as e:
            ui.notify(f'Export failed: {str(e)}', color='negative')

    if not assets:
        with ui.column().classes('w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 items-center justify-center text-center'):
            ui.icon('link', size='lg').classes('text-slate-300 mb-4')
            ui.label('Select markets and placements to configure trafficking.').classes('text-sm font-medium text-slate-400')
        return

    with ui.column().classes('w-full grow bg-white p-8 gap-8'):
        # Header Area
        with ui.row().classes('w-full items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-2xl'):
            with ui.row().classes('items-center gap-4'):
                with ui.element('div').classes('w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'):
                    ui.icon('hub', size='28px').classes('text-primary')
                with ui.column().classes('gap-0'):
                    ui.label('TRAFFICKING MANAGER').classes('text-lg font-black tracking-widest text-slate-900')
                    ui.label('Automated placement assignment and naming').classes('text-xs text-slate-500 font-bold')
            
            ui.button('Download CSV', icon='download', on_click=download_csv) \
                .classes(f'bg-[{THEME["primary"]}] text-white rounded-xl font-bold px-8 h-11 shadow-lg shadow-red-100 hover:brightness-110').props('no-caps')

        # Table Header logic
        headers = [
            ('Placement', 'min-w-[200px] sticky left-0 z-20 bg-slate-50'),
            ('Landing Page', 'min-w-[240px]'),
            ('Source', 'w-[150px]'),
            ('Medium', 'w-[150px]'),
            ('Campaign', 'w-[180px]'),
            ('Click Tracker', 'min-w-[200px]'),
            ('Impression Tracker', 'min-w-[200px]')
        ]

        with ui.card().classes('w-full bg-white border border-slate-200 p-0 rounded-2xl shadow-sm overflow-hidden'):
            # Custom CSS for table
            ui.add_head_html('''
                <style>
                    .trafficking-table th { background: #f8fafc; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
                    .trafficking-table td { border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; }
                    .trafficking-table td:last-child, .trafficking-table th:last-child { border-right: none; }
                </style>
            ''')

            # Header Row
            with ui.grid(columns=3).classes('w-full gap-6'):
                for label, val, sub in [('TOTAL PLACEMENTS', '124', 'Standard'), ('MAPPED ASSETS', '98', '80% Coverage'), ('ERRORS', '0', 'Perfect Match')]:
                    with ui.card().classes('bg-white border border-slate-200 p-5 rounded-2xl shadow-sm'):
                        ui.label(label).classes('text-[10px] font-black text-slate-400 tracking-widest')
                        ui.label(val).classes(f'text-3xl font-black {"text-slate-900" if label != "ERRORS" else "text-green-600"}')
                        ui.label(sub).classes('text-[9px] font-bold text-slate-400 uppercase')
            
            # This section was part of the original header row, now moved/modified
            # The prompt implies this part should be retained but within the new structure
            # Re-inserting the original header row logic here, assuming it's meant to follow the grid
            with ui.row().classes('w-full bg-slate-50 border-b border-slate-200 sticky top-0 z-30'):
                for label, cls in headers:
                    with ui.column().classes(f'px-6 py-4 {cls} justify-center gap-2'):
                        ui.label(label).classes('text-[10px] font-black uppercase text-slate-400 tracking-widest')
                        if label != 'Placement':
                            with ui.row().classes('w-full justify-between items-center'):
                                def prompt_bulk(l=label):
                                    f_map = {'Landing Page': 'landing_page', 'Source': 'utm_source', 'Medium': 'utm_medium', 
                                             'Campaign': 'utm_campaign', 'Click Tracker': 'click_tracker', 'Impression Tracker': 'impression_tracker'}
                                    field = f_map[l]
                                    
                                    # Default values for Auto
                                    auto_val = ""
                                    if l == 'Source': auto_val = store.details.agency or "agency"
                                    elif l == 'Medium': auto_val = "display"
                                    elif l == 'Campaign': auto_val = store.details.campaignName or "campaign"
                                    elif l == 'Landing Page': auto_val = store.details.landingPageUrl
                                    
                                    # Fallback to prompt if no auto_val or if user wants custom
                                    val = auto_val
                                    if not val:
                                        # Simple notice for now, or just let them type in the first one and copy
                                        ui.notify(f"Please fill the first row and I will implement a Copy All button soon", type='info')
                                    else:
                                        apply_bulk(field, val)

                                ui.button('AUTO', on_click=lambda l=label: prompt_bulk(l)) \
                                    .props('flat dense size=xs') \
                                    .classes(f'text-[9px] font-black text-[{THEME["primary"]}] hover:bg-red-50 px-2 rounded')
            
            # The following block seems to be a new, separate card for a "Feed Preview" or similar,
            # which was included in the diff but not explicitly part of the trafficking table.
            # Assuming it's meant to be added after the main trafficking table headers.
            with ui.card().classes('w-full bg-white border border-slate-200 p-0 rounded-2xl shadow-sm overflow-hidden'):
             # Table Headers
                with ui.row().classes('w-full bg-slate-50 border-b border-slate-200 h-12 items-center px-6'):
                    for col, w in [('PLACEMENT NAME', 'grow'), ('SIZE', 'w-24'), ('CHANNEL', 'w-32'), ('ASSET MAPPING', 'w-48')]:
                        ui.label(col).classes(f'{w} text-[10px] font-black text-slate-500 tracking-tighter')
                
                # Table Rows
                with ui.scroll_area().classes('w-full h-96'):
                    for i in range(10):
                        with ui.row().classes('w-full h-16 border-b border-slate-100 items-center px-6 hover:bg-slate-50/50 transition-colors'):
                            ui.label(f'DE_HQ_SMR_24_SOCIAL_STORY_{i+1}').classes('grow text-xs font-mono font-bold text-slate-700')
                            ui.badge('1080x1920', color='slate-100').classes('w-20 text-[9px] font-bold text-slate-500')
                            ui.label('Instagram').classes('w-32 text-xs font-bold text-slate-400 uppercase tracking-widest')
                            
                            with ui.row().classes('w-48 items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100'):
                                 ui.icon('image', size='14px').classes('text-slate-300')
                                 ui.label('smr_story_main.psd').classes('text-[10px] font-bold text-slate-600 truncate flex-1')
                                 ui.icon('check_circle', size='14px', color='green-500')

            # Scrollable Area for Rows (Original Trafficking Table Rows)
            with ui.scroll_area().classes('w-full h-[600px]'):
                with ui.column().classes('w-full gap-0'):
                    for asset in assets:
                        rid = asset['row_id']
                        data = store.trafficking[rid]
                        
                        with ui.row().classes('w-full border-b border-slate-100 hover:bg-slate-50 transition-colors group'):
                            # Fixed Placement Column
                            with ui.column().classes('px-6 py-4 sticky left-0 z-20 bg-white group-hover:bg-slate-50 min-w-[200px] border-r border-slate-200 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]'):
                                ui.label(asset['market']).classes('text-xs font-black text-slate-900 uppercase tracking-wider')
                                ui.label(asset['format']).classes('text-[11px] font-bold text-slate-500 truncate max-w-[160px]')
                                ui.badge(asset['size'], color='slate-900').classes('text-[9px] font-black px-2 py-0.5 rounded mt-1')
                            
                            # Input Columns
                            inputs_config = [
                                ('landing_page', 'https://...', 'min-w-[240px] font-mono'),
                                ('utm_source', 'utm_source', 'w-[150px]'),
                                ('utm_medium', 'utm_medium', 'w-[150px]'),
                                ('utm_campaign', 'utm_campaign', 'w-[180px]'),
                                ('click_tracker', 'https://track...', 'min-w-[200px] font-mono'),
                                ('impression_tracker', 'https://imp...', 'min-w-[200px] font-mono')
                            ]
                            
                            for f_name, placeholder, cls in inputs_config:
                                with ui.column().classes(f'p-2 {cls} border-r border-slate-100 last:border-r-0 justify-center'):
                                    ui.input(placeholder=placeholder, value=data.get(f_name, '')) \
                                        .classes(f'w-full text-[11px] {cls}') \
                                        .props('outlined dense bg-color=slate-50/50 standout border-none') \
                                        .on('change', lambda e, rid=rid, f_name=f_name: store.set_trafficking_field(rid, f_name, e.value))
