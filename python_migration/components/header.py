from nicegui import ui
from theme import THEME

def dashboard_header():
    with ui.row().classes('w-full justify-between items-center bg-[#09090b] p-6 border-b border-[#212126] sticky top-0 z-50'):
        with ui.column().classes('gap-0'):
            ui.label('Briefing Station').classes('text-2xl font-bold tracking-tight')
            ui.label('12 Active Campaigns').classes(f'text-sm text-[{THEME["muted"]}]')
        
        with ui.row().classes('items-center gap-4'):
            ui.button('New Campaign').classes(f'bg-[{THEME["primary"]}] rounded-full px-6 text-sm font-bold h-10 shadow-lg')
            with ui.avatar().classes('bg-zinc-800 text-xs w-8 h-8'):
                ui.label('OA')
