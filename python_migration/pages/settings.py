from nicegui import ui
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/settings')
def settings_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-zinc-800 bg-[#09090b]'):
            with ui.column().classes('gap-1'):
                ui.label('Workspace Settings').classes('text-3xl font-bold tracking-tight')
                ui.label('Manage your workspace preferences, team members, and branding configuration.').classes('text-base text-zinc-500')
            
            with ui.row().classes('gap-3'):
                ui.button('Cancel').props('flat').classes('text-zinc-400 font-bold')
                ui.button('Save Changes', icon='save').classes(f'bg-[{THEME["primary"]}] rounded-lg px-6 font-bold shadow-lg h-11')

        # Tabs & Content Area
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-8'):
            with ui.tabs().classes('w-full bg-transparent border-b border-zinc-800') as tabs:
                ui.tab('General').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('Brands & Clients').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('Team Members').classes('text-sm font-bold uppercase tracking-widest')
                ui.tab('System').classes('text-sm font-bold uppercase tracking-widest')

            with ui.tab_panels(tabs, value='General').classes('w-full bg-transparent p-0 mt-8'):
                # GENERAL TAB
                with ui.tab_panel('General'):
                    with ui.grid(columns=2).classes('w-full gap-6'):
                        # Card: Workspace Identity
                        with ui.card().classes('bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card'):
                            with ui.row().classes('gap-4 items-start'):
                                with ui.box().classes('w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center'):
                                    ui.icon('business', size='20px').classes('text-white')
                                with ui.column().classes('gap-0'):
                                    ui.label('Workspace Identity').classes('text-lg font-bold')
                                    ui.label('Visual branding for teams').classes('text-xs text-zinc-500')
                            
                            ui.label('Workspace Name').classes('text-xs font-bold mt-6 mb-1 text-zinc-400')
                            ui.input(value='Acme Creative Studio').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-11 px-4 text-sm')

                        # Card: Appearance
                        with ui.card().classes('bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card'):
                            with ui.row().classes('gap-4 items-start'):
                                with ui.box().classes('w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center'):
                                    ui.icon('palette', size='20px').classes('text-white')
                                with ui.column().classes('gap-0'):
                                    ui.label('Appearance').classes('text-lg font-bold')
                                    ui.label('Interface customization').classes('text-xs text-zinc-500')
                            
                            with ui.row().classes('w-full gap-3 mt-6'):
                                for mode, icon in [('Light', 'wb_sunny'), ('Dark', 'brightness_3'), ('System', 'settings_brightness')]:
                                    with ui.column().classes(f'flex-1 p-3 items-center gap-2 border rounded-xl {"border-[#e4002b] bg-[#e4002b]/5" if mode == "Dark" else "border-zinc-800 bg-transparent"}'):
                                        ui.icon(icon, size='20px').classes('text-[#e4002b]' if mode == 'Dark' else 'text-zinc-500')
                                        ui.label(mode).classes('text-[10px] font-black uppercase tracking-wider')

                # BRANDS TAB
                with ui.tab_panel('Brands & Clients'):
                    ui.label('Brand Manager coming soon...').classes('text-zinc-500 text-sm italic p-12 text-center w-full')

                # TEAM MEMBERS TAB
                with ui.tab_panel('Team Members'):
                    with ui.row().classes('w-full justify-between items-center mb-6'):
                        ui.label('Active Members').classes('text-xl font-bold')
                        ui.button('Add Member', icon='person_add').classes('bg-zinc-800 radius-btn text-sm font-bold')
                    
                    with ui.grid(columns=3).classes('w-full gap-4'):
                        users = [
                            ('Oscar Amengual', 'oscar@example.com', 'Admin'),
                            ('Jane Design', 'jane@example.com', 'Editor'),
                            ('Marcus Content', 'marcus@example.com', 'Viewer'),
                        ]
                        for name, email, role in users:
                            with ui.card().classes('bg-[#1C1C21] border-[#212126] p-5 rounded-xl shadow-card group relative'):
                                with ui.row().classes('w-full justify-between'):
                                    with ui.avatar().classes('bg-zinc-800 font-bold'):
                                        ui.label(name[0])
                                    ui.button(icon='more_vert').props('flat round size=sm').classes('text-zinc-500')
                                
                                ui.label(name).classes('text-base font-bold mt-4')
                                ui.label(email).classes('text-xs text-zinc-500')
                                ui.badge(role, color='primary' if role == 'Admin' else 'zinc-700').classes('mt-4 text-[9px] font-black px-2')

                # SYSTEM TAB
                with ui.tab_panel('System'):
                    with ui.column().classes('max-w-xl mx-auto gap-6 mt-12'):
                        with ui.card().classes('bg-red-950/20 border-red-900/50 p-8 rounded-2xl text-center gap-4'):
                            ui.icon('warning', size='40px').classes('text-red-500 mx-auto')
                            ui.label('Factory Reset').classes('text-xl font-bold text-red-100')
                            ui.label('Delete all briefings, users, templates, and settings. This cannot be undone.').classes('text-red-100/60 text-xs px-8')
                            
                            ui.label('Type DELETE to confirm').classes('text-[10px] uppercase font-black text-red-500 mt-4')
                            ui.input(placeholder='DELETE').classes('bg-black/50 border-red-900 rounded-lg text-center font-bold tracking-widest text-red-500')
                            ui.button('Reset Workspace Data', color='red').classes('w-full h-12 font-black uppercase text-xs rounded-xl shadow-xl mt-4')
