from nicegui import ui
from theme import THEME

def naming_editor():
    with ui.column().classes('w-full gap-8'):
        # 1. Live Preview Hero
        with ui.card().classes('w-full bg-white rounded-3xl p-10 flex flex-col items-center justify-center gap-6 shadow-2xl'):
            ui.label('FILENAME PREVIEW').classes('text-[10px] font-black text-zinc-400 uppercase tracking-widest')
            
            with ui.row().classes('font-mono text-xl tracking-tight break-all bg-zinc-50 px-8 py-6 rounded-2xl border border-zinc-200 w-full text-center text-zinc-800'):
                tokens = [
                    ('300x250', 'text-blue-600'), ('html5', 'text-blue-600'), 
                    ('prospecting', 'text-primary'), ('2025', 'text-emerald-600'), 
                    ('01', 'text-emerald-600'), ('Acme_Brand', 'text-zinc-800'),
                    ('Social', 'text-zinc-800'), ('Summer_Sale', 'text-primary'),
                    ('DE', 'text-zinc-800'), ('de', 'text-zinc-800'),
                    ('Agency', 'text-zinc-800'), ('content', 'text-zinc-800')
                ]
                for i, (val, cls) in enumerate(tokens):
                    ui.label(val).classes(cls)
                    if i < len(tokens) - 1:
                        ui.label('-').classes('text-zinc-300 mx-0.5 font-bold')
                ui.label('.zip').classes('text-zinc-400')

            with ui.row().classes('items-center gap-4'):
                ui.label('Separator').classes('text-xs font-bold text-zinc-500')
                with ui.row().classes('p-1 bg-zinc-100 rounded-full border border-zinc-200'):
                    ui.button('-', icon='remove').props('flat round size=xs').classes('bg-primary text-white shadow-lg h-8 w-8')
                    ui.button('.', icon='circle').props('flat round size=xs').classes('text-zinc-400 h-8 w-8')

        # 2. Builder & Available Tokens
        with ui.grid(columns=12).classes('w-full gap-8'):
            # Structure Builder
            with ui.column().classes('col-span-8 gap-4'):
                with ui.row().classes('w-full justify-between items-center'):
                    with ui.column().classes('gap-0'):
                        ui.label('Structure Builder').classes('text-lg font-bold text-white')
                        ui.label('Drag tokens to reorder your naming convention.').classes('text-sm text-zinc-500')
                    ui.badge('12 TOKENS ACTIVE', color='primary').classes('text-[9px] font-black px-2')
                
                with ui.card().classes('w-full bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-3xl min-h-[160px] p-8 flex flex-wrap gap-3 items-center justify-center'):
                    active_tokens = [
                        ('size', 'Specs'), ('format', 'Specs'), ('strategy', 'Campaign'),
                        ('year', 'Date'), ('month', 'Date'), ('brand', 'Campaign'),
                        ('channel', 'Campaign'), ('campaign_name', 'Campaign'),
                        ('market_code', 'Campaign'), ('language', 'Meta'),
                        ('agency', 'Meta'), ('content_type', 'Specs')
                    ]
                    for i, (name, cat) in enumerate(active_tokens):
                        color = 'blue' if cat == 'Specs' else 'primary' if cat == 'Campaign' else 'emerald' if cat == 'Date' else 'zinc'
                        with ui.row().classes(f'items-center gap-2 px-4 py-2 rounded-full border border-{color}-900/30 bg-{color}-900/10 text-{color}-400 group cursor-grab'):
                            ui.icon('drag_indicator', size='xs').classes('opacity-30 group-hover:opacity-100')
                            ui.label(name).classes('text-xs font-bold uppercase tracking-tight')
                            ui.icon('close', size='xs').classes('opacity-0 group-hover:opacity-100 text-red-400 cursor-pointer')
                        if i < len(active_tokens) - 1:
                            ui.label('-').classes('text-zinc-800 font-bold')

            # Available Tokens
            with ui.column().classes('col-span-4 gap-6'):
                ui.label('Available Tokens').classes('text-[10px] font-black text-zinc-500 uppercase tracking-widest')
                
                categories = [
                    ('Specs', 'blue', ['size', 'format', 'content_type', 'duration', 'version']),
                    ('Campaign', 'primary', ['strategy', 'brand', 'channel', 'campaign_name', 'market_code']),
                    ('Date', 'emerald', ['year', 'month']),
                    ('Meta', 'zinc', ['language', 'agency'])
                ]
                
                for cat, color, items in categories:
                    with ui.column().classes('w-full gap-2'):
                        ui.label(cat).classes(f'text-[9px] font-black text-{color}-600/50 uppercase tracking-widest')
                        with ui.row().classes('flex-wrap gap-2'):
                            for item in items:
                                with ui.button().props('flat').classes(f'px-3 py-1.5 rounded-full border border-{color}-900/30 bg-{color}-900/5 text-{color}-500 hover:bg-{color}-900/10 transition-all'):
                                    with ui.row().classes('items-center gap-1.5'):
                                        ui.icon('add', size='xs').classes('opacity-50')
                                        ui.label(item).classes('text-[10px] font-bold uppercase tracking-tight')

        # 3. Presets
        ui.separator().classes('bg-zinc-800/50 my-4')
        with ui.column().classes('w-full gap-6'):
            ui.label('Saved Presets').classes('text-[10px] font-black text-zinc-500 uppercase tracking-widest')
            with ui.grid(columns=3).classes('w-full gap-4'):
                # Reset Default
                with ui.card().classes('p-6 bg-zinc-900 border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all cursor-pointer group'):
                    with ui.row().classes('items-center gap-3'):
                        with ui.row().classes('w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors'):
                            ui.icon('restart_alt')
                        with ui.column().classes('gap-0'):
                            ui.label('Restore Default').classes('text-sm font-bold')
                            ui.label('System standard').classes('text-[10px] text-zinc-500')
                
                # Custom Presets
                for name, count in [('Standard Display', 12), ('Social Media', 8)]:
                    with ui.card().classes('p-6 bg-white border-zinc-200 rounded-3xl shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer group relative'):
                        with ui.row().classes('items-center gap-3'):
                            with ui.row().classes('w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary'):
                                ui.icon('description')
                            with ui.column().classes('gap-0'):
                                ui.label(name).classes('text-sm font-bold text-zinc-800')
                                ui.label(f'{count} tokens').classes('text-[10px] text-zinc-500')
                        ui.button(icon='delete').props('flat round size=xs').classes('absolute top-2 right-2 text-zinc-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity')

            with ui.row().classes('w-full max-w-md gap-3 mt-4'):
                ui.input(placeholder='Name your current setup...').classes('flex-1 bg-zinc-900 border-zinc-800 rounded-xl h-11 px-6 text-sm')
                ui.button('Save Preset', icon='save').props('flat size=sm').classes('bg-primary text-white radius-btn font-bold px-8 h-11 shadow-lg shadow-primary/20')
