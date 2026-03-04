from nicegui import ui
from theme import THEME
from logic.briefing_store import store
from datetime import datetime

def history_view():
    with ui.column().classes('w-full max-w-4xl mx-auto py-8 pl-8 pr-4'):
        # Header
        with ui.column().classes('gap-1 mb-8'):
            ui.label('Campaign History').classes('text-2xl font-bold text-slate-900')
            ui.label('Track all modifications and events for this campaign.').classes('text-sm text-slate-500 font-medium')

        @ui.refreshable
        def history_list():
            if not store.history:
                with ui.column().classes('w-full items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center gap-4'):
                    ui.icon('history', size='lg').classes('text-slate-300')
                    ui.label('No history recorded yet.').classes('text-sm text-slate-500 font-medium')
                    return

            # Timeline Container
            with ui.column().classes('relative border-l-2 border-slate-100 gap-10 w-full'):
                for entry in store.history:
                    dt = datetime.fromtimestamp(entry['timestamp'])
                    time_str = dt.strftime('%H:%M:%S')
                    date_str = dt.strftime('%Y-%m-%d')
                    
                    action_color = {
                        'DETAILS_UPDATED': 'blue',
                        'CREATIVE_UPDATED': 'emerald',
                        'PLACEMENT_ADDED': 'orange',
                        'PLACEMENT_REMOVED': 'red',
                        'PSD_UPLOADED': 'indigo',
                        'PSD_REMOVED': 'slate'
                    }.get(entry['action'], 'slate')

                    with ui.column().classes('relative pl-10 w-full'):
                        # Dot
                        ui.row().classes(f'absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-{action_color}-500 shadow-sm shadow-{action_color}-200')
                        
                        with ui.column().classes('gap-3 w-full'):
                            with ui.row().classes('items-center gap-3'):
                                ui.label('Editor').classes('text-xs font-black text-slate-900 uppercase tracking-wider')
                                ui.badge(entry['action'].replace('_', ' '), color=f'{action_color}-100').classes(f'text-[9px] font-black px-2.5 py-1 text-{action_color}-700 rounded-lg border border-{action_color}-200')
                                ui.label(f'{date_str} {time_str}').classes('text-[10px] text-slate-400 font-mono font-bold')
                            
                            ui.label(entry['description']).classes('text-sm text-slate-600 font-medium leading-relaxed')
                            
                            # Fields Detail (Accordion-like)
                            if entry.get('fields'):
                                with ui.card().classes('w-full bg-slate-50/50 border-slate-100 p-4 rounded-2xl shadow-none mt-1'):
                                    with ui.column().classes('gap-2'):
                                        for k, v in entry['fields'].items():
                                            with ui.row().classes('items-center gap-2 text-[10px]'):
                                                ui.label(k.upper()).classes('font-black text-slate-400 w-16')
                                                if isinstance(v, dict):
                                                    ui.label(str(v.get('from', 'None'))).classes('text-slate-400 line-through truncate max-w-[150px]')
                                                    ui.icon('arrow_forward', size='10px').classes('text-slate-300')
                                                    ui.label(str(v.get('to', 'None'))).classes('text-slate-900 font-bold truncate max-w-[200px]')
                                                else:
                                                    ui.label(str(v)).classes('text-slate-900 font-bold')

        history_list()
        
        # Periodic refresh if needed, or just manual
        ui.button('Refresh Timeline', icon='refresh', on_click=history_list.refresh).props('flat color=slate-400').classes('mt-8 text-[10px] font-black uppercase tracking-widest')

