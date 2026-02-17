from nicegui import ui
from theme import THEME

def market_matrix():
    with ui.column().classes('w-full gap-8'):
        # Toolbar
        with ui.row().classes('w-full justify-between items-center'):
            with ui.column().classes('gap-1'):
                ui.label('Market Mix').classes('text-3xl font-bold tracking-tight')
                ui.label('Define market-specific placements and regional configurations.').classes('text-sm text-zinc-500')
            
            with ui.row().classes('w-96 relative items-center'):
                ui.icon('search').classes('absolute left-3 text-zinc-500 z-10')
                ui.input(placeholder='Search markets...').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 pl-10 text-sm')

        # Global Controls Card
        with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card'):
            with ui.row().classes('w-full justify-between items-center mb-6'):
                with ui.row().classes('items-center gap-3'):
                    ui.icon('bolt', color='primary').classes('text-xl')
                    with ui.column().classes('gap-0'):
                        ui.label('Global Controls').classes('text-sm font-bold')
                        ui.label('Apply across EMEA markets').classes('text-[10px] text-zinc-500 uppercase font-black')
                
                with ui.row().classes('bg-zinc-900 p-1 rounded-lg gap-2'):
                    ui.button('Select All').props('flat size=sm').classes('text-[10px] font-black uppercase text-zinc-400')
                    ui.button('Clear All').props('flat size=sm').classes('text-[10px] font-black uppercase text-red-500')

            # Channels / Bulk selection
            with ui.row().classes('gap-2'):
                for channel in ['Social', 'Display', 'Video', 'Search']:
                    with ui.row().classes('items-center bg-zinc-900 border border-zinc-800 rounded-full pl-3 pr-1 py-1'):
                        ui.label(channel).classes('text-[10px] font-black uppercase text-zinc-500 mr-2')
                        ui.button(icon='add').props('flat round size=xs').classes('text-zinc-500 hover:text-white')
                        ui.button(icon='remove').props('flat round size=xs').classes('text-zinc-500 hover:text-red-500')

        # Market Accordions (Mockup)
        with ui.column().classes('w-full gap-4'):
             markets = [('Germany', 'DE', 12, ['Social', 'Display']), ('France', 'FR', 8, ['Video']), ('United Kingdom', 'UK', 0, [])]
             for name, code, count, channels in markets:
                 with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-6 rounded-xl shadow-card hover:bg-zinc-800/20 transition-colors cursor-pointer'):
                     with ui.row().classes('w-full items-center justify-between'):
                         with ui.row().classes('items-center gap-6'):
                             with ui.box().classes(f'w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg {"bg-[#e4002b] text-white" if count > 0 else "bg-zinc-900 text-zinc-500"}'):
                                 ui.label(code)
                             
                             with ui.column().classes('gap-1'):
                                 with ui.row().classes('items-center gap-2'):
                                     ui.label(name).classes('text-lg font-bold')
                                     if count > 0:
                                         ui.badge(f'{count} PLACEMENTS', color='primary').classes('text-[8px] font-black px-1.5')
                                 
                                 with ui.row().classes('gap-2'):
                                     if channels:
                                         for c in channels:
                                             ui.label(c.upper()).classes('text-[9px] font-black tracking-widest text-zinc-500')
                                     else:
                                         ui.label('No formats selected').classes('text-[10px] text-zinc-500 italic')
                         
                         with ui.row().classes('items-center gap-4'):
                             with ui.row().classes('bg-zinc-900 p-1 rounded-lg'):
                                 ui.button('All').props('flat size=xs').classes('text-[9px] font-black')
                                 ui.button('Clear').props('flat size=xs').classes('text-[9px] font-black text-red-500')
                             ui.button(icon='refresh', color='zinc-800').classes('radius-btn h-9 w-9 text-zinc-500').props('flat round')
                             ui.icon('expand_more').classes('text-zinc-500')
