from datetime import datetime
from nicegui import ui
from components.header import dashboard_header
from components.layout import layout_wrapper
from logic.briefing_manager import BriefingManager
from theme import THEME

@ui.page('/')
def dashboard_page():
    stats_data = BriefingManager.get_stats()
    recent_briefs = BriefingManager.list_briefs()[:3]

    with layout_wrapper():
        dashboard_header()
        
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-10'):
            # Stats Grid
            with ui.grid(columns=4).classes('w-full gap-4'):
                stats = [
                    ('Total Campaigns', str(stats_data['active']), None),
                    ('Total Assets', f"{stats_data['total_assets']:,}", None),
                    ('Avg. Markets', "12", None), # Placeholder for derived stat
                    ('Top Channel', "Social", None), # Placeholder for derived stat
                ]
                for label, value, trend in stats:
                    with ui.card().classes('bg-white border border-slate-200 p-5 gap-1 shadow-sm rounded-xl'):
                        ui.label(label).classes('text-xs text-slate-500 font-semibold tracking-wider uppercase')
                        ui.label(value).classes('text-3xl font-bold text-slate-900')
                        if trend:
                            ui.label(trend).classes('text-[10px] text-green-600 font-medium')

            # Recent Briefs Section
            with ui.column().classes('w-full gap-6'):
                with ui.row().classes('w-full justify-between items-center'):
                    ui.label('Recent Briefs').classes('text-xl font-bold tracking-tight')
                    ui.button('View All', on_click=lambda: ui.open('/briefings')).props('flat color=grey-6').classes('text-xs font-bold uppercase tracking-widest')
                
                if not recent_briefs:
                    with ui.card().classes('w-full bg-slate-50 border-dashed border-slate-200 p-12 items-center justify-center rounded-xl'):
                        ui.icon('assignment', size='32px').classes('text-slate-300')
                        ui.label('No campaigns found').classes('text-slate-400 mt-2 font-medium')
                        ui.button('Create First Campaign', on_click=lambda: ui.open('/briefing-new')).classes('mt-4 bg-slate-900 text-white font-bold')
                else:
                    with ui.grid(columns=3).classes('w-full gap-5'):
                         for brief in recent_briefs:
                             with ui.card().classes('bg-white border border-slate-200 p-6 hover:border-red-200 transition-all duration-300 cursor-pointer shadow-sm rounded-xl group'):
                                 with ui.row().classes('w-full justify-between items-start'):
                                     ui.badge(brief['status'].upper(), color='green-1' if brief['status'] != 'draft' else 'slate-100').classes('text-[9px] uppercase font-black px-2 py-0.5 text-green-700' if brief['status'] != 'draft' else 'text-[9px] uppercase font-black px-2 py-0.5 text-slate-500')
                                     ui.icon('more_horiz').classes('text-slate-400 group-hover:text-slate-900 transition-colors')
                                 
                                 ui.label(brief['name']).classes('text-lg font-bold text-slate-900 mt-4 leading-tight h-14 overflow-hidden line-clamp-2')
                                 ui.label(brief['brand']).classes('text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold text-[10px]')
                                 
                                 with ui.row().classes('w-full mt-6 justify-between items-center pt-4 border-t border-slate-100'):
                                     with ui.row().classes('gap-1'):
                                         ui.icon('layers', size='14px').classes('text-slate-400')
                                         ui.label(f"{brief['asset_count']} Assets").classes('text-[10px] text-slate-500 font-medium uppercase')
                                     ui.button('Open', on_click=lambda id=brief['id']: ui.open(f'/briefing/{id}')).classes('text-[10px] font-black uppercase text-slate-600 h-6 px-3 bg-slate-100 rounded-lg shadow-none')
