from nicegui import ui
from theme import THEME

def campaign_form():
    with ui.grid(columns='1fr 1fr').classes('w-full gap-6'):
        # Column 1: Core Info
        with ui.column().classes('gap-6'):
            # Card: General Info
            with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card'):
                ui.label('General Information').classes('text-lg font-bold mb-6')
                
                with ui.column().classes('w-full gap-4'):
                    with ui.column().classes('w-full gap-1'):
                        ui.label('Campaign Name *').classes('text-xs font-bold text-zinc-400')
                        ui.input(placeholder='e.g. Winter Sale 2025').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
                    
                    with ui.grid(columns=2).classes('w-full gap-4'):
                        with ui.column().classes('gap-1'):
                            ui.label('Brand').classes('text-xs font-bold text-zinc-400')
                            ui.input(placeholder='Brand Name').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
                        with ui.column().classes('gap-1'):
                            ui.label('Agency').classes('text-xs font-bold text-zinc-400')
                            ui.input(placeholder='Agency Name').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
                    
                    with ui.grid(columns=2).classes('w-full gap-4'):
                        with ui.column().classes('gap-1'):
                            ui.label('Start Date').classes('text-xs font-bold text-zinc-400')
                            ui.input().props('type=date').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
                        with ui.column().classes('gap-1'):
                            ui.label('End Date').classes('text-xs font-bold text-zinc-400')
                            ui.input().props('type=date').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')

                    # Regions
                    ui.label('Regions').classes('text-xs font-bold text-zinc-400 mt-2')
                    with ui.row().classes('w-full gap-2'):
                        for r in ['EMEA', 'AME', 'APAC']:
                            ui.button(r).classes('flex-1 bg-zinc-800 radius-btn text-[10px] font-black h-9')
                    ui.label('Select at least one region to populate market matrix.').classes('text-[10px] text-zinc-500 italic')

        # Column 2: Strategy & Digital
        with ui.column().classes('gap-6'):
            # Card: Strategy
            with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card'):
                ui.label('Strategy').classes('text-lg font-bold mb-6')
                
                with ui.column().classes('w-full gap-4'):
                    with ui.column().classes('w-full gap-1'):
                        ui.label('Marketing Objective').classes('text-xs font-bold text-zinc-400')
                        ui.select(['Awareness', 'Consideration', 'Conversion', 'Retention'], value='Awareness').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 text-sm')
                    
                    with ui.column().classes('w-full gap-1'):
                        ui.label('KPI').classes('text-xs font-bold text-zinc-400')
                        ui.input(placeholder='e.g. ROAS > 4.0').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
            
            # Card: Digital Assets
            with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card text-foreground'):
                ui.label('Digital Assets').classes('text-lg font-bold mb-6')
                with ui.column().classes('w-full gap-1'):
                    ui.label('Landing Page URL').classes('text-xs font-bold text-zinc-400')
                    ui.input(placeholder='https://...').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm font-mono text-[#e4002b]')
