from nicegui import ui
from theme import THEME

def sidebar_link(icon: str, label: str, href: str, active: bool = False):
    bg_class = 'bg-[#e4002b]/10 text-[#e4002b] font-semibold' if active else 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    with ui.link(target=href).classes(f'flex items-center h-10 px-4 gap-3 radius-btn text-sm font-medium transition-all duration-200 no-underline {bg_class}'):
        ui.icon(icon).classes('text-lg')
        ui.label(label)

def layout_wrapper():
    """Context manager for the global layout"""
    with ui.row().classes('w-full h-screen gap-0 overflow-hidden'):
        # 1. Sidebar
        with ui.column().classes('w-[260px] h-full bg-[#09090b] border-r border-[#212126] flex-nowrap'):
            # Logo Section
            with ui.row().classes('h-20 items-center px-6 mb-4'):
                ui.button(icon='menu').props('flat round').classes('text-zinc-400 w-8 h-8')
                ui.label('briefing.').classes('ml-4 text-xl font-bold text-white tracking-tight')
            
            # Action Button
            with ui.column().classes('px-4 mb-8 w-full'):
                ui.button('Create Brief', icon='add', on_click=lambda: ui.open('/briefing-new')).classes(f'bg-[{THEME["primary"]}] text-white h-10 w-full radius-btn font-bold text-sm shadow-lg').props('no-caps')

            # Nav Links
            with ui.column().classes('flex-1 px-4 space-y-2 w-full'):
                sidebar_link('home', 'Overview', '/')
                sidebar_link('description', 'Briefings', '/briefings')
                sidebar_link('calendar_today', 'Calendar', '/calendar')
                sidebar_link('dashboard_customize', 'Templates', '/templates')
                sidebar_link('settings', 'Settings', '/settings')

            # User Profile
            with ui.column().classes('p-4 border-t border-[#212126] mt-auto w-full'):
                with ui.row().classes('items-center p-2 rounded-xl hover:bg-zinc-800 cursor-pointer gap-3'):
                    with ui.avatar().classes('bg-[#e4002b]/10 text-[#e4002b] font-bold text-xs ring-1 ring-[#e4002b]/20'):
                        ui.label('OA')
                    with ui.column().classes('gap-0'):
                        ui.label('Oscar Amengual').classes('text-sm font-bold text-white')
                        ui.label('Admin').classes('text-[10px] text-zinc-500 uppercase font-black')

        # 2. Main Content
        with ui.column().classes('flex-1 h-full overflow-y-auto bg-[#09090b]'):
            yield # Content injected here
