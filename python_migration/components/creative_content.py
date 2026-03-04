from nicegui import ui
from theme import THEME
from logic.briefing_store import store

@ui.refreshable
def creative_content():
    def toggle_lock(field):
        store.toggle_field_lock(field)
        creative_content.refresh()

    with ui.column().classes('w-full grow bg-white p-8 gap-8'):
        # Header Area
        with ui.row().classes('w-full items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-2xl'):
            with ui.row().classes('items-center gap-4'):
                with ui.element('div').classes('w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'):
                    ui.icon('brush', size='28px').classes('text-primary')
                with ui.column().classes('gap-0'):
                    ui.label('CREATIVE CONTENT').classes('text-lg font-black tracking-widest text-slate-900')
                    ui.label('Define messaging and visual variations').classes('text-xs text-slate-500 font-bold')

        # Content Grid
        with ui.row().classes('w-full gap-8 items-start'):
            # Tab Selection (Vertical)
            with ui.column().classes('w-64 gap-2'):
                for key, label, icon in [('master', 'Master Assets', 'layers'), ('variants', 'Design Variants', 'style'), ('social', 'Social Adaptations', 'share')]:
                    is_active = (store.active_content_tab == key)
                    bg = 'bg-white border-slate-200 shadow-sm' if is_active else 'border-transparent hover:bg-slate-50'
                    with ui.row().classes(f'w-full p-4 rounded-xl border transition-all cursor-pointer items-center gap-4 {bg}') \
                        .on('click', lambda k=key: (setattr(store, 'active_content_tab', k), content_panels.refresh())):
                        ui.icon(icon, size='20px').classes('text-primary' if is_active else 'text-slate-400')
                        ui.label(label).classes(f'text-xs font-black uppercase tracking-widest {"text-slate-900" if is_active else "text-slate-400"}')

            # Tab Panels (Horizontal)
            with ui.column().classes('flex-1 gap-8'):
                with ui.tabs().classes('w-full p-1 bg-slate-100 rounded-2xl border border-slate-200 h-12 mb-8') as state_tabs:
                    banners_tab = ui.tab('banners', label='Banners & Ads', icon='campaign').classes('flex-1 rounded-xl font-bold text-[11px] text-slate-500')
                    landing_tab = ui.tab('landing', label='Landing Page', icon='web').classes('flex-1 rounded-xl font-bold text-[11px] text-slate-500')
                    newsletter_tab = ui.tab('newsletter', label='Newsletter', icon='mail').classes('flex-1 rounded-xl font-bold text-[11px] text-slate-500')

                with ui.tab_panels(state_tabs, value='banners').classes('w-full bg-transparent p-0'):
                    # --- BANNERS TAB ---
                    with ui.tab_panel('banners').classes('p-0 gap-8 flex flex-col animate-fade-in'):
                        # Main Claim
                        with ui.column().classes('w-full gap-3'):
                            with ui.row().classes('w-full justify-between items-center'):
                                ui.label('Main Claim / Headline').classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                                # Lock Toggle
                                is_locked = 'claim' in store.locked_fields
                                with ui.row().classes('items-center gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200').on('click', lambda: toggle_lock('claim')):
                                    ui.checkbox(value=is_locked).props('dense size=xs color=red').classes('pointer-events-none')
                                    ui.label('LOCK').classes('text-[10px] font-black text-slate-400')
                            
                            ui.input(placeholder='Enter main headline...', value=store.creative.get('claim', '')) \
                                .props(f'outlined bg-color={"slate-50" if is_locked else "white"} {"readonly" if is_locked else ""}') \
                                .classes(f'w-full font-bold text-lg rounded-xl {"border-dashed" if is_locked else ""}') \
                                .on('change', lambda e: store.set_creative_field('claim', e.value))

                        # CTA & Discount Grid
                        with ui.grid(columns=2).classes('w-full gap-8'):
                            # CTA
                            with ui.column().classes('w-full gap-3'):
                                with ui.row().classes('w-full justify-between items-center'):
                                    ui.label('Call to Action').classes('text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1')
                                    is_locked = 'cta' in store.locked_fields
                                    with ui.row().classes('items-center gap-2 cursor-pointer').on('click', lambda: toggle_lock('cta')):
                                        ui.checkbox(value=is_locked).props('dense size=xs color=red')
                                        ui.label('LOCK').classes('text-[9px] font-black text-slate-400')
                                ui.input(placeholder='e.g. Shop Now', value=store.creative.get('cta', '')) \
                                    .props(f'outlined dense bg-color={"slate-50" if is_locked else "white"} {"readonly" if is_locked else ""}') \
                                    .classes(f'w-full font-bold rounded-xl') \
                                    .on('change', lambda e: store.set_creative_field('cta', e.value))
                            
                            # Discount
                            with ui.column().classes('w-full gap-3'):
                                with ui.row().classes('w-full justify-between items-center'):
                                    ui.label('Discount / Offer').classes('text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1')
                                    is_locked = 'discount' in store.locked_fields
                                    with ui.row().classes('items-center gap-2 cursor-pointer').on('click', lambda: toggle_lock('discount')):
                                        ui.checkbox(value=is_locked).props('dense size=xs color=red')
                                        ui.label('LOCK').classes('text-[9px] font-black text-slate-400')
                                ui.input(placeholder='e.g. 50% OFF', value=store.creative.get('discount', '')) \
                                    .props(f'outlined dense bg-color={"slate-50" if is_locked else "white"} {"readonly" if is_locked else ""}') \
                                    .classes(f'w-full font-bold rounded-xl') \
                                    .on('change', lambda e: store.set_creative_field('discount', e.value))

                        ui.separator().classes('bg-slate-100')

                        # USPs Grid
                        with ui.grid(columns=3).classes('w-full gap-6'):
                            for i in range(1, 4):
                                field = f'usp{i}'
                                with ui.column().classes('w-full gap-3'):
                                    with ui.row().classes('w-full justify-between items-center'):
                                        ui.label(f'USP {i}').classes('text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1')
                                        is_locked = field in store.locked_fields
                                        with ui.row().classes('items-center gap-2 cursor-pointer').on('click', lambda field=field: toggle_lock(field)):
                                            ui.checkbox(value=is_locked).props('dense size=xs color=red')
                                            ui.label('LOCK').classes('text-[9px] font-black text-slate-400')
                                    ui.input(placeholder=f'USP {i}', value=store.creative.get(field, '')) \
                                        .props(f'outlined dense bg-color={"slate-50" if is_locked else "white"} {"readonly" if is_locked else ""}') \
                                        .classes(f'w-full font-bold rounded-xl') \
                                        .on('change', lambda e, field=field: store.set_creative_field(field, e.value))

                    # --- LANDING TAB ---
                    with ui.tab_panel('landing').classes('p-0 gap-8 flex flex-col animate-fade-in'):
                        for field, label, is_area in [
                            ('title', 'Page Title (H1)', False),
                            ('subtitle', 'Subtitle (H2)', False),
                            ('body', 'Body Copy', True),
                            ('cta', 'Primary CTA', False)
                        ]:
                            with ui.column().classes('w-full gap-3'):
                                ui.label(label).classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                                if is_area:
                                    ui.textarea(placeholder=f"Enter {label.lower()}...") \
                                        .props('outlined') \
                                        .classes('w-full rounded-xl min-h-[120px]') \
                                        .bind_value(store.landing, field)
                                else:
                                    ui.input(placeholder=f"Enter {label.lower()}...") \
                                        .props('outlined dense') \
                                        .classes('w-full font-bold rounded-xl') \
                                        .bind_value(store.landing, field)

                    # --- NEWSLETTER TAB ---
                    with ui.tab_panel('newsletter').classes('p-0 gap-8 flex flex-col animate-fade-in'):
                        for field, label, is_area in [
                            ('subject', 'Subject Line', False),
                            ('preview', 'Preview Text (Preheader)', False),
                            ('header', 'Headline', False),
                            ('body', 'Body Copy', True),
                            ('cta', 'Button CTA', False)
                        ]:
                            with ui.column().classes('w-full gap-3'):
                                ui.label(label).classes('text-xs font-bold text-slate-500 uppercase tracking-wider ml-1')
                                if is_area:
                                    ui.textarea(placeholder=f"Enter {label.lower()}...") \
                                        .props('outlined') \
                                        .classes('w-full rounded-xl min-h-[120px]') \
                                        .bind_value(store.newsletter, field)
                                else:
                                    ui.input(placeholder=f"Enter {label.lower()}...") \
                                        .props('outlined dense') \
                                        .classes('w-full font-bold rounded-xl') \
                                        .bind_value(store.newsletter, field)
