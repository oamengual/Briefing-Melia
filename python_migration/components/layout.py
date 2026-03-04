from contextlib import contextmanager
from nicegui import ui
from theme import THEME, apply_global_styles

def sidebar_link(icon: str, label: str, href: str, active: bool = False):
    if active:
        bg_class = f'bg-primary/10 text-primary font-bold'
        icon_class = 'text-primary'
    else:
        bg_class = 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200'
        icon_class = 'text-slate-400'
        
    with ui.link(target=href).classes(f'flex items-center h-11 px-4 gap-3 rounded-lg text-[13px] font-medium no-underline {bg_class}'):
        ui.icon(icon).classes(f'text-lg {icon_class}')
        ui.label(label)

@contextmanager
def layout_wrapper():
    """Context manager for the global layout (Light Mode)"""
    apply_global_styles()
    
    with ui.row().classes('w-full h-screen gap-0 overflow-hidden'):
        # 1. Sidebar (Fixed 260px)
        with ui.column().classes('w-[260px] h-full bg-white border-r border-slate-200 flex-nowrap z-30 shadow-sm'):
            # Logo Section
            with ui.row().classes('h-20 items-center px-8 mb-4'):
                ui.icon('radio_button_checked').classes(f'text-[24px] text-[{THEME["primary"]}]')
                ui.label('briefing.').classes('ml-3 text-[22px] font-black text-slate-900 tracking-tighter')
            
            # Nav Links
            with ui.column().classes('flex-1 px-4 space-y-1 w-full'):
                # 1. Dashboard Link (Overview)
                sidebar_link('home', 'Overview', '/', active=False)
                
                # 2. Prominent Action Button
                with ui.link(target='/briefing-new').classes('w-full no-underline mt-4 mb-8'):
                    with ui.row().classes(f'bg-primary hover:bg-primary/90 text-white h-10 px-4 items-center justify-center gap-2 rounded-lg shadow-sm transition-all'):
                        ui.icon('add', size='20px').classes('font-bold')
                        ui.label('Create Brief').classes('text-sm font-bold')

                # 3. Main Navigation
                sidebar_link('description', 'Briefings', '/briefings')
                sidebar_link('calendar_today', 'Calendar', '/calendar')
                sidebar_link('dashboard_customize', 'Templates', '/templates')
                sidebar_link('settings', 'Settings', '/settings')

            # User Profile Section
            with ui.column().classes('p-6 bg-slate-50 border-t border-slate-200 mt-auto w-full'):
                with ui.row().classes('items-center gap-3 w-full'):
                    with ui.avatar().classes(f'bg-primary/10 text-primary font-bold text-xs border border-primary/20'):
                        ui.label('OA')
                    with ui.column().classes('gap-0 flex-1'):
                        ui.label('Oscar Amengual').classes('text-[13px] font-bold text-slate-900 leading-tight')
                        ui.label('Admin').classes('text-[10px] text-slate-500 uppercase font-bold tracking-widest')
                    ui.icon('more_vert').classes('text-slate-400 cursor-pointer hover:text-slate-600')

        # 2. Main Content
        with ui.column().classes(f'flex-1 h-full overflow-y-auto bg-[{THEME["background"]}] relative'):
            # Header Row for Breadcrumbs/Actions
            with ui.row().classes('w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-0 h-16 flex-nowrap items-center justify-between text-slate-900 sticky top-0 z-20 shadow-none'):
                with ui.row().classes('items-center gap-2'):
                    ui.icon('home', size='18px').classes('text-slate-400')
                    ui.label('/').classes('text-slate-300')
                    ui.label('Briefing Builder').classes('text-sm font-semibold text-slate-900')
                
                with ui.row().classes('items-center gap-4'):
                    ui.icon('notifications', size='22px').classes('text-slate-400 cursor-pointer hover:text-slate-900')
                    ui.icon('search', size='22px').classes('text-slate-400 cursor-pointer hover:text-slate-900')
                    ui.button(icon='help_outline').props('flat round size=sm').classes('text-slate-400')
            
            with ui.column().classes('w-full flex-1 max-w-[1400px] mx-auto overflow-visible'):
                yield # Content injected here
