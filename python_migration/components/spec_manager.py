from nicegui import ui
from theme import THEME

def spec_manager():
    with ui.row().classes('w-full h-[600px] border border-zinc-800 rounded-xl overflow-hidden gap-0 bg-zinc-900/10'):
        # 1. Placement Selection (Left)
        with ui.column().classes('w-64 h-full border-r border-zinc-800 bg-zinc-900/30 flex-nowrap'):
            with ui.column().classes('p-4 gap-4 w-full'):
                with ui.row().classes('w-full justify-between items-center'):
                    ui.label('Placements').classes('text-sm font-bold text-white')
                    ui.badge('24', color='zinc-800').classes('text-[10px] font-black')
                
                with ui.row().classes('relative items-center'):
                    ui.icon('search', size='xs').classes('absolute left-2 text-zinc-500 z-10')
                    ui.input(placeholder='Search...').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-8 pl-8 text-xs')

            with ui.scroll_area().classes('flex-1'):
                with ui.column().classes('p-2 w-full gap-6'):
                    for channel in ['Facebook', 'Instagram', 'Display']:
                        with ui.column().classes('w-full gap-1'):
                            with ui.row().classes('items-center gap-2 px-2 text-[10px] font-black text-zinc-500 tracking-widest'):
                                ui.icon('smartphone', size='xs')
                                ui.label(channel.upper())
                            
                            for p_name, p_size in [('Single Image', '1080x1080'), ('Feed Ad', '1080x1350')]:
                                is_active = (p_name == 'Single Image' and channel == 'Facebook')
                                with ui.button().props('flat').classes(f'w-full justify-start px-3 py-2 rounded-lg text-xs transition-all {"bg-primary/10 border-primary/20 text-primary font-bold" if is_active else "text-zinc-500 hover:bg-zinc-800/50"}'):
                                    with ui.row().classes('w-full items-center justify-between'):
                                        with ui.column().classes('gap-0 items-start'):
                                            ui.label(p_name)
                                            ui.label(p_size).classes('text-[9px] font-mono opacity-60')
                                        if is_active:
                                            ui.icon('arrow_forward', size='xs')

        # 2. Preview Canvas (Center)
        with ui.column().classes('flex-1 h-full bg-[#09090b] items-center justify-center relative'):
            # Grid overlay
            ui.row().classes('absolute inset-0 opacity-10 pointer-events-none').style('background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;')
            
            # Viewport Badge
            with ui.row().classes('absolute top-4 left-4 gap-2'):
                ui.badge('1080 x 1080 PX', color='zinc-900').classes('text-[10px] font-mono ring-1 ring-zinc-800')
                ui.badge('100% SCALE', color='zinc-900').classes('text-[10px] font-mono ring-1 ring-zinc-800')

            # Ad Mockup
            with ui.card().classes('w-72 h-72 bg-white rounded-none p-0 relative shadow-2xl'):
                # Border Render
                ui.row().classes('absolute inset-0 border-[1px] border-zinc-900 pointer-events-none z-10')
                # Content Placeholder
                ui.label('AD CREATIVE').classes('absolute inset-0 flex items-center justify-center text-zinc-100 font-black text-3xl rotate-[-15deg] select-none')
                # Logo Render
                with ui.row().classes('absolute bottom-4 right-4 w-16 h-8 bg-primary/10 border-2 border-primary border-dashed flex items-center justify-center'):
                    ui.label('LOGO').classes('text-[8px] font-black text-primary')

        # 3. Rules Panel (Right)
        with ui.column().classes('w-72 h-full border-l border-zinc-800 bg-[#09090b] flex-nowrap'):
            with ui.row().classes('p-4 justify-between items-center border-b border-zinc-800/50 h-14'):
                with ui.row().classes('items-center gap-2'):
                    ui.icon('settings', color='primary', size='xs')
                    ui.label('Configuration').classes('text-xs font-bold text-white')
                ui.button(icon='content_copy').props('flat round size=xs').classes('text-zinc-500 hover:text-white')

            with ui.scroll_area().classes('flex-1'):
                with ui.column().classes('p-6 gap-8'):
                    # Frame Section
                    with ui.column().classes('w-full gap-4'):
                        with ui.row().classes('w-full justify-between items-center'):
                            with ui.row().classes('items-center gap-2'):
                                with ui.row().classes('p-1.5 rounded bg-orange-900/20 text-orange-400'):
                                    ui.icon('crop_square', size='xs')
                                with ui.column().classes('gap-0'):
                                    ui.label('Frame').classes('text-xs font-bold text-white')
                                    ui.label('Outer border').classes('text-[9px] text-zinc-500')
                            ui.switch(value=True).props('size=xs')
                        
                        with ui.grid(columns=2).classes('w-full gap-4 pl-4 border-l border-zinc-800'):
                            with ui.column().classes('gap-1'):
                                ui.label('WIDTH (PX)').classes('text-[9px] font-black text-zinc-600')
                                ui.input(value='1').classes('w-full bg-zinc-900 border-zinc-800 rounded h-8 px-2 text-xs font-mono')
                            with ui.column().classes('gap-1'):
                                ui.label('COLOR').classes('text-[9px] font-black text-zinc-600')
                                with ui.row().classes('items-center gap-1'):
                                    ui.row().classes('w-6 h-6 rounded bg-black border border-zinc-800')
                                    ui.input(value='#000000').classes('flex-1 bg-zinc-900 border-zinc-800 rounded h-8 px-2 text-[10px] font-mono')

                    # Logo Section
                    with ui.column().classes('w-full gap-4'):
                        with ui.row().classes('w-full justify-between items-center'):
                            with ui.row().classes('items-center gap-2'):
                                with ui.row().classes('p-1.5 rounded bg-blue-900/20 text-blue-400'):
                                    ui.icon('image', size='xs')
                                with ui.column().classes('gap-0'):
                                    ui.label('Logo').classes('text-xs font-bold text-white')
                                    ui.label('Position & size').classes('text-[9px] text-zinc-500')
                            ui.switch(value=True).props('size=xs')
                        
                        with ui.column().classes('w-full gap-4 pl-4 border-l border-zinc-800'):
                            with ui.column().classes('gap-1'):
                                ui.label('WIDTH (PX)').classes('text-[9px] font-black text-zinc-600')
                                ui.input(value='100').classes('w-full bg-zinc-900 border-zinc-800 rounded h-8 px-2 text-xs font-mono')
                            
                            with ui.column().classes('gap-1'):
                                ui.label('ANCHOR POSITION').classes('text-[9px] font-black text-zinc-600')
                                with ui.grid(columns=3).classes('w-fit bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 gap-1 mx-auto'):
                                    for i in range(9):
                                        is_active = (i == 8)
                                        ui.row().classes(f'w-6 h-6 rounded border transition-all pointer-events-auto {"bg-primary border-primary" if is_active else "bg-zinc-800 border-zinc-700 hover:border-zinc-500"} cursor-pointer')
                            
                            with ui.column().classes('gap-1'):
                                ui.label('MARGINS (PX)').classes('text-[9px] font-black text-zinc-600')
                                with ui.grid(columns=2).classes('w-full gap-2'):
                                    for l in ['Top', 'Right', 'Bottom', 'Left']:
                                        with ui.column().classes('gap-0.5'):
                                            ui.label(l).classes('text-[8px] text-zinc-500')
                                            ui.input(value='20').classes('w-full bg-zinc-900 border-zinc-800 rounded h-7 px-2 text-[10px] font-mono')

            # Footer
            with ui.row().classes('p-4 border-t border-zinc-800'):
                ui.button('Save Changes', icon='save').props('flat size=sm').classes('w-full bg-white text-black radius-btn font-bold h-10')
