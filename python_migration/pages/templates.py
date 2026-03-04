from nicegui import ui
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/templates')
def templates_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-slate-200 bg-white'):
            with ui.column().classes('gap-1'):
                ui.label('Campaign Templates').classes('text-3xl font-bold tracking-tight text-slate-900')
                ui.label('Accelerate your workflow with pre-configured placement mixes and strategies.').classes('text-base text-slate-500')

        # Content Area
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-10'):
            # Categories / Tabs
            with ui.tabs().classes('w-full bg-transparent border-b border-slate-200 text-slate-500') as tabs:
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
                            with ui.card().classes('h-full bg-white border border-slate-200 hover:border-red-200 transition-all duration-300 p-6 rounded-xl shadow-sm group flex flex-col'):
                                # Category Badge
                                ui.badge(cat, color='slate-50').classes('text-[9px] font-black uppercase px-2 mb-4 w-fit text-slate-500')
                                
                                ui.label(name).classes('text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-2')
                                ui.label(desc).classes('text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6')
                                
                                # Tags
                                with ui.row().classes('gap-1 mb-6'):
                                    for tag in tags:
                                        ui.badge(tag, color='slate-50').classes('text-[8px] font-bold text-slate-400 px-1.5')
                                
                                ui.button('Use Template', icon='arrow_forward').props('flat').classes('w-full mt-auto radius-btn font-bold text-xs h-9 bg-slate-50 text-slate-600 hover:bg-red-500 hover:text-white transition-colors')
