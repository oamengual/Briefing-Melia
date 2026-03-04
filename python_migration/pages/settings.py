from nicegui import ui
from components.layout import layout_wrapper
from components.placement_manager import placement_manager
from components.spec_manager import spec_manager
from components.naming_editor import naming_editor
from theme import THEME

def general_settings():
    with ui.grid(columns=2).classes('w-full gap-6'):
        # Card: Workspace Identity
        with ui.card().classes('bg-white border border-slate-200 p-6 rounded-xl shadow-sm'):
            with ui.row().classes('gap-4 items-start'):
                with ui.element('div').classes('w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center'):
                    ui.icon('business', size='20px').classes('text-slate-600')
                with ui.column().classes('gap-0'):
                    ui.label('Workspace Identity').classes('text-lg font-bold text-slate-900')
                    ui.label('Visual branding for teams').classes('text-xs text-slate-500')
            
            ui.label('Workspace Name').classes('text-xs font-bold mt-6 mb-1 text-slate-400')
            ui.input(value='Acme Creative Studio').classes('w-full bg-white border-slate-200 rounded-lg h-11 px-4 text-sm')

        # Card: Appearance
        with ui.card().classes('bg-white border border-slate-200 p-6 rounded-xl shadow-sm'):
            with ui.row().classes('gap-4 items-start'):
                with ui.element('div').classes('w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center'):
                    ui.icon('palette', size='20px').classes('text-slate-600')
                with ui.column().classes('gap-0'):
                    ui.label('Appearance').classes('text-lg font-bold text-slate-900')
                    ui.label('Interface customization').classes('text-xs text-slate-500')
            
            with ui.row().classes('w-full gap-3 mt-6'):
                for mode, icon in [('Light', 'wb_sunny'), ('Dark', 'brightness_3'), ('System', 'settings_brightness')]:
                    is_active = (mode == "Light")
                    with ui.column().classes(f'flex-1 p-3 items-center gap-2 border rounded-xl {"border-red-200 bg-red-50/50" if is_active else "border-slate-100 bg-transparent"}'):
                        ui.icon(icon, size='20px').classes('text-primary' if is_active else 'text-slate-300')
                        ui.label(mode).classes(f'text-[10px] font-black uppercase tracking-wider {"text-red-700" if is_active else "text-slate-400"}')

def brand_manager():
    with ui.column().classes('w-full gap-6'):
        with ui.row().classes('w-full justify-between items-center'):
            ui.label('Brands & Clients').classes('text-xl font-bold')
            ui.button('Add Brand', icon='add').classes('bg-primary radius-btn text-sm font-bold shadow-lg shadow-primary/20')
        
        with ui.grid(columns=3).classes('w-full gap-4'):
            for brand, logo in [('Acme Corp', 'corporate_fare'), ('Blue Digital', 'biotech'), ('Green Field', 'eco')]:
                with ui.card().classes('bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-red-200 transition-all cursor-pointer group'):
                    with ui.row().classes('gap-4 items-center'):
                        with ui.element('div').classes('w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors'):
                            ui.icon(logo, size='24px')
                        with ui.column().classes('gap-0'):
                            ui.label(brand).classes('text-base font-bold text-slate-900')
                            ui.label('Main account').classes('text-[10px] text-slate-400 uppercase tracking-widest font-black')
                    
                    with ui.row().classes('w-full justify-between mt-6 pt-4 border-t border-slate-100'):
                        ui.label('12 Briefings').classes('text-[10px] font-bold text-slate-500')
                        ui.icon('more_horiz').classes('text-slate-300')

def team_manager():
    with ui.column().classes('w-full gap-6'):
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
                with ui.card().classes('bg-white border border-slate-200 p-5 rounded-xl shadow-sm group relative'):
                    with ui.row().classes('w-full justify-between'):
                        with ui.avatar().classes('bg-slate-100 text-slate-600 font-bold'):
                            ui.label(name[0])
                        ui.button(icon='more_vert').props('flat round size=sm').classes('text-slate-300')
                    
                    ui.label(name).classes('text-base font-bold text-slate-900 mt-4')
                    ui.label(email).classes('text-xs text-slate-500')
                    ui.badge(role, color='primary' if role == 'Admin' else 'slate-100').classes('mt-4 text-[9px] font-black px-2' + (' text-white' if role == 'Admin' else ' text-slate-500'))

def system_settings():
    with ui.column().classes('max-w-xl mx-auto gap-6 mt-12'):
        with ui.card().classes('bg-red-950/20 border-red-900/50 p-8 rounded-2xl text-center gap-4'):
            ui.icon('warning', size='40px').classes('text-red-500 mx-auto')
            ui.label('Factory Reset').classes('text-xl font-bold text-red-100')
            ui.label('Delete all briefings, users, templates, and settings. This cannot be undone.').classes('text-red-100/60 text-xs px-8')
            
            ui.label('Type DELETE to confirm').classes('text-[10px] uppercase font-black text-red-500 mt-4')
            ui.input(placeholder='DELETE').classes('w-full bg-black/50 border-red-900 rounded-lg text-center font-bold tracking-widest text-red-500')
            ui.button('Reset Workspace Data', color='red').classes('w-full h-12 font-black uppercase text-xs rounded-xl shadow-xl mt-4')

@ui.page('/settings')
def settings_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-slate-200 bg-white'):
            with ui.column().classes('gap-1'):
                ui.label('Workspace Settings').classes('text-3xl font-bold tracking-tight text-slate-900')
                ui.label('Manage your workspace preferences, team members, and branding configuration.').classes('text-base text-slate-500')
            
            with ui.row().classes('gap-3'):
                ui.button('Cancel').props('flat').classes('text-zinc-400 font-bold')
                ui.button('Save Changes', icon='save').classes(f'bg-[{THEME["primary"]}] rounded-lg px-6 font-bold shadow-lg h-11')

        # Tabs & Content Area
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-8 shadow-2xl'):
            with ui.tabs().classes('w-full border-b border-slate-200 mb-8') as tabs:
                ui.tab('General').classes('text-xs font-bold uppercase tracking-widest')
                ui.tab('Brands & Clients').classes('text-xs font-bold uppercase tracking-widest')
                ui.tab('Placements').classes('text-xs font-bold uppercase tracking-widest')
                ui.tab('Design Specs').classes('text-xs font-bold uppercase tracking-widest')
                ui.tab('Naming Convention').classes('text-xs font-bold uppercase tracking-widest')
                ui.tab('Team Members').classes('text-xs font-bold uppercase tracking-widest')
                ui.tab('System').classes('text-xs font-bold uppercase tracking-widest')

            with ui.tab_panels(tabs, value='General').classes('w-full bg-transparent p-0'):
                with ui.tab_panel('General'):
                    general_settings()
                
                with ui.tab_panel('Brands & Clients'):
                    brand_manager()
                
                with ui.tab_panel('Placements'):
                    placement_manager()
                
                with ui.tab_panel('Design Specs'):
                    spec_manager()
                
                with ui.tab_panel('Naming Convention'):
                    naming_editor()
                
                with ui.tab_panel('Team Members'):
                    team_manager()
                
                with ui.tab_panel('System'):
                    system_settings()
