from nicegui import ui
from theme import THEME
from logic.briefing_store import store

def content_form():
    with ui.card().classes('w-full bg-white border border-base p-0 rounded-xl shadow-sm overflow-hidden'):
        with ui.row().classes('p-6 items-center gap-3 border-b border-base'):
            ui.icon('title', color='red-600').classes('text-xl')
            ui.label('Creative Content & Copy').classes('text-lg font-bold text-zinc-900')
        
        with ui.column().classes('p-6 gap-8'):
            with ui.tabs().classes('w-full bg-zinc-50 p-1 rounded-xl border border-zinc-100') as inner_tabs:
                ui.tab('Banners & Ads').classes('flex-1 rounded-lg text-xs font-bold')
                ui.tab('Landing Page').classes('flex-1 rounded-lg text-xs font-bold')
                ui.tab('Newsletter').classes('flex-1 rounded-lg text-xs font-bold')

            with ui.tab_panels(inner_tabs, value='Banners & Ads').classes('w-full bg-transparent p-0 mt-6'):
                # BANNERS TAB
                with ui.tab_panel('Banners & Ads'):
                    with ui.column().classes('w-full gap-6'):
                        # Headline
                        with ui.column().classes('w-full gap-2'):
                            with ui.row().classes('w-full justify-between items-center'):
                                ui.label('Main Claim / Headline').classes('text-[12px] font-bold text-zinc-500 ml-1')
                                with ui.row().classes('items-center gap-2 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-100'):
                                    ui.checkbox().props('size=xs').bind_value(store.content['Banners'], 'locked')
                                    ui.label('LOCK').classes('text-[8px] font-black text-zinc-400')
                            ui.input(placeholder='Enter main headline...').classes('w-full').props('outlined dense bg-color=zinc-50 font-bold') \
                                .bind_value(store.content['Banners'], 'headline')
                        
                        # CTA & Discount
                        with ui.grid(columns=2).classes('w-full gap-6'):
                            with ui.column().classes('gap-2'):
                                ui.label('Call to Action').classes('text-[12px] font-bold text-zinc-500 ml-1')
                                ui.input(placeholder='e.g. Shop Now').classes('w-full').props('outlined dense bg-color=zinc-50 font-bold') \
                                    .bind_value(store.content['Banners'], 'cta')
                            
                            with ui.column().classes('gap-2'):
                                ui.label('Discount / Offer').classes('text-[12px] font-bold text-zinc-500 ml-1')
                                ui.input(placeholder='e.g. 50% OFF').classes('w-full').props('outlined dense bg-color=zinc-50 font-bold') \
                                    .bind_value(store.content['Banners'], 'offer')

                        ui.separator().classes('bg-zinc-100')

                        # USPs
                        with ui.grid(columns=3).classes('w-full gap-6'):
                            for i in range(1, 4):
                                with ui.column().classes('gap-2'):
                                    ui.label(f'USP {i}').classes('text-[12px] font-bold text-zinc-500 ml-1')
                                    ui.input(placeholder=f'USP {i}').classes('w-full').props('outlined dense bg-color=zinc-50') \
                                        .bind_value(store.content['Banners'], f'usp{i}')

                # LANDING PAGE TAB
                with ui.tab_panel('Landing Page'):
                    ui.label('Landing Page copy settings coming soon...').classes('text-zinc-500 italic text-center p-12')

                # NEWSLETTER TAB
                with ui.tab_panel('Newsletter'):
                    ui.label('Newsletter copy settings coming soon...').classes('text-zinc-500 italic text-center p-12')
