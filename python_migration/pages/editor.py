from nicegui import ui
from ..theme import THEME

@ui.page('/editor/{item_id}')
def editor_page(item_id: str):
    # Header
    with ui.row().classes('w-full items-center justify-between p-4 bg-[#09090b] border-b border-[#212126] h-[60px]'):
        with ui.row().classes('items-center gap-4'):
            ui.button(on_click=lambda: ui.open('/')).props('flat icon=arrow_back').classes('text-zinc-500 hover:text-white')
            ui.label(item_id.replace('-', ' ').title()).classes('text-lg font-bold')
        
        with ui.row().classes('items-center gap-6'):
            # Toolset (Mock)
            with ui.row().classes('bg-[#131316] p-1 rounded-lg border border-[#212126]'):
                ui.button(icon='mouse').props('flat size=sm').classes('bg-zinc-800 text-white rounded-md')
                ui.button(icon='hand').props('flat size=sm').classes('text-zinc-500')
                ui.button(icon='title').props('flat size=sm').classes('text-zinc-500')
            
            ui.button('Export', icon='download').classes(f'bg-[{THEME["primary"]}] rounded-lg px-4 font-bold text-xs h-9 uppercase tracking-wider')

    # Main Content Layout
    with ui.row().classes('w-full h-[calc(100vh-60px)] gap-0 overflow-hidden'):
        # 1. Left Sidebar: Layers
        with ui.column().classes('w-[280px] h-full bg-[#09090b] border-r border-[#212126] p-0'):
            with ui.row().classes('w-full p-4 border-b border-[#212126] items-center gap-2'):
                ui.icon('layers', size='16px').classes('text-zinc-400')
                ui.label('LAYERS').classes('text-[10px] font-black uppercase tracking-widest text-zinc-400')
            
            with ui.column().classes('w-full p-2 gap-1 overflow-y-auto'):
                layers = [
                    ('Headline Text', 'type', True),
                    ('Logo Graphics', 'group', True),
                    ('Product Shot', 'image', True),
                    ('Background', 'image', False),
                ]
                for name, kind, visible in layers:
                    with ui.row().classes('w-full p-2 items-center gap-3 rounded-lg hover:bg-zinc-900 cursor-pointer group'):
                        ui.icon('visibility' if visible else 'visibility_off').classes('text-zinc-500 group-hover:text-white transition-colors')
                        ui.icon('image' if kind == 'image' else 'title' if kind == 'type' else 'folder').classes('text-zinc-400 size-4')
                        ui.label(name).classes('text-sm font-medium')

        # 2. Main Area: Canvas
        with ui.column().classes('flex-1 h-full bg-[#131316] relative overflow-hidden items-center justify-center'):
            # Canvas Container
            with ui.card().classes('bg-white p-0 shadow-2xl rounded-sm overflow-hidden w-[600px] h-[400px] relative'):
                 # Placeholder for composite
                 ui.label('600 x 400').classes('absolute top-4 right-4 text-[10px] text-zinc-300 pointer-events-none')
            
            # Bottom Controls (Zoom etc)
            with ui.row().classes('absolute bottom-8 bg-[#1C1C21] px-4 py-2 rounded-full border border-[#212126] items-center gap-4 shadow-xl'):
                ui.button(icon='remove').props('flat size=sm').classes('text-zinc-400')
                ui.label('100%').classes('text-xs font-bold w-12 text-center')
                ui.button(icon='add').props('flat size=sm').classes('text-zinc-400')

        # 3. Right Sidebar: Properties
        with ui.column().classes('w-[280px] h-full bg-[#09090b] border-l border-[#212126] p-0'):
             with ui.row().classes('w-full p-4 border-b border-[#212126] items-center gap-2'):
                ui.icon('settings', size='16px').classes('text-zinc-400')
                ui.label('PROPERTIES').classes('text-[10px] font-black uppercase tracking-widest text-zinc-400')
            
             with ui.column().classes('w-full p-8 items-center justify-center text-center opacity-40 h-full'):
                 ui.icon('unfold_more', size='40px')
                 ui.label('Select an item to view its properties').classes('text-xs mt-4 font-medium px-4')
