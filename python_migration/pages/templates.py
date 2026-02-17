from nicegui import ui
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/templates')
def templates_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-zinc-800 bg-[#09090b]'):
            with ui.column().classes('gap-1'):
                ui.label('Campaign Templates').classes('text-3xl font-bold tracking-tight')
                ui.label('Accelerate your workflow with pre-configured placement mixes and strategies.').classes('text-base text-zinc-500')

        # Content Area
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-10'):
            # Categories / Tabs
            with ui.tabs().classes('w-full bg-transparent border-b border-zinc-800') as tabs:
                ui.tab('All').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('Market').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('Region').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('Channel').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('Objective').classes('text-sm font-bold uppercase tracking-widest')

            with ui.tab_panels(tabs, value='All').classes('w-full bg-transparent p-0 mt-8'):
                with ui.tab_panel('All'):
                    # Templates Grid
                    with ui.grid(columns=4).classes('w-full gap-6'):
                        templates = [
                            ('Global Launch', 'Market', 'Standard global rollout with all regions.', ['Global', 'Hifi']),
                            ('EU Social Push', 'Region', 'Optimized for European social channels.', ['EU', 'Social']),
                            ('NA Retail Promo', 'Channel', 'Focused on North American retail placements.', ['NA', 'Retail']),
                            ('Perf. Marketing', 'Objective', 'High-conversion objective focus.', ['DR', 'Growth']),
                        ]
                        for name, cat, desc, tags in templates:
                            with ui.card().classes('h-full bg-[#1C1C21] border-[#212126] hover:border-[#e4002b] transition-all duration-300 p-6 rounded-xl shadow-card group flex flex-col'):
                                # Category Badge
                                ui.badge(cat, color='zinc-800').classes('text-[9px] font-black uppercase px-2 mb-4 w-fit')
                                
                                ui.label(name).classes('text-lg font-bold group-hover:text-[#e4002b] transition-colors leading-tight mb-2')
                                ui.label(desc).classes('text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-6')
                                
                                # Tags
                                with ui.row().classes('gap-1 mb-6'):
                                    for tag in tags:
                                        ui.badge(tag, color='zinc-900').classes('text-[8px] font-bold text-zinc-500 px-1.5')
                                
                                ui.button('Use Template', icon='arrow_forward').props('flat').classes('w-full mt-auto radius-btn font-bold text-xs h-9 bg-zinc-800 hover:bg-[#e4002b] hover:text-white transition-colors')
