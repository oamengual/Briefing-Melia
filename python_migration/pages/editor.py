from nicegui import ui
from theme import THEME

@ui.page('/editor/{item_id}')
def editor_page(item_id: str):
    ui.colors(primary=THEME['primary'])
    
    # 0. Header (Mac-style Light UI)
    with ui.row().classes('w-full items-center justify-between px-4 bg-white border-b border-slate-200 h-[52px] shadow-sm sticky top-0 z-[100]'):
        with ui.row().classes('items-center gap-4'):
            with ui.button(on_click=lambda: ui.open('/briefings')).props('flat round dense icon=arrow_back').classes('text-slate-400 hover:text-slate-900'):
                ui.tooltip('Back to Briefings')
            
            with ui.row().classes('items-center gap-2'):
                ui.icon('description', size='18px').classes('text-primary')
                ui.label(item_id.replace('-', ' ').upper()).classes('text-xs font-black tracking-widest text-slate-900')
                ui.badge('v1.0.4').props('outline color=slate-200').classes('text-[9px] font-mono text-slate-400')
        
        # Toolset
        with ui.row().classes('bg-slate-50 p-1 rounded-lg border border-slate-200 gap-1'):
            tools = [
                ('near_me', 'Select', True),
                ('pan_tool', 'Hand', False),
                ('text_fields', 'Type', False),
                ('crop', 'Crop', False),
                ('color_lens', 'Style', False)
            ]
            for icon, tip, active in tools:
                with ui.button(icon=icon).props(f'flat dense size=sm {"color=primary" if active else "color=slate-400"}').classes(f'rounded-md h-8 w-8 {"bg-white shadow-sm" if active else "hover:bg-white/50"}'):
                    ui.tooltip(tip)
        
        with ui.row().classes('items-center gap-3'):
            ui.button('Review', icon='visibility').props('flat size=sm').classes('text-slate-500 font-bold h-9 hover:bg-slate-50 rounded-lg px-4')
            ui.button('Export', icon='download').props('unelevated').classes('bg-primary text-white rounded-lg px-6 font-bold text-xs h-9 uppercase tracking-widest shadow-lg shadow-red-100')

    # 1. Main Content Layout
    with ui.row().classes('w-full h-[calc(100vh-52px)] gap-0 overflow-hidden bg-white'):
        
        # LEFT SIDEBAR: LAYERS & ASSETS
        with ui.column().classes('w-72 h-full border-r border-slate-200 flex-nowrap bg-white'):
            with ui.tabs().classes('w-full bg-slate-50/50 border-b border-slate-200 text-slate-500') as side_tabs:
                ui.tab('Layers').classes('text-[10px] font-black uppercase w-1/2')
                ui.tab('Assets').classes('text-[10px] font-black uppercase w-1/2')
            
            with ui.tab_panels(side_tabs, value='Layers').classes('w-full bg-transparent p-0 flex-1'):
                with ui.tab_panel('Layers'):
                    with ui.column().classes('w-full gap-1 p-2'):
                        layer_groups = [
                            ('HEADLINE', [('Headline Copy', 'type'), ('Subline Text', 'type')]),
                            ('LOGO', [('Master Logo', 'image'), ('Slogan', 'type')]),
                            ('PRODUCT', [('Front Shot', 'image'), ('Shadows', 'image')]),
                            ('BACKGROUND', [('Color Overlay', 'palette'), ('Texture', 'image')])
                        ]
                        for group, items in layer_groups:
                            with ui.expansion(group).props('dense header-class=text-[9px] font-black tracking-widest text-slate-400').classes('w-full border-none'):
                                with ui.column().classes('pl-4 gap-0.5 w-full'):
                                    for name, kind in items:
                                        with ui.row().classes('w-full p-2 items-center gap-3 rounded-lg hover:bg-slate-50 cursor-pointer group'):
                                            ui.icon('visibility').classes('text-slate-300 group-hover:text-primary size-4')
                                            ui.icon('image' if kind == 'image' else 'text_fields' if kind == 'type' else 'palette').classes('text-slate-300 size-4')
                                            ui.label(name).classes('text-xs font-medium text-slate-600')
                
                with ui.tab_panel('Assets'):
                    ui.label('Creative library coming soon...').classes('text-slate-400 italic text-xs text-center p-12')

        # MAIN AREA: CANVAS
        with ui.column().classes('flex-1 h-full bg-slate-50 relative overflow-hidden items-center justify-center'):
            # Grid Pattern
            ui.element('div').classes('absolute inset-0 opacity-[0.05] pointer-events-none').style('background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 40px 40px;')
            
            # Viewport Badge
            with ui.row().classes('absolute top-6 left-6 gap-3'):
                with ui.row().classes('bg-white border border-slate-200 rounded-lg px-3 py-1.5 gap-2 items-center shadow-sm'):
                    ui.label('1080 × 1080').classes('text-[10px] font-mono text-slate-500')
                    ui.badge('1:1').props('outline color=slate-400').classes('text-[8px] text-slate-400')
            
            # THE CANVAS
            with ui.card().classes('bg-white p-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden w-[540px] h-[540px] relative transition-transform hover:scale-[1.01] duration-500'):
                # Ad Preview Rendering
                ui.image('https://picsum.photos/id/20/1080/1080').classes('absolute inset-0 w-full h-full object-cover opacity-80')
                ui.element('div').classes('absolute inset-0 bg-gradient-to-t from-black/60 to-transparent')
                
                with ui.column().classes('absolute bottom-12 left-12 right-12 gap-2'):
                    ui.label('NEW ARRIVALS').classes('text-white font-black text-4xl tracking-tighter leading-none')
                    ui.label('SUMMER 2024 COLLECTION').classes('text-primary font-bold text-xs tracking-widest')
                
                # Bounding Box (Active)
                ui.element('div').classes('absolute inset-0 border-2 border-primary/50 pointer-events-none')
                for corner in ['-left-1 -top-1', 'right-1 -top-1', '-left-1 bottom-1', 'right-1 bottom-1']:
                    ui.element('div').classes(f'absolute w-2 h-2 bg-white border border-primary {corner}')

            # Zoom & Pan Controls
            with ui.row().classes('absolute bottom-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 items-center gap-6 shadow-xl'):
                with ui.row().classes('items-center gap-1'):
                    ui.button(icon='remove').props('flat dense size=sm').classes('text-slate-400 hover:text-slate-900')
                    ui.label('48%').classes('text-[10px] font-black w-10 text-center text-slate-900')
                    ui.button(icon='add').props('flat dense size=sm').classes('text-slate-400 hover:text-slate-900')
                ui.separator().props('vertical').classes('bg-slate-200')
                ui.button(icon='fullscreen').props('flat dense size=sm').classes('text-slate-400 hover:text-slate-900')

        # RIGHT SIDEBAR: PROPERTIES & VARIATIONS
        with ui.column().classes('w-80 h-full border-l border-slate-200 flex-nowrap bg-white'):
             with ui.row().classes('w-full p-4 border-b border-slate-100 items-center justify-between'):
                with ui.row().classes('items-center gap-2'):
                    ui.icon('tune', size='16px').classes('text-primary')
                    ui.label('PROPERTIES').classes('text-[10px] font-black uppercase tracking-widest text-slate-400')
                ui.button(icon='more_horiz').props('flat round size=sm').classes('text-slate-300')
            
             with ui.scroll_area().classes('flex-1'):
                 with ui.column().classes('p-6 gap-8 w-full'):
                     # Property Section: Transform
                     with ui.column().classes('w-full gap-4'):
                         ui.label('Transform').classes('text-[10px] font-black text-slate-400 uppercase tracking-widest')
                         with ui.grid(columns=2).classes('w-full gap-3'):
                             for label, val in [('X', '540'), ('Y', '540'), ('W', '1080'), ('H', '1080')]:
                                 with ui.row().classes('items-center gap-2 bg-slate-50 rounded-lg px-2 border border-slate-100'):
                                     ui.label(label).classes('text-[9px] font-bold text-slate-400')
                                     ui.input(value=val).classes('flex-1 border-none bg-transparent h-8 text-[11px] font-mono text-slate-900')
                     
                     # Property Section: Typography
                     with ui.column().classes('w-full gap-4'):
                         ui.label('Typography').classes('text-[10px] font-black text-slate-400 uppercase tracking-widest')
                         ui.select(['Foco Bold', 'Inter', 'Roboto'], value='Foco Bold').classes('w-full bg-slate-50 border-slate-200 rounded-lg text-xs')
                         with ui.row().classes('w-full gap-2'):
                             ui.input(value='42px').classes('flex-1 bg-slate-50 border-slate-200 rounded-lg h-9 px-3 text-xs font-mono')
                             with ui.row().classes('items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 h-9'):
                                 ui.element('div').classes('w-4 h-4 rounded bg-white shadow-inner border border-slate-200 pointer-events-auto cursor-pointer')
                                 ui.label('#FFFFFF').classes('text-[10px] font-mono text-slate-500')
                     
                     ui.separator().classes('bg-slate-100')

                     # Property Section: Variations
                     with ui.column().classes('w-full gap-4'):
                         with ui.row().classes('w-full justify-between items-center'):
                             ui.label('Variations').classes('text-[10px] font-black text-slate-400 uppercase tracking-widest')
                             ui.badge('3 ACTIVE', color='primary').classes('text-[8px] px-1.5 font-black')
                         
                         with ui.column().classes('w-full gap-2'):
                             for v in ['Master (DE)', 'Variant A (FR)', 'Social (UK)']:
                                 active = (v == 'Master (DE)')
                                 with ui.row().classes(f'w-full p-2.5 rounded-xl border items-center justify-between transition-all cursor-pointer {"bg-red-50 border-red-200" if active else "bg-white border-slate-100 hover:border-slate-200"}'):
                                     ui.label(v).classes(f'text-xs font-bold {"text-slate-900" if active else "text-slate-400"}')
                                     if active: ui.icon('check_circle', size='xs', color='primary')
