from nicegui import ui
from theme import THEME
from logic.briefing_store import store

@ui.refreshable
def campaign_form():
    with ui.grid(columns='1fr 0.6fr').classes('w-full gap-8 items-start'):
        # Column 1: Core Info
        with ui.column().classes('gap-6 w-full'):
            # Card: General Info
            with ui.card().classes('w-full bg-white border border-base p-8 rounded-xl shadow-sm'):
                ui.label('General Information').classes('text-lg font-bold text-zinc-900 mb-6')
                
                with ui.column().classes('w-full gap-5'):
                    with ui.column().classes('w-full gap-1.5'):
                        ui.label('Campaign Name *').classes('text-[12px] font-bold text-zinc-500 ml-1')
                        ui.input(placeholder='e.g. Winter Sale 2025').bind_value(store.details, 'name') \
                            .classes('w-full').props('outlined dense bg-color=zinc-50 rounded-lg')
                    
                    with ui.row().classes('w-full gap-4'):
                        with ui.column().classes('flex-1 gap-1.5'):
                            ui.label('Brand').classes('text-[12px] font-bold text-zinc-500 ml-1')
                            ui.input(placeholder='Brand Name').bind_value(store.details, 'brand') \
                                .classes('w-full').props('outlined dense bg-color=zinc-50')
                        with ui.column().classes('flex-1 gap-1.5'):
                            ui.label('Agency').classes('text-[12px] font-bold text-zinc-500 ml-1')
                            ui.input(placeholder='Agency Name').bind_value(store.details, 'agency') \
                                .classes('w-full').props('outlined dense bg-color=zinc-50')
                    
                    with ui.row().classes('w-full gap-4'):
                        with ui.column().classes('flex-1 gap-1.5'):
                            ui.label('Start Date').classes('text-[12px] font-bold text-zinc-500 ml-1')
                            ui.input(placeholder='dd/mm/aaaa').bind_value(store.details, 'start_date') \
                                .classes('w-full').props('outlined dense bg-color=zinc-50 type=date')
                        with ui.column().classes('flex-1 gap-1.5'):
                            ui.label('End Date').classes('text-[12px] font-bold text-zinc-500 ml-1')
                            ui.input(placeholder='dd/mm/aaaa').bind_value(store.details, 'end_date') \
                                .classes('w-full').props('outlined dense bg-color=zinc-50 type=date')

                    # Regions
                    ui.label('Regions').classes('text-[12px] font-bold text-zinc-500 mt-2 ml-1')
                    
                    @ui.refreshable
                    def region_selector():
                        with ui.row().classes('w-full gap-2'):
                            for r in ['EMEA', 'AME', 'APAC']:
                                is_selected = r in store.regions
                                def toggle(region=r):
                                    store.toggle_region(region)
                                    region_selector.refresh()
                                    try:
                                        from components.market_matrix import market_list
                                        market_list.refresh()
                                    except: pass

                                btn_bg = f"bg-[#e60026] text-white shadow-md shadow-red-100" if is_selected else 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                                ui.button(r, on_click=toggle).classes(f'flex-1 {btn_bg} rounded-md text-[11px] font-black h-9 transition-all').props('no-caps')
                    
                    region_selector()
                    ui.label('Select regions to populate the market matrix.').classes('text-[10px] text-zinc-400 italic mt-1 ml-1')

        # Column 2: Strategy & Digital
        with ui.column().classes('gap-6 w-full'):
            # Card: Strategy
            with ui.card().classes('w-full bg-white border border-base p-8 rounded-xl shadow-sm'):
                ui.label('Strategy').classes('text-lg font-bold text-zinc-900 mb-6')
                
                with ui.column().classes('w-full gap-5'):
                    with ui.column().classes('w-full gap-1.5'):
                        ui.label('Marketing Objective').classes('text-[12px] font-bold text-zinc-500 ml-1')
                        ui.select(['Awareness', 'Consideration', 'Conversion', 'Retention'], value='Awareness') \
                            .bind_value(store.details, 'objective').classes('w-full').props('outlined dense bg-color=zinc-50')
                    
                    with ui.column().classes('w-full gap-1.5'):
                        ui.label('KPI').classes('text-[12px] font-bold text-zinc-500 ml-1')
                        ui.input(placeholder='e.g. ROAS > 4.0').bind_value(store.details, 'kpi') \
                            .classes('w-full').props('outlined dense bg-color=zinc-50')
            
            # Card: Digital Assets
            with ui.card().classes('w-full bg-white border border-base p-8 rounded-xl shadow-sm'):
                ui.label('Digital Assets').classes('text-lg font-bold text-zinc-900 mb-6')
                with ui.column().classes('w-full gap-1.5'):
                    ui.label('Landing Page URL').classes('text-[12px] font-bold text-zinc-500 ml-1')
                    ui.input(placeholder='https://...').bind_value(store.details, 'landing_page') \
                        .classes('w-full').props('outlined dense bg-color=zinc-50 font-mono')
