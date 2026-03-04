from nicegui import ui
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/calendar')
def calendar_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-slate-200 bg-white'):
            with ui.column().classes('gap-1'):
                ui.label('Campaign Calendar').classes('text-3xl font-bold tracking-tight text-slate-900')
                ui.label('Timeline view of all scheduled campaigns.').classes('text-base text-slate-500')
            
            with ui.row().classes('gap-4'):
                ui.button('Today', icon='calendar_today').props('flat').classes('text-slate-500 font-bold h-11 px-6')
                with ui.row().classes('bg-slate-100 rounded-lg p-1 border border-slate-200'):
                    ui.button(icon='chevron_left').props('flat size=sm').classes('text-slate-500')
                    ui.button('February 2024').props('flat size=sm').classes('text-slate-900 font-bold px-4')
                    ui.button(icon='chevron_right').props('flat size=sm').classes('text-slate-500')

        # Calendar View (Timeline Style)
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-8 overflow-hidden'):
            with ui.card().classes('w-full h-[600px] bg-white border border-slate-200 p-0 rounded-2xl shadow-sm overflow-hidden flex flex-col'):
                # Days Header
                with ui.row().classes('w-full h-12 border-b border-slate-200 bg-slate-50 items-center px-4 gap-0'):
                    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    for day in days:
                        ui.label(day).classes('flex-1 text-center text-[10px] font-black uppercase tracking-widest text-slate-500')
                
                # Grid Placeholder
                with ui.grid(columns=7).classes('w-full grow gap-0'):
                    for i in range(35):
                        is_current = (i >= 3 and i <= 31)
                        day_num = i - 2 if is_current else (i + 28 if i < 3 else i - 31)
                        with ui.column().classes(f'h-24 border-b border-r border-slate-100 p-3 hover:bg-slate-50 transition-colors {"opacity-20" if not is_current else ""}'):
                            ui.label(str(day_num)).classes('text-xs font-bold text-slate-900' if is_current else 'text-xs text-slate-400')
                            
                            # Mock Event
                            if i == 12:
                                with ui.element('div').classes('w-full bg-red-500 p-1.5 rounded-md mt-2 shadow-lg'):
                                    ui.label('Summer-24').classes('text-[9px] font-black uppercase text-white truncate')
                            if i == 20:
                                with ui.element('div').classes('w-full bg-blue-500 p-1.5 rounded-md mt-2 shadow-lg'):
                                    ui.label('Social Push').classes('text-[9px] font-black uppercase text-white truncate')

            # Upcoming List Section
            ui.label('Upcoming Deadlines').classes('text-xl font-bold tracking-tight text-slate-900')
            with ui.row().classes('w-full gap-4'):
                for title, date, color in [
                    ('Black Friday Launch', 'Nov 24', 'red'),
                    ('Q1 Planning', 'Dec 05', 'blue'),
                    ('Market Review', 'Dec 12', 'teal'),
                ]:
                    with ui.card().classes('flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm'):
                        with ui.row().classes('items-center gap-4'):
                            with ui.element('div').classes(f'w-2 h-10 bg-{color}-500 rounded-full'): pass
                            with ui.column().classes('gap-0'):
                                ui.label(title).classes('text-sm font-bold text-slate-900')
                                ui.label(date).classes('text-xs text-slate-500')
