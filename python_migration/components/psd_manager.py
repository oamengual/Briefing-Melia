from nicegui import ui, events
from theme import THEME
from logic.briefing_store import store
from logic.psd_handler import PsdHandler
from logic.briefing_manager import BriefingManager
import io
import os

@ui.refreshable
def template_grid():
    with ui.column().classes('w-full gap-6'):
        with ui.grid(columns=3).classes('w-full gap-6'):
            if not store.psd_templates:
                with ui.column().classes('col-span-3 items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl'):
                    ui.icon('image', size='lg').classes('text-slate-300 mb-4')
                    ui.label('No templates uploaded').classes('text-sm font-bold text-slate-500')
                    ui.label('Upload a PSD file to start designing variations.').classes('text-[10px] text-slate-400')
            
            for template in store.psd_templates:
                is_active = template.get('active', False)
                with ui.card().classes(f'p-0 bg-white border-{ "red-200 shadow-lg ring-2 ring-red-50" if is_active else "slate-200" } rounded-2xl overflow-hidden hover:border-red-200 transition-all cursor-pointer relative group'):
                    # Preview placeholder
                    with ui.row().classes('w-full h-32 bg-slate-100 flex items-center justify-center overflow-hidden'):
                         # In a real app we'd show the generated PNG preview
                         ui.icon('psychology_alt', size='32px').classes('text-slate-300 group-hover:scale-110 transition-transform')
                    
                    with ui.column().classes('p-4 gap-1'):
                        ui.label(template['name']).classes('text-sm font-bold text-slate-900')
                        ui.label(template['filename']).classes('text-[10px] font-mono text-slate-400 truncate')
                        with ui.row().classes('w-full justify-between items-center mt-2'):
                            ui.label(f"{template['size'][0]}x{template['size'][1]}").classes('text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded')
                            ui.label(f"{len(template['layers'])} Layers").classes('text-[9px] font-bold text-slate-400')
                    
                    if is_active:
                        with ui.row().classes('absolute top-2 right-2'):
                            ui.badge('ACTIVE', color='red-500').classes('text-[8px] font-black px-2 py-0.5 rounded-full')

        # Upload Control
        with ui.column().classes('w-full'):
            async def handle_upload(e: events.UploadEventArguments):
                try:
                    content = e.content.read()
                    # 1. Save physical file
                    filepath = BriefingManager.save_psd_asset(store.id or 'temp', content, e.name)
                    
                    # 2. Parse Layers
                    handler = PsdHandler(io.BytesIO(content))
                    
                    # 3. Update Store
                    store.add_psd_template(
                        name=e.name.split('.')[0].replace('_', ' ').title(),
                        filename=e.name,
                        layers=handler.get_layer_structure(),
                        size=handler.size
                    )
                    ui.notify(f"Successfully processed {e.name}", color='positive', icon='check_circle')
                    template_grid.refresh()
                except Exception as ex:
                    ui.notify(f"Error parsing PSD: {str(ex)}", color='negative', icon='error')

            with ui.row().classes('w-full items-center gap-4 p-8 bg-slate-50 rounded-3xl border-2 border-slate-200 border-dashed hover:border-red-200 hover:bg-red-50/30 transition-all'):
                with ui.column().classes('items-center gap-4 w-full'):
                    ui.icon('cloud_upload', size='lg').classes('text-slate-300')
                    ui.label('Drag and drop your Photoshop templates here. Max 50MB.').classes('text-xs text-slate-500 font-medium')
                    ui.upload(on_upload=handle_upload, label='Upload PSD', auto_upload=True).props('flat color=primary').classes('bg-white border border-slate-200 px-4 rounded-xl shadow-sm')

def psd_manager(brief_id='new'):
    with ui.column().classes('w-full gap-8'):
        # Header
        with ui.column().classes('gap-1'):
            ui.label('Design Templates').classes('text-2xl font-bold tracking-tight text-slate-900')
            ui.label('Associate Photoshop (PSD) files with this campaign to enable automated production.').classes('text-sm text-slate-500 font-medium')

        template_grid()
