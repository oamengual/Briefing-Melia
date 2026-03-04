from nicegui import ui
from theme import THEME

def placement_manager():
    with ui.row().classes('w-full h-[600px] border border-zinc-800 rounded-xl overflow-hidden gap-0 bg-zinc-900/10'):
        # 1. Channels (Left)
        with ui.column().classes('w-56 h-full border-r border-zinc-800 bg-zinc-900/30 flex-nowrap'):
            with ui.row().classes('p-4 justify-between items-center border-b border-zinc-800/50'):
                ui.label('Channels').classes('text-xs font-black text-zinc-500 uppercase tracking-widest')
                ui.button(icon='add').props('flat round size=xs').classes('text-zinc-500 hover:text-white')
            
            with ui.column().classes('p-2 w-full gap-1'):
                channels = ['Facebook', 'Instagram', 'Display', 'Video', 'Search', 'Social']
                for channel in channels:
                    is_active = (channel == 'Facebook')
                    with ui.button().props('flat').classes(f'w-full justify-start px-3 py-2 rounded-lg text-xs font-bold {"bg-primary/10 text-primary" if is_active else "text-zinc-500 hover:bg-zinc-800/50"}'):
                        with ui.row().classes('w-full items-center justify-between'):
                            ui.label(channel)
                            if is_active:
                                ui.icon('chevron_right', size='xs').classes('opacity-50')
                            else:
                                ui.element('div')

        # 2. Placements (Center)
        with ui.column().classes('w-72 h-full border-r border-zinc-800 bg-[#09090b] flex-nowrap'):
            with ui.row().classes('p-4 justify-between items-center bg-zinc-900/20 border-b border-zinc-800/50'):
                ui.label('Facebook PLACEMENTS').classes('text-[10px] font-black text-zinc-500 uppercase tracking-widest')
                ui.button('Add', icon='add').props('flat size=xs').classes('bg-white/5 text-zinc-300 radius-btn px-2')
            
            with ui.scroll_area().classes('flex-1'):
                with ui.column().classes('p-3 w-full gap-2'):
                    placements = [
                        ('Single Image', '1080x1080', 'IMG'),
                        ('Video Feed', '1080x1350', 'VID'),
                        ('Story Ad', '1080x1920', 'VID'),
                        ('Carousel', '1080x1080', 'IMG')
                    ]
                    for name, size, fmt in placements:
                        is_active = (name == 'Single Image')
                        with ui.button().props('flat').classes(f'w-full flex-col items-start p-3 rounded-xl border {"border-primary/40 bg-primary/5 shadow-lg" if is_active else "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700"}'):
                            ui.label(name).classes(f'text-xs font-bold {"text-white" if is_active else "text-zinc-400"}')
                            with ui.row().classes('items-center gap-2 mt-1'):
                                ui.label(size).classes('text-[10px] font-mono text-zinc-500')
                                ui.element('div').classes('w-px h-2 bg-zinc-800')
                                ui.label(fmt).classes('text-[10px] font-black text-zinc-600 tracking-widest')

        # 3. Details (Right)
        with ui.column().classes('flex-1 h-full bg-zinc-900/10'):
            # Header
            with ui.row().classes('w-full h-14 border-b border-zinc-800 items-center justify-between px-6 bg-[#09090b]'):
                ui.label('Edit Placement').classes('text-sm font-bold text-white')
                ui.badge('ID: FB_IMG_SQ').props('outline color=zinc-700').classes('text-[9px] font-mono')

            # Form
            with ui.scroll_area().classes('flex-1'):
                with ui.column().classes('p-8 max-w-xl gap-8'):
                    with ui.column().classes('w-full gap-4'):
                        # Basic Info
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Name').classes('text-[10px] font-black text-zinc-500 uppercase')
                            ui.input(value='Single Image').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm font-bold')
                        
                        # Size
                        with ui.grid(columns=2).classes('w-full gap-4'):
                            with ui.column().classes('gap-2'):
                                ui.label('Width (px)').classes('text-[10px] font-black text-zinc-500 uppercase')
                                ui.input(value='1080').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm font-mono')
                            with ui.column().classes('gap-2'):
                                ui.label('Height (px)').classes('text-[10px] font-black text-zinc-500 uppercase')
                                ui.input(value='1080').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm font-mono')

                        # Format Selector
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Format Type').classes('text-[10px] font-black text-zinc-500 uppercase')
                            with ui.row().classes('w-full gap-2'):
                                for icon, label, active in [('image', 'Image', True), ('movie', 'Video', False), ('code', 'HTML5', False)]:
                                    with ui.button().props('flat').classes(f'flex-1 h-16 flex-col gap-1 rounded-xl border {"bg-primary border-primary text-white" if active else "bg-zinc-900 border-zinc-800 text-zinc-500"}'):
                                        ui.icon(icon, size='xs')
                                        ui.label(label).classes('text-[10px] font-bold')

                    ui.separator().classes('bg-zinc-800/50')

                    # Tech Specs
                    with ui.column().classes('w-full gap-4'):
                        with ui.row().classes('items-center gap-2'):
                            ui.label('Technical Requirements').classes('text-sm font-bold text-white')
                            ui.badge('OPTIONAL OVERRIDES').classes('text-[8px] font-black bg-zinc-800 text-zinc-500')
                        
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Max File Size (KB)').classes('text-[10px] font-black text-zinc-500 uppercase')
                            ui.input(placeholder='Default: 150').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
                        
                        with ui.column().classes('w-full gap-2'):
                            ui.label('Output Formats').classes('text-[10px] font-black text-zinc-500 uppercase')
                            ui.input(placeholder='Default: jpg, png').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')
                            ui.label('Comma separated extensions (e.g. mp4, mov)').classes('text-[9px] text-zinc-600')
