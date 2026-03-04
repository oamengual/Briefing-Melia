from nicegui import ui
from theme import THEME
from logic.briefing_store import store

@ui.refreshable
def campaign_details():
    def toggle_region(region: str):
        store.toggle_region(region)
        campaign_details.refresh()

    with ui.column().classes('w-full gap-8 animate-fade-in'):
        with ui.grid(columns='1fr 1fr').classes('w-full gap-8'):
            
            # --- COLUMN 1: General Info ---
            with ui.card().classes('w-full bg-white border border-slate-200 p-0 rounded-3xl shadow-sm overflow-hidden auto-height'):
                with ui.row().classes('px-8 pt-8 pb-4 items-center gap-3'):
                    ui.icon('info').classes(f'text-[{THEME["primary"]}] text-xl')
                    ui.label('General Campaign Information').classes('text-lg font-bold text-slate-900')
                
                with ui.column().classes('px-8 pb-8 w-full gap-6'):
                    # Campaign Name
                    with ui.column().classes('w-full gap-2'):
                        ui.label('Campaign Name *').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                        ui.input(placeholder='e.g. Winter Sale 2025', value=store.details.campaignName) \
                            .props('outlined bg-color=white') \
                            .classes('w-full font-bold text-lg rounded-2xl') \
                            .on('change', lambda e: store.set_details_field('campaignName', e.value))

                    # Brand & Agency Grid
                    with ui.grid(columns=2).classes('w-full gap-6'):
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Brand').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            ui.input(placeholder='Brand Name', value=store.details.brand) \
                                .props('outlined dense bg-color=white') \
                                .classes('w-full font-bold rounded-xl') \
                                .on('change', lambda e: store.set_details_field('brand', e.value))
                        
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Agency').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            ui.input(placeholder='Agency Name', value=store.details.agency) \
                                .props('outlined dense bg-color=white') \
                                .classes('w-full font-bold rounded-xl') \
                                .on('change', lambda e: store.set_details_field('agency', e.value))

                    # Dates Grid
                    with ui.grid(columns=2).classes('w-full gap-6'):
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Start Date').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            with ui.input(placeholder='YYYY-MM-DD').props('outlined dense bg-color=white readonly').classes('w-full font-bold rounded-xl pointer-events-none').bind_value(store.details, 'startDate') as start_input:
                                with start_input.add_slot('prepend'):
                                    ui.icon('event').classes('cursor-pointer').on('click', lambda: start_menu.open())
                                with ui.menu() as start_menu:
                                    ui.date(value=store.details.startDate).on('change', lambda e: [store.set_details_field('startDate', e.value), start_menu.close()])
                                    
                        with ui.column().classes('w-full gap-2'):
                            ui.label('End Date').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            with ui.input(placeholder='YYYY-MM-DD').props('outlined dense bg-color=white readonly').classes('w-full font-bold rounded-xl pointer-events-none').bind_value(store.details, 'endDate') as end_input:
                                with end_input.add_slot('prepend'):
                                    ui.icon('event').classes('cursor-pointer').on('click', lambda: end_menu.open())
                                with ui.menu() as end_menu:
                                    ui.date(value=store.details.endDate).on('change', lambda e: [store.set_details_field('endDate', e.value), end_menu.close()])

                    # Regions (THE USER REQUESTED THIS)
                    with ui.column().classes('w-full gap-3 mt-2'):
                        ui.label('Active Regions').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                        with ui.row().classes('w-full gap-3 shrink-0'):
                            for r in ['AME', 'EMEA', 'APAC']:
                                is_selected = r in store.details.regions
                                bg = f'bg-[{THEME["primary"]}] text-white shadow-md' if is_selected else 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                ui.button(r, on_click=lambda r=r: toggle_region(r)) \
                                    .props('unelevated rounded size=md') \
                                    .classes(f'flex-1 font-black text-[11px] transition-all {bg}')
                        ui.label('Select at least one region to populate market matrix.').classes('text-[10px] text-slate-400 font-medium ml-1')

            # --- COLUMN 2: Strategy & Digital ---
            with ui.column().classes('w-full gap-8'):
                with ui.card().classes('w-full bg-white border border-slate-200 p-0 rounded-3xl shadow-sm overflow-hidden auto-height'):
                    with ui.row().classes('px-8 pt-8 pb-4 items-center gap-3'):
                        ui.icon('psychology').classes(f'text-[{THEME["primary"]}] text-xl')
                        ui.label('Strategy').classes('text-lg font-bold text-slate-900')
                    
                    with ui.column().classes('px-8 pb-8 w-full gap-6'):
                        # Marketing Objective
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Marketing Objective').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            ui.select(options={
                                'awareness': 'Brand Awareness',
                                'consideration': 'Consideration / Traffic',
                                'conversion': 'Conversion / Sales',
                                'retention': 'Retention'
                            }, value=store.details.marketingObjective).props('outlined bg-color=white') \
                              .classes('w-full font-bold rounded-xl') \
                              .on('change', lambda e: store.set_details_field('marketingObjective', e.value))

                        # KPI & Strategy
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Key Performance Indicator (KPI)').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            ui.input(placeholder='e.g. ROAS > 4.0, CPR < $2', value=store.details.kpi) \
                                .props('outlined dense bg-color=white') \
                                .classes('w-full font-medium rounded-xl') \
                                .on('change', lambda e: store.set_details_field('kpi', e.value))
                        
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Project Strategy').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            ui.input(placeholder='Global Strategy Name', value=store.details.strategy) \
                                .props('outlined dense bg-color=white') \
                                .classes('w-full font-medium rounded-xl text-primary font-mono') \
                                .on('change', lambda e: store.set_details_field('strategy', e.value))

                with ui.card().classes('w-full bg-white border border-slate-200 p-0 rounded-3xl shadow-sm overflow-hidden auto-height'):
                    with ui.row().classes('px-8 pt-8 pb-4 items-center gap-3'):
                        ui.icon('stream').classes(f'text-[{THEME["primary"]}] text-xl')
                        ui.label('Digital Assets').classes('text-lg font-bold text-slate-900')
                    
                    with ui.column().classes('px-8 pb-8 w-full gap-6'):
                        # Landing Page URL
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Landing Page URL').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                            ui.input(placeholder='https://...') \
                                .props('outlined dense bg-color=slate-50') \
                                .classes('w-full font-medium rounded-xl text-primary font-mono text-sm') \
                                .bind_value(store.details, 'landingPageUrl')
