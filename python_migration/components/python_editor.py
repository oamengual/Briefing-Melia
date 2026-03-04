from nicegui import ui
from theme import THEME
from logic.briefing_store import store

@ui.refreshable
def python_editor():
    if not store.psd_templates:
        with ui.column().classes('w-full items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center gap-6'):
            ui.icon('layers_clear', size='lg').classes('text-slate-300')
            with ui.column().classes('gap-1'):
                ui.label('No Templates Found').classes('text-xl font-bold text-slate-900')
                ui.label('Upload a PSD template first to enable the integrated editor.').classes('text-sm text-slate-500 font-medium')
            ui.button('Go to PSD Assets', on_click=lambda: ui.open('/briefing-new?tab=PSD Assets')).classes(f'bg-[{THEME["primary"]}] text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-red-100')
        return

    # Find active template or use first
    active_template = next((t for t in store.psd_templates if t.get('active')), store.psd_templates[0])
    text_layers = [l for l in active_template['layers'] if l.get('kind') == 'type']
    
    # Get current mapping from template
    current_mapping = active_template.get('layer_mapping', {})

    with ui.row().classes('w-full gap-8'):
        # LEFT: LAYER LIST & MAPPING
        with ui.column().classes('flex-1 gap-6'):
            with ui.column().classes('gap-1'):
                ui.label('Layer Mapping').classes('text-2xl font-bold text-slate-900')
                ui.label(f'Active Template: {active_template["name"]} ({active_template["size"][0]}x{active_template["size"][1]})').classes('text-sm text-slate-500 font-medium')

            with ui.card().classes('w-full p-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden'):
                with ui.column().classes('divide-y divide-slate-100 w-full'):
                    # Table Header
                    with ui.grid(columns=3).classes('w-full px-6 py-4 bg-slate-50/50 items-center'):
                        ui.label('PHOTOSHOP LAYER').classes('text-[10px] font-black text-slate-400 uppercase tracking-widest')
                        ui.label('CURRENT CONTENT').classes('text-[10px] font-black text-slate-400 uppercase tracking-widest text-center')
                        ui.label('CAMPAIGN SOURCE').classes('text-[10px] font-black text-slate-400 uppercase tracking-widest text-right')

                    if not text_layers:
                        ui.label('No text layers detected in this PSD.').classes('p-8 text-center text-slate-400 italic')
                    
                    for layer in text_layers:
                        # Simple heuristics for mapping: match layer name (case-insensitive) to creative fields
                        # e.g. layer "CLAIM" maps to store.creative['claim']
                        layer_name_clean = layer['name'].lower().strip()
                        detected_field = next((f for f in store.creative if f in layer_name_clean), None)
                        mapped_field = current_mapping.get(layer['id'], detected_field)
                        
                        with ui.grid(columns=3).classes('w-full px-6 py-5 items-center hover:bg-slate-50/50 transition-colors group'):
                            # Layer Info
                            with ui.row().classes('items-center gap-3'):
                                ui.icon('text_fields', size='xs').classes('text-slate-300 group-hover:text-primary transition-colors')
                                with ui.column().classes('gap-0'):
                                    ui.label(layer['name']).classes('text-sm font-bold text-slate-900')
                                    ui.label(f'ID: {layer["id"][:8]}').classes('text-[9px] font-mono text-slate-400')
                            
                            # Content Preview
                            with ui.row().classes('justify-center'):
                                ui.label(layer['text'] or 'Empty').classes('text-xs text-slate-500 italic max-w-[200px] truncate')
                            
                            # Mapping Control
                            with ui.row().classes('justify-end'):
                                def update_mapping(e, l_id=layer['id'], tid=active_template['id']):
                                    current_mapping[l_id] = e.value
                                    store.set_layer_mapping(tid, current_mapping)
                                    ui.notify(f'Mapped layer {l_id[:8]} to {e.value}', color='positive')
                                    python_editor.refresh()

                                options = {f: f.upper() for f in store.creative}
                                options['manual'] = 'MANUAL OVERRIDE'
                                
                                ui.select(options, value=mapped_field or 'manual') \
                                    .props('dense borderless size=sm') \
                                    .classes('w-40 bg-slate-100 rounded-lg px-3 text-[10px] font-black text-slate-700') \
                                    .on('change', update_mapping)

        # RIGHT: LIVE PREVIEW MOCKUP
        with ui.column().classes('w-96 gap-6'):
            ui.label('Live Mapping Preview').classes('text-xs font-black text-slate-400 uppercase tracking-widest')
            
            with ui.card().classes('w-full p-0 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative group'):
                # Canvas Mockup
                aspect = active_template['size'][0] / active_template['size'][1]
                h = 400
                w = int(h * aspect)
                if w > 350:
                    w = 350
                    h = int(w / aspect)
                
                with ui.column().classes(f'w-full items-center justify-center p-8 bg-slate-50'):
                    with ui.card().classes(f'bg-white rounded shadow-2xl border border-slate-200 p-0 relative overflow-hidden transition-transform group-hover:scale-[1.02] duration-500').style(f'width: {w}px; height: {h}px'):
                        # Render some labels as fake layers
                        ui.label('PREVIEW').classes('absolute inset-0 flex items-center justify-center text-[40px] font-black text-slate-100 opacity-50 rotate-[-20deg] select-none')
                        
                        # Mock dynamic injection of store content
                        for layer in text_layers:
                            layer_id = layer['id']
                            layer_name_clean = layer['name'].lower().strip()
                            detected_field = next((f for f in store.creative if f in layer_name_clean), None)
                            mapped_field = current_mapping.get(layer_id, detected_field)
                            
                            if mapped_field and mapped_field in store.creative:
                                content = store.creative.get(mapped_field) or f'[{mapped_field.upper()}]'
                                ui.label(content).classes('text-[10px] font-bold text-slate-900 absolute').style(f'top: {layer["top"]/active_template["size"][1]*100}%; left: {layer["left"]/active_template["size"][0]*100}%')

                with ui.column().classes('p-6 bg-slate-900 border-t border-slate-800'):
                    with ui.row().classes('w-full justify-between items-center mb-2'):
                        ui.label('Campaign Source').classes('text-[9px] font-black text-slate-500 uppercase')
                        ui.badge('MASTER CREATIVE', color='red-500').classes('text-[8px] font-black px-1.5 py-0.5')
                    
                    ui.label(store.details.campaignName or 'Untitled Campaign').classes('text-sm font-bold text-white')
                    ui.label(store.details.brand or 'No Brand').classes('text-[10px] text-slate-400 font-medium uppercase tracking-wider')

            ui.button('Update Content in Photoshop', icon='sync').classes('w-full bg-slate-900 text-white font-bold rounded-xl h-12 shadow-lg hover:brightness-110')
