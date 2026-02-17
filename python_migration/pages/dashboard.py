from nicegui import ui
from components.header import dashboard_header
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/')
def dashboard_page():
    with layout_wrapper():
        dashboard_header()
        
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-10'):
            # Stats Grid
            with ui.grid(columns=4).classes('w-full gap-4'):
                stats = [
                    ('Active Campaigns', '12', '+2 this week'),
                    ('Total Assets', '1,240', '12% inc'),
                    ('Avg Markets', '4', None),
                    ('Top Channel', 'Social', None),
                ]
                for label, value, trend in stats:
                    with ui.card().classes('bg-[#1C1C21] border-[#212126] p-5 gap-1 shadow-card rounded-xl'):
                        ui.label(label).classes('text-xs text-zinc-500 font-semibold tracking-wider uppercase')
                        ui.label(value).classes('text-3xl font-bold font-mono')
                        if trend:
                            ui.label(trend).classes('text-[10px] text-green-500 font-medium')

            # Recent Briefs Section
            with ui.column().classes('w-full gap-6'):
                ui.label('Recent Briefs').classes('text-xl font-bold tracking-tight')
                
                with ui.grid(columns=3).classes('w-full gap-5'):
                     briefs = [
                         ('Summer Campaign 2024', 'Global (DE, FR, UK)'),
                         ('Black Friday Prep', 'EU Only'),
                         ('Q3 Social Push', 'NA (US, CA)'),
                     ]
                     for name, market in briefs:
                         with ui.card().classes('bg-[#1C1C21] border-[#212126] p-6 hover:border-[#e4002b] transition-all duration-300 cursor-pointer shadow-card rounded-xl group'):
                             with ui.row().classes('w-full justify-between items-start'):
                                 ui.badge('Active', color='green').classes('text-[9px] uppercase font-black px-2 py-0.5')
                                 ui.icon('more_horiz').classes('text-zinc-500 group-hover:text-white transition-colors')
                             
                             ui.label(name).classes('text-lg font-bold mt-4 leading-tight')
                             ui.label(market).classes('text-sm text-zinc-500 mt-1')
                             
                             with ui.row().classes('w-full mt-6 justify-between items-center pt-4 border-t border-zinc-800'):
                                 with ui.row().classes('gap-1'):
                                     ui.icon('layers', size='14px').classes('text-zinc-500')
                                     ui.label('45 Layers').classes('text-[10px] text-zinc-500 font-medium uppercase')
                                 ui.button('Open', on_click=lambda name=name: ui.open(f'/editor/{name.replace(" ", "-").lower()}')).classes('text-[10px] font-black uppercase text-zinc-400 h-6 px-3 bg-zinc-800 rounded-lg')
