from nicegui import ui
from theme import THEME
from logic.briefing_store import store, MARKETS

# State for translations manager (persists across refreshes)
translations_state = {'active_lang': None}

@ui.refreshable
def translations_manager():
    target_langs = store.get_target_languages()
    
    # Initialize state if needed
    if translations_state['active_lang'] is None and target_langs:
        translations_state['active_lang'] = target_langs[0]
    elif translations_state['active_lang'] not in target_langs and target_langs:
        translations_state['active_lang'] = target_langs[0]
        
    state = translations_state

    def calculate_progress(lang):
        total = 0
        completed = 0
        trans = store.translations.get(lang, {})
        
        # Banners
        for f in ['claim', 'discount', 'cta', 'usp1', 'usp2', 'usp3']:
            if store.creative.get(f):
                total += 1
                if trans.get(f): completed += 1
        
        # Landing
        if any(store.landing.values()):
            for f in ['title', 'subtitle', 'body', 'cta']:
                if store.landing.get(f):
                    total += 1
                    if trans.get('landing', {}).get(f): completed += 1
        
        # Newsletter
        if any(store.newsletter.values()):
            for f in ['subject', 'preview', 'header', 'body', 'cta']:
                if store.newsletter.get(f):
                    total += 1
                    if trans.get('newsletter', {}).get(f): completed += 1
                    
        return 100 if total == 0 else int((completed / total) * 100)

    if not target_langs:
        with ui.column().classes('w-full items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center'):
            ui.icon('check_circle', size='lg').classes('text-slate-300 mb-4')
            ui.label('No Translations Needed').classes('text-lg font-bold text-slate-900')
            ui.label(f'All active markets use the Master Language ({getattr(store.details, "defaultLanguage", "EN").upper()}).').classes('text-sm text-slate-500 max-w-xs')
            return

    with ui.row().classes('w-full h-[700px] border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm flex-nowrap'):
        # 1. Sidebar (Language Queue)
        with ui.column().classes('w-[280px] h-full bg-slate-50 border-r border-slate-200 shrink-0'):
            with ui.row().classes('w-full h-16 px-6 items-center border-b border-slate-200'):
                ui.label('LANGUAGE QUEUE').classes('text-[10px] font-black text-slate-400 tracking-widest')
            
            with ui.scroll_area().classes('w-full flex-1'):
                with ui.column().classes('w-full p-4 gap-3'):
                    for lang in target_langs:
                        progress = calculate_progress(lang)
                        is_active = state['active_lang'] == lang
                        
                        def set_active(l):
                            state['active_lang'] = l
                            translations_manager.refresh()
                        
                        # Custom clickable button container
                        with ui.column().classes(f'w-full p-4 rounded-2xl border transition-all cursor-pointer \
                            {"bg-white border-slate-300 shadow-md ring-1 ring-slate-200" if is_active else "bg-transparent border-transparent hover:bg-slate-100 text-slate-500"}') \
                            .on('click', lambda l=lang: set_active(l)):
                            
                            with ui.row().classes('w-full items-center justify-between'):
                                with ui.row().classes('items-center gap-3'):
                                    bg_circle = f'bg-[{THEME["primary"]}] text-white' if is_active else 'bg-slate-200 text-slate-600'
                                    ui.label(lang.upper()).classes(f'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black {bg_circle}')
                                    ui.label(lang.upper()).classes('text-sm font-bold text-slate-900') # Placeholder for full name
                                ui.label(f'{progress}%').classes('text-xs font-mono font-bold text-slate-400')
                            
                            # Progress bar
                            with ui.row().classes('w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden'):
                                bar_color = 'bg-green-500' if progress == 100 else f'bg-[{THEME["primary"]}]'
                                ui.row().classes(f'h-full {bar_color} transition-all').style(f'width: {progress}%')

        # 2. Main Area (Fields)
        with ui.column().classes('flex-1 h-full bg-white min-w-0'):
            # Header
            with ui.row().classes('w-full h-16 px-8 items-center border-b border-slate-200 justify-between shrink-0'):
                with ui.row().classes('items-center gap-3'):
                    ui.icon('public').classes('text-slate-400 text-lg')
                    ui.label(f'Translating to {state["active_lang"].upper()}').classes('text-base font-bold text-slate-900')
                ui.button('Auto-Translate Page', icon='auto_fix_high').props('flat size=sm').classes('text-slate-500 font-bold text-xs hover:text-slate-900')

            # Tabs & Content
            with ui.scroll_area().classes('w-full flex-1'):
                with ui.column().classes('w-full p-8 max-w-3xl mx-auto gap-8'):
                    
                    def render_field(label, master_val, trans_path):
                        lang = state['active_lang']
                        t_data = store.translations.get(lang, {})
                        
                        # Resolve current value from store
                        if len(trans_path) == 1:
                            if isinstance(t_data, dict):
                                current_val = t_data.get(trans_path[0], '')
                            else:
                                current_val = ''
                        else:
                            if isinstance(t_data, dict) and isinstance(t_data.get(trans_path[0]), dict):
                                current_val = t_data.get(trans_path[0], {}).get(trans_path[1], '')
                            else:
                                current_val = ''

                        def on_value_change(e, path):
                            l = state['active_lang']
                            if l not in store.translations:
                                store.translations[l] = {}
                            
                            if len(path) == 1:
                                store.translations[l][path[0]] = e.value
                            else:
                                if path[0] not in store.translations[l]:
                                    store.translations[l][path[0]] = {}
                                store.translations[l][path[0]][path[1]] = e.value
                        
                        with ui.column().classes('w-full gap-2'):
                            ui.label(label).classes('text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1')
                            # Master Value Box
                            ui.label(master_val or 'Not set').classes('w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic')
                            # Translation Input
                            ui.textarea(
                                value=current_val,
                                placeholder=f'Translate to {lang.upper()}...',
                                on_change=lambda e, p=trans_path: on_value_change(e, p)
                            ).props('outlined autogrow') \
                             .classes('w-full rounded-xl text-sm font-bold bg-white focus:bg-white transition-all')

                    # Section: Banners
                    ui.label('Banners & Ads').classes('text-xs font-black text-slate-300 uppercase tracking-[0.2em]')
                    for f in ['claim', 'cta', 'discount', 'usp1', 'usp2', 'usp3']:
                        if store.creative.get(f):
                            render_field(f.replace('_', ' ').upper(), store.creative.get(f), [f])

                    # Section: Landing
                    if any(store.landing.values()):
                        ui.separator().classes('bg-slate-100 my-4')
                        ui.label('Landing Page').classes('text-xs font-black text-slate-300 uppercase tracking-[0.2em]')
                        for f in ['title', 'subtitle', 'body', 'cta']:
                            if store.landing.get(f):
                                render_field(f.upper(), store.landing.get(f), ['landing', f])

                    # Section: Newsletter
                    if any(store.newsletter.values()):
                        ui.separator().classes('bg-slate-100 my-4')
                        ui.label('Newsletter').classes('text-xs font-black text-slate-300 uppercase tracking-[0.2em]')
                        for f in ['subject', 'preview', 'header', 'body', 'cta']:
                            if store.newsletter.get(f):
                                render_field(f.upper(), store.newsletter.get(f), ['newsletter', f])
