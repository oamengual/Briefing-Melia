from nicegui import ui
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/calendar')
def calendar_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-zinc-800 bg-[#09090b]'):
            with ui.column().classes('gap-1'):
                ui.label('Campaign Calendar').classes('text-3xl font-bold tracking-tight')
                ui.label('Timeline view of all scheduled campaigns.').classes('text-base text-zinc-500')
            
            with ui.row().classes('gap-4'):
                ui.button('Today', icon='calendar_today').props('flat').classes('text-zinc-400 font-bold h-11 px-6')
                with ui.row().classes('bg-zinc-900 rounded-lg p-1 border border-zinc-800'):
                    ui.button(icon='chevron_left').props('flat size=sm').classes('text-zinc-500')
                    ui.button('February 2024').props('flat size=sm').classes('text-white font-bold px-4')
                    ui.button(icon='chevron_right').props('flat size=sm').classes('text-zinc-500')

        # Calendar View (Timeline Style)
        with ui.column().classes('w-full h-full p-8 gap-8 overflow-hidden'):
            with ui.card().classes('w-full grow bg-[#1C1C21] border-[#212126] p-0 rounded-2xl shadow-card overflow-hidden flex flex-col'):
                # Days Header
                with ui.row().classes('w-full h-12 border-b border-zinc-800 bg-zinc-900/50 items-center px-4 gap-0'):
                    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    for day in days:
                        ui.label(day).classes('flex-1 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500')
                
                # Grid Placeholder (Calendar content is complex, mirroring high-fidelity look)
                with ui.grid(columns=7).classes('w-full grow gap-0'):
                    for i in range(35):
                        is_current = (i >= 3 and i <= 31)
                        day_num = i - 2 if is_current else (i + 28 if i < 3 else i - 31)
                        with ui.column().classes(f'h-24 border-b border-r border-zinc-800 p-3 hover:bg-zinc-800/20 transition-colors {"opacity-20" if not is_current else ""}'):
                            ui.label(str(day_num)).classes('text-xs font-bold' if is_current else 'text-xs text-zinc-600')
                            
                            # Mock Event
                            if i == 12:
                                with ui.box().classes('w-full bg-[#e4002b] p-1.5 rounded-md mt-2 shadow-lg'):
                                    ui.label('Summer-24').classes('text-[9px] font-black uppercase text-white truncate')
                            if i == 20:
                                with ui.box().classes('w-full bg-blue-600 p-1.5 rounded-md mt-2 shadow-lg'):
                                    ui.label('Social Push').classes('text-[9px] font-black uppercase text-white truncate')

            # Upcoming List Section
            ui.label('Upcoming Deadlines').classes('text-xl font-bold tracking-tight')
            with ui.row().classes('w-full gap-4'):
                for title, date, color in [
                    ('Black Friday Launch', 'Nov 24', 'red'),
                    ('Q1 Planning', 'Dec 05', 'blue'),
                    ('Market Review', 'Dec 12', 'teal'),
                ]:
                    with ui.card().classes('flex-1 bg-[#1C1C21] border-[#212126] p-4 rounded-xl shadow-card'):
                        with ui.row().classes('items-center gap-4'):
                            with ui.box().classes(f'w-2 h-10 bg-{color}-500 rounded-full'): pass
                            with ui.column().classes('gap-0'):
                                ui.label(title).classes('text-sm font-bold')
                                ui.label(date).classes('text-[10px] text-zinc-500 font-bold uppercase')
