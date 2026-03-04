from nicegui import ui
from theme import THEME
from logic.briefing_store import store, MARKETS, PLACEMENTS

# State for market matrix (persists across refreshes)
market_matrix_state = {'search': '', 'region': 'AME'}

@ui.refreshable
def market_matrix():
    def set_region(r):
        market_matrix_state['region'] = r
        market_list.refresh() # Only need to refresh the list usually, but matrix header uses region too
        market_matrix.refresh()
        
    def set_search(v):
        market_matrix_state['search'] = v
        market_list.refresh()

    state = market_matrix_state

    with ui.column().classes('w-full gap-10 animate-fade-in'):
        # 1. Header & Search
        with ui.row().classes('w-full justify-between items-center'):
            with ui.column().classes('gap-1'):
                ui.label('Market Mix').classes('text-3xl font-bold text-slate-900 tracking-tight')
                ui.label('Define market-specific placements and regional configurations.').classes('text-base text-slate-500 font-normal')
            
            with ui.row().classes('relative w-96'):
                with ui.input(placeholder='Search markets...', on_change=lambda e: set_search(e.value)) \
                    .props('outlined dense bg-color=white rounded-lg px-4 h-10') \
                    .classes('w-full shadow-sm border-slate-200') as search_input:
                    with search_input.add_slot('prepend'):
                        ui.icon('search').classes('text-slate-400 text-sm')

        # 2. Global Controls Bar
        with ui.column().classes('w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm transition-all hover:shadow-md'):
            with ui.row().classes('w-full justify-between items-center mb-6'):
                with ui.row().classes('items-center gap-4'):
                    with ui.column().classes('p-2 bg-red-100 rounded-full'):
                        ui.icon('bolt').classes(f'text-[{THEME["primary"]}] text-xl')
                    with ui.column().classes('gap-0'):
                        ui.label('Global Controls').classes('text-sm font-bold text-slate-900')
                        ui.label(f'Apply across {state["region"]} markets').classes('text-[10px] text-slate-500 font-black uppercase tracking-wider')
                
                with ui.row().classes('gap-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm'):
                    ui.button('BULK ACTIONS', icon='bolt').props('flat size=sm').classes('text-[10px] font-black text-slate-400 hover:text-primary')
                    ui.button('CLEAR ALL', icon='delete_sweep').props('flat size=sm').classes('text-[10px] font-black text-slate-400 hover:text-red-500')
                    ui.button('EXPORT MATRIX', icon='file_download').props('flat size=sm').classes('text-[10px] font-black text-slate-400 hover:text-green-600')

            # Channel Bulk Buttons
            channels = sorted(list(set(p.channel for p in PLACEMENTS)))
            with ui.row().classes('w-full flex-wrap gap-3'):
                for ch in channels:
                    with ui.row().classes('items-center bg-white border border-slate-200 hover:border-red-200 rounded-full pl-4 pr-1 py-1 shadow-sm transition-all group'):
                        ui.label(ch).classes('text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-tight mr-2')
                        with ui.row().classes('gap-1'):
                            ui.button(on_click=lambda r=state['region'], c=ch: [store.handle_bulk_channel_toggle(r, c, True), market_list.refresh()]) \
                                .props('flat icon=add size=xs').classes('w-6 h-6 rounded-full text-slate-400 hover:bg-red-500 hover:text-white transition-all')
                            ui.button(on_click=lambda r=state['region'], c=ch: [store.handle_bulk_channel_toggle(r, c, False), market_list.refresh()]) \
                                .props('flat icon=remove size=xs').classes('w-6 h-6 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all')

        # 3. Regional Tabs
        with ui.row().classes('w-full border-b border-slate-200 mb-6 gap-10 overflow-x-auto no-scrollbar'):
            active_regions = store.details.regions
            if not active_regions:
                ui.label('No regions selected in Campaign Details').classes('pb-4 text-slate-400 text-sm italic')
            else:
                # Ensure active state is valid
                if state['region'] not in active_regions:
                    state['region'] = active_regions[0]
                
                for reg in active_regions:
                    is_act = state['region'] == reg
                    active_classes = f'border-b-2 border-[{THEME["primary"]}] text-slate-900' if is_act else 'text-slate-400 hover:text-slate-600'
                    ui.label(reg).on('click', lambda r=reg: set_region(r)) \
                        .classes(f'pb-4 cursor-pointer text-base font-bold transition-all {active_classes}')

        # 4. Market List (Accordion)
        @ui.refreshable
        def market_list():
            filtered = [m for m in MARKETS if m.region == state['region'] and 
                        (state['search'].lower() in m.name.lower() or state['search'].lower() in m.code.lower())]
            
            with ui.column().classes('w-full gap-4'):
                for market in filtered:
                    selected_ids = store.matrix.get(market.selector, [])
                    count = len(selected_ids)
                    is_any = count > 0
                    
                    bg = f'bg-red-50/50 ring-1 ring-red-100 shadow-sm' if is_any else 'hover:bg-slate-50'
                    with ui.expansion().classes(f'w-full border-none rounded-2xl overflow-hidden transition-all {bg}') as expansion:
                        # Accordion Header (Trigger)
                        with expansion.add_slot('header'):
                            with ui.row().classes('w-full py-4 px-2 items-center justify-between'):
                                with ui.row().classes('items-center gap-6'):
                                    # Flag/Code Box
                                    box_bg = f'bg-[{THEME["primary"]}] text-white' if is_any else 'bg-white text-slate-900 border border-slate-200'
                                    ui.label(market.code).classes(f'w-16 h-16 rounded-xl flex items-center justify-center font-black text-xl shadow-sm {box_bg}')
                                    
                                    # Name & Channels
                                    with ui.column().classes('gap-1'):
                                        with ui.row().classes('items-center gap-3'):
                                            ui.label(market.name).classes('text-xl font-bold text-slate-900')
                                            if is_any:
                                                ui.badge(f'{count} PLACEMENTS').classes('bg-red-500 text-white border-none text-[9px] font-black px-2 h-5 flex items-center')
                                        
                                        with ui.row().classes('gap-2'):
                                            active_chans = store.get_active_channels(market.selector)
                                            if active_chans:
                                                for c in active_chans:
                                                    ui.label(c).classes('text-[10px] font-black uppercase text-slate-400 tracking-wider')
                                            else:
                                                ui.label('No formats selected').classes('text-sm text-slate-400 italic font-medium')
                                
                                # Actions
                                with ui.row().classes('items-center gap-4'):
                                    with ui.row().classes('bg-white p-1 rounded-xl border border-slate-100 shadow-sm'):
                                        ui.button('All', on_click=lambda m=market.selector: [store.toggle_market_all(m, [p.id for p in PLACEMENTS], True), market_list.refresh()]) \
                                            .props('flat size=sm').classes('px-4 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-all')
                                        ui.button('Clear', on_click=lambda m=market.selector: [store.toggle_market_all(m, [p.id for p in PLACEMENTS], False), market_list.refresh()]) \
                                            .props('flat size=sm').classes('px-4 py-1 text-[11px] font-bold text-slate-500 hover:text-red-500 transition-all')
                                    
                                    ui.button(on_click=lambda m=market.selector, r=market.region: [store.sync_to_region(m, r), market_list.refresh()]) \
                                        .props('flat icon=refresh size=sm').classes('w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all')

                        # Accordion Content
                        with ui.column().classes('w-full bg-white border-t border-slate-100 p-8'):
                            with ui.grid(columns=2).classes('w-full gap-12'):
                                for channel in channels:
                                    chan_placements = [p for p in PLACEMENTS if p.channel == channel]
                                    with ui.column().classes('gap-6'):
                                        # Channel Header within Market
                                        with ui.row().classes('w-full justify-between items-center'):
                                            ui.label(channel).classes('text-base font-black text-slate-900 flex items-center gap-2')
                                            with ui.row().classes('gap-1'):
                                                # Mini All/Clear for this channel
                                                ui.button('All', on_click=lambda m=market.selector, ids=[p.id for p in chan_placements]: [store.toggle_market_all(m, ids, True), market_list.refresh()]) \
                                                    .props('flat size=xs').classes('px-2 py-0 text-[10px] font-bold text-slate-400 hover:text-slate-900')
                                                ui.button('Clear', on_click=lambda m=market.selector, ids=[p.id for p in chan_placements]: [store.toggle_market_all(m, ids, False), market_list.refresh()]) \
                                                    .props('flat size=xs').classes('px-2 py-0 text-[10px] font-bold text-red-300 hover:text-red-500')
                                        
                                        # Placement Grid
                                        with ui.grid(columns=3).classes('w-full gap-3'):
                                            for p in chan_placements:
                                                is_p_act = p.id in selected_ids
                                                p_bg = 'bg-red-50 border-red-500 ring-1 ring-red-100' if is_p_act else 'bg-white border-slate-200 hover:border-slate-400'
                                                
                                                with ui.column().on('click', lambda m=market.selector, pid=p.id: [store.toggle_placement(m, pid), market_list.refresh()]) \
                                                    .classes(f'p-3 rounded-xl border cursor-pointer transition-all duration-200 gap-2 {p_bg}'):
                                                    
                                                    with ui.row().classes('w-full justify-between items-start'):
                                                        ui.label(p.name).classes(f'text-[11px] font-bold leading-tight flex-1 ' + ('text-red-700' if is_p_act else 'text-slate-700'))
                                                        # Custom Checkbox
                                                        with ui.row().classes(f'w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center ' + ('bg-slate-900' if is_p_act else 'bg-slate-50')):
                                                            if is_p_act:
                                                                ui.icon('check').classes('text-white text-[10px] font-black')
                                                    
                                                    with ui.row().classes('w-full justify-between items-center mt-auto'):
                                                        ui.label(p.size).classes('text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md')
                                                        badge_color = 'text-amber-700 bg-amber-50' if p.format == 'vid' else 'text-blue-700 bg-blue-50'
                                                        ui.label(p.format.upper()).classes(f'text-[8px] font-black px-1.5 py-0.5 rounded-md {badge_color}')

                    # Accordion Footer
                    if is_any:
                        with ui.row().classes('w-full bg-slate-50 p-6 border-t border-slate-100 justify-between items-center'):
                            ui.label(f'{count} placements selected for {market.name}').classes('text-sm text-slate-500 font-bold')
                            ui.button('Finish Selection', on_click=lambda ex=expansion: ex.set_value(False)) \
                                .props('elevated color=slate-900').classes('px-6 rounded-xl text-xs font-bold shadow-sm h-10')

        market_list()
